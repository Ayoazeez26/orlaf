import * as pulumi from "@pulumi/pulumi"

// ─── Config ───────────────────────────────────────────────────────────────────
// All keys are declared in Pulumi.yaml and set per-stack in Pulumi.<stack>.yaml.
// Pulumi validates required keys are present before preview/up runs.

const config = new pulumi.Config()
const awsConfig = new pulumi.Config("aws")

export const region = awsConfig.require("region")
export const rootDomain = config.require("rootDomain")
export const dbInstanceClass = config.require("dbInstanceClass")
export const appRunnerCpu = config.require("appRunnerCpu")
export const appRunnerMemory = config.require("appRunnerMemory")

// ─── Stack identity ───────────────────────────────────────────────────────────
// Useful as a tag value and for conditional logic (e.g. only enable deletion
// protection on prod).

export const stackName = pulumi.getStack()
export const projectName = pulumi.getProject()

// isProd is exported so resource modules can gate behaviour:
//   import { isProd } from "../index";
//   deletionProtection: isProd,
export const isProd = stackName === "prod"

// ─── Common tags ─────────────────────────────────────────────────────────────
// Apply these to every AWS resource so costs and ownership are traceable.

export const commonTags = {
    Project: projectName,
    Stack: stackName,
    ManagedBy: "pulumi",
}

// ─── Resources ───────────────────────────────────────────────────────────────

export {
    dbEndpoint,
    dbInstance,
    dbPort,
    dbSecretArn,
    dbSecretName,
} from "./database"


export {
    appRunnerConnectorSg,
    defaultVpcId,
    rdsPostgresSg,
} from "./networking"

// Future modules slot in here as tickets are completed:
//   export * from "./apprunner";    // App Runner service  (KAN-44)
//   export * from "./storage";      // S3 buckets
//   export * from "./secrets";      // Secrets Manager
