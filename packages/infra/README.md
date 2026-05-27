# infra/

Sable platform AWS infrastructure, managed with [Pulumi](https://www.pulumi.com/) (TypeScript).

All infrastructure changes go through this directory and are reviewed in PRs. No manual console clicks for anything that lives here.

---

## Prerequisites

| Tool | Install |
|------|---------|
| Pulumi CLI | `brew install pulumi` |
| Node.js ≥ 20 | [nodejs.org](https://nodejs.org) |
| AWS CLI | `brew install awscli` |

---

## AWS account structure

We use **AWS IAM Identity Center (SSO)** with **AWS Organizations** for authentication. There are no long-lived access keys — credentials are short-lived (8 hours) and obtained via browser login.

| Profile | Account | Purpose |
|---------|---------|---------|
| `sable-dev` | Company AWS account | All development and testing |
| `sable-prod` | Separate AWS account (future) | Production — added when going live |

---

## One-time AWS console setup (done once by account owner)

These steps only need to be done once in the AWS console. If you're joining an existing team, skip to [First-time local setup](#first-time-local-setup).

### 1. Enable IAM Identity Center

1. In the AWS console, search for **IAM Identity Center**
2. Click **Enable** and accept the AWS Organizations prompt
3. Leave the identity source as **Identity Center directory** (default)
4. Region should be **US East (N. Virginia) / us-east-1**

### 2. Create a permission set

1. IAM Identity Center → **Permission sets → Create permission set**
2. Choose **Predefined permission set** → `AdministratorAccess`
3. Keep the default name and create it

### 3. Create a user for each developer

1. IAM Identity Center → **Users → Add user**
2. Enter their email and name
3. They'll receive a confirmation email to set their password

### 4. Assign each user to the AWS account

1. IAM Identity Center → **AWS accounts** (left sidebar)
2. Check your account → **Assign users or groups**
3. Select the user → Next
4. Select the `AdministratorAccess` permission set → Submit

### 5. Note the SSO start URL

IAM Identity Center → **Dashboard** → copy the **AWS access portal URL**. It looks like:
```
https://something.awsapps.com/start
```

Share this URL with all developers — they need it for local setup.

---

## First-time local setup

Every developer runs this once on their machine.

### 1. Install tools

```bash
brew install pulumi awscli
```

### 2. Configure the AWS SSO profile

```bash
aws configure sso --profile sable-dev
```

When prompted:
```
SSO session name:        sable
SSO start URL:           https://something.awsapps.com/start   # get this from account owner
SSO region:              us-east-1
SSO registration scopes: sso:account:access
CLI default region:      us-east-1
CLI default output:      json
```

A browser window will open — log in with your IAM Identity Center credentials and click **Allow**.

### 3. Verify access

```bash
aws sts get-caller-identity --profile sable-dev
```

You should see your account ID and user ARN. If you see that, you're in.

### 4. Install infra dependencies

```bash
cd infra
pnpm install
```

### 5. Set the Pulumi secrets passphrase

Pulumi uses this to encrypt secrets in the stack config files. Get the passphrase from 1Password (or whoever set up the project) and add it to your shell:

```bash
# Add to ~/.zshrc or ~/.bashrc
export PULUMI_CONFIG_PASSPHRASE="get-this-from-1password"
```

### 6. Log in to the Pulumi state backend

```bash
cd infra
AWS_PROFILE=sable-dev pulumi login 's3://sable-infra-state?region=us-east-1'
```

### 7. Add environment variables to your shell

Add these to your `~/.zshrc` or `~/.bashrc` so you don't have to prefix every command:

```bash
export AWS_PROFILE=sable-dev
export PULUMI_BACKEND_URL='s3://sable-infra-state?region=us-east-1'
export PULUMI_CONFIG_PASSPHRASE="get-this-from-1password"
```

Then reload:
```bash
source ~/.zshrc
```

### 8. Smoke check

```bash
cd infra
pnpm preview:dev
```

Expected output:
```
Previewing update (dev):

Resources:
    No changes.
```

You're set up.

---

## Bootstrap (first person only)

The very first person setting up the project needs to create the S3 state bucket and DynamoDB lock table. Everyone else skips this.

```bash
# Log in to AWS first
aws sso login --profile sable-dev

# Run the bootstrap script
bash infra/bootstrap.sh
```

This creates in the `sable-dev` AWS account:
- S3 bucket `sable-infra-state` — versioned, encrypted, private — stores Pulumi state
- DynamoDB table `sable-infra-state-lock` — prevents two simultaneous deploys corrupting state

---

## Known gotchas

These are real issues we hit during setup — saved here so the next person doesn't spend time debugging them.

**Config namespace is `sable-infra:`, not `sable:`**
The project is named `sable-infra` so all config keys use that as the namespace. When setting config manually always use `sable-infra:`:
```bash
pulumi config set sable-infra:rootDomain sable.example --stack dev
```
Using `sable:` looks like it works (exit code 0) but the values are silently ignored.

**`pulumi config set` exits 0 even when it fails**
If `PULUMI_CONFIG_PASSPHRASE` is not set, Pulumi prompts for the passphrase interactively. If the prompt isn't answered correctly the command exits 0 but writes nothing. Always set `PULUMI_CONFIG_PASSPHRASE` as an env var before running any config commands.

**S3 backend URL must include the region**
`s3://sable-infra-state` alone causes a `MissingRegion` error. Always use the full URL:
```bash
pulumi login 's3://sable-infra-state?region=us-east-1'
```

**`prod` stack is selected by default after bootstrap**
After `pulumi stack init`, the last stack initialised becomes active. Always check which stack is active before running commands:
```bash
pulumi stack ls   # look for the * next to the active stack
```

**`Pulumi.dev.yaml` is not the source of truth after stack init**
The stack YAML files are only read when Pulumi initialises a new stack. Once a stack exists in the S3 backend, config must be set via `pulumi config set` — editing the YAML directly has no effect on the running stack. The YAML files are committed to git as documentation of what values should be set, but the backend is what Pulumi actually reads.

---

## Daily workflow

### Start of session — log in to AWS

SSO credentials expire after 8 hours. Re-login when they expire:

```bash
aws sso login --profile sable-dev
```

### Log in to Pulumi state backend

```bash
AWS_PROFILE=sable-dev pulumi login 's3://sable-infra-state?region=us-east-1'
```

> If you set `PULUMI_BACKEND_URL` in your shell (recommended), you can skip this — Pulumi logs in automatically.

### Select a stack

```bash
pulumi stack select dev
# or
pulumi stack select prod
```

Check which stack is active:
```bash
pulumi stack ls
```

### Preview changes (dry-run — always do this first)

```bash
pnpm preview:dev
pnpm preview:prod
```

`preview` never touches AWS. It shows exactly what would be created, updated, or destroyed.

### Deploy

```bash
# Deploy dev
pnpm up:dev

# Deploy prod — always preview first
pnpm preview:prod
pnpm up:prod
```

`pulumi up` shows the preview again and asks for confirmation before making any changes.

### Refresh state

If a manual console change was made (please don't), sync the state file:

```bash
pnpm refresh:dev
```

### Destroy (dev only)

```bash
pnpm destroy:dev
```

Never run destroy against prod without a team discussion.

---

## Adding a prod account (when going live)

Because you're already using AWS Organizations, adding a prod account is straightforward:

1. **AWS Organizations → Create an account** → name it `sable-prod`
2. **IAM Identity Center → AWS accounts** → assign developers to the new account with `AdministratorAccess`
3. Each developer runs:
   ```bash
   aws configure sso --profile sable-prod
   # Use the same SSO start URL, select the prod account when prompted
   ```
4. Deploy:
   ```bash
   pulumi stack select prod
   pulumi preview
   pulumi up
   ```

Nothing else changes — `Pulumi.prod.yaml` already has `aws:profile: sable-prod` set.

---

## Project structure

```
infra/
├── index.ts              ← Pulumi entrypoint; imports resource modules
├── Pulumi.yaml           ← Project definition, state backend URL, config schema
├── Pulumi.dev.yaml       ← Dev stack config values
├── Pulumi.prod.yaml      ← Prod stack config values
├── bootstrap.sh          ← One-time state backend setup (first person only)
├── package.json
├── tsconfig.json
└── README.md

# As resources are added, they'll live in sub-modules:
# ├── networking.ts       ← VPC, subnets, security groups
# ├── database.ts         ← RDS instance
# ├── apprunner.ts        ← App Runner service
# ├── storage.ts          ← S3 buckets
# └── secrets.ts          ← Secrets Manager
```

---

## Config schema

All config keys are declared in `Pulumi.yaml` and validated before every preview/up.

| Key | Dev | Prod | Description |
|-----|-----|------|-------------|
| `aws:region` | `us-east-1` | `us-east-1` | AWS region |
| `aws:profile` | `sable-dev` | `sable-prod` | AWS CLI profile |
| `sable:rootDomain` | `sable.example` | `sable.example` | Root domain (placeholder until Phase 3) |
| `sable:dbInstanceClass` | `db.t3.micro` | `db.t3.medium` | RDS instance class |
| `sable:appRunnerCpu` | `0.5 vCPU` | `2 vCPU` | App Runner CPU |
| `sable:appRunnerMemory` | `1 GB` | `4 GB` | App Runner memory |

### Adding a new config key

1. Declare it in `Pulumi.yaml` under `config:`:

```yaml
config:
  sable:myNewKey:
    type: string
    description: What this key does
```

2. Set the value in both stack files:

```bash
pulumi config set sable:myNewKey some-dev-value --stack dev
pulumi config set sable:myNewKey some-prod-value --stack prod
```

3. Read it in TypeScript:

```typescript
const config = new pulumi.Config("sable");
const myNewKey = config.require("myNewKey");
```

For secrets, use `config.requireSecret()` — Pulumi encrypts the value in the stack file:

```bash
pulumi config set --secret sable:dbPassword hunter2 --stack dev
```

---

## Networking

We use the **default VPC** for MVP — no custom VPC, subnets, route tables, or NAT gateway.

### Security groups

| Name | Stack resource | Purpose |
|------|---------------|---------|
| `sable-app-runner-connector-<stack>` | `appRunnerConnectorSg` | Attached to the App Runner VPC connector. Allows all outbound, no inbound. |
| `sable-rds-postgres-<stack>` | `rdsPostgresSg` | Attached to RDS. Allows inbound on port 5432 from `appRunnerConnectorSg` only. |

### Stack outputs

After `pulumi up`, retrieve the security group IDs:

```bash
pulumi stack output --stack dev
```

| Output | Used by |
|--------|---------|
| `appRunnerConnectorSg` | App Runner VPC connector resource (KAN-44) |
| `rdsPostgresSg` | RDS instance resource (KAN-43) |

Reference them in other resource modules:

```typescript
import { appRunnerConnectorSg, rdsPostgresSg } from "./index";
```

---

## Adding a new resource

1. Create a new file, e.g. `infra/networking.ts`:

```typescript
import * as aws from "@pulumi/aws";
import { commonTags, stackName } from "./index";

export const vpc = new aws.ec2.Vpc(`sable-vpc-${stackName}`, {
  cidrBlock: "10.0.0.0/16",
  tags: { ...commonTags, Name: `sable-vpc-${stackName}` },
});
```

2. Import it in `index.ts`:

```typescript
export * from "./networking";
```

3. Run `pulumi preview --stack dev` to validate before committing.

---

## Stack outputs

Outputs exported from `index.ts` are visible after deploy:

```bash
pulumi stack output --stack dev
```

---

## Secrets

Never commit secrets to `Pulumi.<stack>.yaml` in plaintext:

```bash
pulumi config set --secret sable:someSecret <value> --stack dev
```

Pulumi encrypts it using the `PULUMI_CONFIG_PASSPHRASE` env var. Store the passphrase in 1Password. In CI, set it as a repository secret.

---

## CI

Add to your GitHub Actions workflow to run preview on every PR touching `infra/`:

```yaml
- name: Configure AWS SSO credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::<account-id>:role/GitHubActionsRole
    aws-region: us-east-1

- name: Pulumi preview (dev)
  working-directory: infra
  env:
    PULUMI_CONFIG_PASSPHRASE: ${{ secrets.PULUMI_CONFIG_PASSPHRASE }}
  run: |
    pulumi login s3://sable-infra-state
    pnpm preview:dev
```

> Note: CI uses an IAM role with OIDC (not SSO) — that setup is covered in the CI hardening ticket.