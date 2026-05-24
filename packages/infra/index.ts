import * as pulumi from "@pulumi/pulumi";

// ─── Config ───────────────────────────────────────────────────────────────────
// All keys are declared in Pulumi.yaml and set per-stack in Pulumi.<stack>.yaml.
// Pulumi validates required keys are present before preview/up runs.

const config = new pulumi.Config("sable");
const awsConfig = new pulumi.Config("aws");

export const region = awsConfig.require("region");
export const rootDomain = config.require("rootDomain");
export const dbInstanceClass = config.require("dbInstanceClass");
export const appRunnerCpu = config.require("appRunnerCpu");
export const appRunnerMemory = config.require("appRunnerMemory");

// ─── Stack identity ───────────────────────────────────────────────────────────
// Useful as a tag value and for conditional logic (e.g. only enable deletion
// protection on prod).

export const stackName = pulumi.getStack();
export const projectName = pulumi.getProject();

// isProd is exported so resource modules can gate behaviour:
//   import { isProd } from "../index";
//   deletionProtection: isProd,
export const isProd = stackName === "prod";

// ─── Common tags ─────────────────────────────────────────────────────────────
// Apply these to every AWS resource so costs and ownership are traceable.

export const commonTags = {
    Project: projectName,
    Stack: stackName,
    ManagedBy: "pulumi",
};

// ─── Resources ───────────────────────────────────────────────────────────────
// This file is intentionally empty of resources — KAN-41 is the bootstrap
// ticket. Add resources in subsequent tickets and import them here.
//
// Example structure as the project grows:
//
//   import "./networking";   // VPC, subnets, security groups
//   import "./database";     // RDS instance
//   import "./apprunner";    // App Runner service
//   import "./storage";      // S3 buckets
//   import "./secrets";      // Secrets Manager entries