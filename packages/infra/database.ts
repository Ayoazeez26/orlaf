import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"
import * as random from "@pulumi/random"
import { commonTags, isProd, stackName } from "./index"
import { defaultVpc, rdsPostgresSg } from "./networking"

// ─── Master password ──────────────────────────────────────────────────────────
// Generated once per stack, stored in Secrets Manager.
// Never appears in plaintext in state or logs.

const dbPassword = new random.RandomPassword("db-master-password", {
    length: 32,
    special: true,
    // RDS disallows these characters in passwords
    overrideSpecial: "!#$%&*()-_=+[]{}|;:,.<>?",
})

// ─── DB subnet group ──────────────────────────────────────────────────────────
// Uses all subnets in the default VPC.
// RDS requires a subnet group even when using the default VPC.

const defaultSubnets = aws.ec2.getSubnetsOutput({
    filters: [
        {
            name: "vpc-id",
            values: [defaultVpc.id],
        },
    ],
})

const dbSubnetGroup = new aws.rds.SubnetGroup("db-subnet-group", {
    name: `sable-db-subnet-group-${stackName}`,
    subnetIds: defaultSubnets.ids,
    tags: {
        ...commonTags,
        Name: `sable-db-subnet-group-${stackName}`,
    },
})

// ─── RDS Postgres instance ────────────────────────────────────────────────────

export const dbInstance = new aws.rds.Instance("rds-postgres", {
    identifier: `sable-postgres-${stackName}`,

    // Engine
    engine: "postgres",
    engineVersion: "16",
    instanceClass: "db.t4g.small",

    // Storage
    allocatedStorage: 20,
    storageType: "gp3",
    storageEncrypted: true,

    // Credentials
    dbName: "sable",
    username: "sable_admin",
    password: dbPassword.result,

    // Networking — private, no public access
    dbSubnetGroupName: dbSubnetGroup.name,
    vpcSecurityGroupIds: [rdsPostgresSg.id],
    publiclyAccessible: false,
    multiAz: false,

    // Backups
    backupRetentionPeriod: 7,
    backupWindow: "03:00-04:00", // 3-4am UTC daily snapshot
    maintenanceWindow: "mon:04:00-mon:05:00",

    // Deletion protection on prod, off on dev so destroy works cleanly
    deletionProtection: isProd,
    skipFinalSnapshot: !isProd,
    finalSnapshotIdentifier: isProd
        ? `sable-postgres-prod-final-${Date.now()}`
        : undefined,

    tags: {
        ...commonTags,
        Name: `sable-postgres-${stackName}`,
    },
})

// ─── Secrets Manager — DB credentials ────────────────────────────────────────
// Stores the full connection details as a JSON secret.
// The CI deploy role and App Runner task role will be granted read access
// in the secrets/IAM tickets.

export const dbSecret = new aws.secretsmanager.Secret("db-credentials", {
    name: `sable/${stackName}/db/credentials`,
    description: `RDS Postgres master credentials for sable-${stackName}`,
    tags: {
        ...commonTags,
        Name: `sable-${stackName}-db-credentials`,
    },
})

export const dbSecretVersion = new aws.secretsmanager.SecretVersion(
    "db-credentials-version",
    {
        secretId: dbSecret.id,
        secretString: pulumi
            .all([dbInstance.address, dbPassword.result])
            .apply(([host, password]) =>
                JSON.stringify({
                    engine: "postgres",
                    host,
                    port: 5432,
                    dbname: "sable",
                    username: "sable_admin",
                    password,
                    // Convenience field — App Runner and migration job can use this directly
                    url: `postgresql://sable_admin:${encodeURIComponent(password)}@${host}:5432/sable`,
                })
            ),
    }
)

// ─── Stack outputs ────────────────────────────────────────────────────────────
// Consumed by App Runner (KAN-44) and the migration CI job.

export const dbEndpoint = dbInstance.address
export const dbPort = dbInstance.port
export const dbSecretArn = dbSecret.arn
export const dbSecretName = dbSecret.name
