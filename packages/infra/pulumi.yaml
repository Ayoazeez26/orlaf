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
| Named AWS profiles | See below |

### AWS CLI profiles

Two profiles are required — one per account:

```bash
# ~/.aws/config

[profile sable-dev]
region = us-east-1
# ... credentials or SSO config

[profile sable-prod]
region = us-east-1
# ... credentials or SSO config
```

Verify access:
```bash
aws sts get-caller-identity --profile sable-dev
aws sts get-caller-identity --profile sable-prod
```

---

## First-time setup

**This only needs to be done once**, by whoever bootstraps the project.

```bash
# 1. Install Pulumi
brew install pulumi

# 2. Install infra dependencies
cd infra
pnpm install

# 3. Run the bootstrap script — creates the S3 state bucket,
#    DynamoDB lock table, and initializes both stacks.
bash bootstrap.sh
```

The bootstrap script creates in the `sable-dev` AWS account:
- S3 bucket `sable-infra-state` — versioned, encrypted, private
- DynamoDB table `sable-infra-state-lock` — for deploy locking

After bootstrap, every developer on the team just needs to log in:

```bash
cd infra
pulumi login s3://sable-infra-state
```

---

## Daily workflow

### Log in to the state backend

```bash
cd infra
AWS_PROFILE=sable-dev pulumi login s3://sable-infra-state
```

You only need to do this once per terminal session (or after a logout).

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
# Via pnpm scripts
pnpm preview:dev
pnpm preview:prod

# Or directly
pulumi preview --stack dev
pulumi preview --stack prod
```

`preview` never changes anything in AWS. It shows exactly what *would* be created, updated, or destroyed.

### Deploy

```bash
# Deploy dev
pnpm up:dev

# Deploy prod — always preview first
pnpm preview:prod
pnpm up:prod
```

`pulumi up` will show the preview again and ask for confirmation before making any changes.

### Refresh state

If someone made a manual change in the AWS console (please don't), sync the state file:

```bash
pnpm refresh:dev
```

### Destroy (dev only)

```bash
pnpm destroy:dev
```

Never run destroy against prod without a team discussion.

---

## Project structure

```
infra/
├── index.ts              ← Pulumi entrypoint; imports resource modules
├── Pulumi.yaml           ← Project definition, state backend URL, config schema
├── Pulumi.dev.yaml       ← Dev stack config values
├── Pulumi.prod.yaml      ← Prod stack config values
├── bootstrap.sh          ← One-time state backend setup script
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

All config keys are declared in `Pulumi.yaml` and validated before every preview/up. Values are set per-stack in `Pulumi.<stack>.yaml`.

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
# Pulumi.dev.yaml
pulumi config set sable:myNewKey some-dev-value --stack dev

# Pulumi.prod.yaml
pulumi config set sable:myNewKey some-prod-value --stack prod
```

Or edit the YAML files directly — they're just config files.

3. Read it in `index.ts` (or any resource module):

```typescript
const config = new pulumi.Config("sable");
const myNewKey = config.require("myNewKey");
```

For secrets (API keys, passwords), use `config.requireSecret()` instead — Pulumi encrypts the value in the stack file:

```bash
pulumi config set --secret sable:dbPassword hunter2 --stack dev
```

```typescript
const dbPassword = config.requireSecret("dbPassword");
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

They're also importable into other Pulumi stacks via stack references (useful when networking and app infra are split across stacks).

---

## Secrets

Never commit secrets to `Pulumi.<stack>.yaml` in plaintext. Use:

```bash
pulumi config set --secret sable:someSecret <value> --stack dev
```

Pulumi encrypts it in the YAML using the stack's secrets provider (passphrase by default — the `PULUMI_CONFIG_PASSPHRASE` env var).

In CI, set `PULUMI_CONFIG_PASSPHRASE` as a repository secret.

---

## CI

Add to your GitHub Actions workflow to run preview on every PR that touches `infra/`:

```yaml
- name: Pulumi preview (dev)
  working-directory: infra
  env:
    AWS_PROFILE: sable-dev
    PULUMI_CONFIG_PASSPHRASE: ${{ secrets.PULUMI_CONFIG_PASSPHRASE }}
  run: |
    pulumi login s3://sable-infra-state
    pnpm preview:dev
```