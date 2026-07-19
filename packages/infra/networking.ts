import * as aws from "@pulumi/aws";
import { commonTags, stackName } from "./index";

// ─── Default VPC ─────────────────────────────────────────────────────────────
// We use the default VPC for MVP. No custom VPC, subnets, route tables,
// or NAT gateway are created here — that's a post-MVP concern.

export const defaultVpc = aws.ec2.getVpcOutput({ default: true });
export const defaultVpcId = defaultVpc.id;

// ─── Security group: App Runner VPC connector ─────────────────────────────────
// Attached to the App Runner VPC connector so App Runner can reach RDS.
// Allows all outbound traffic — App Runner needs to reach RDS (5432),
// Secrets Manager, and other AWS services.

export const appRunnerConnectorSg = new aws.ec2.SecurityGroup(
    "app-runner-connector-sg",
    {
        name: `sable-app-runner-connector-${stackName}`,
        description: "Security group for the App Runner VPC connector",
        vpcId: defaultVpcId,

        // No inbound rules — App Runner connector only initiates outbound connections.
        ingress: [],

        egress: [
            {
                description: "Allow all outbound (HTTPS to AWS services)",
                protocol: "-1",
                fromPort: 0,
                toPort: 0,
                cidrBlocks: ["0.0.0.0/0"],
            },
        ],

        tags: {
            ...commonTags,
            Name: `sable-app-runner-connector-${stackName}`,
        },
    }
);

// ─── Security group: RDS Postgres ────────────────────────────────────────────
// Attached to the RDS instance. Only accepts inbound on port 5432,
// and only from the App Runner connector security group above.
// Nothing else can reach the database.

export const rdsPostgresSg = new aws.ec2.SecurityGroup("rds-postgres-sg", {
    name: `sable-rds-postgres-${stackName}`,
    description: "Security group for RDS Postgres - inbound from App Runner only",
    vpcId: defaultVpcId,

    ingress: [
        {
            description: "Postgres from App Runner connector",
            protocol: "tcp",
            fromPort: 5432,
            toPort: 5432,
            securityGroups: [appRunnerConnectorSg.id],
        },
    ],

    // No outbound rules needed — RDS only responds, never initiates.
    egress: [],

    tags: {
        ...commonTags,
        Name: `sable-rds-postgres-${stackName}`,
    },
});