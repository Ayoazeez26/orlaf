#!/usr/bin/env bash
# infra/bootstrap.sh
#
# ONE-TIME SETUP — run this once to create the Pulumi state backend.
# After this script succeeds, never run it again.
#
# What it creates in your AWS account (using the sable-dev profile):
#   - S3 bucket:        sable-infra-state          (versioned, encrypted)
#   - DynamoDB table:   sable-infra-state-lock      (used for deploy locking)
#
# Prerequisites:
#   - AWS CLI configured with a profile named sable-dev that has admin access
#   - The sable-dev account is where state lives (shared by both stacks)
#
# Usage:
#   bash infra/bootstrap.sh

set -euo pipefail

REGION="us-east-1"
PROFILE="sable-dev"
BUCKET="sable-infra-state"
LOCK_TABLE="sable-infra-state-lock"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

die()  { echo -e "${RED}error:${RESET} $*" >&2; exit 1; }
info() { echo -e "${CYAN}→${RESET} $*"; }
ok()   { echo -e "${GREEN}✔${RESET} $*"; }

command -v aws &>/dev/null || die "AWS CLI not found. Install: https://aws.amazon.com/cli/"

echo ""
echo -e "${BOLD}Pulumi state backend bootstrap${RESET}"
echo -e "Profile: ${CYAN}${PROFILE}${RESET}  Region: ${CYAN}${REGION}${RESET}"
echo ""

# ─── S3 bucket ────────────────────────────────────────────────────────────────
info "Creating S3 bucket: ${BUCKET}"

if aws s3api head-bucket --bucket "${BUCKET}" --profile "${PROFILE}" 2>/dev/null; then
  ok "Bucket already exists — skipping creation"
else
  aws s3api create-bucket \
    --bucket "${BUCKET}" \
    --region "${REGION}" \
    --profile "${PROFILE}"

  # Enable versioning so state history is recoverable
  aws s3api put-bucket-versioning \
    --bucket "${BUCKET}" \
    --versioning-configuration Status=Enabled \
    --profile "${PROFILE}"

  # Encrypt at rest
  aws s3api put-bucket-encryption \
    --bucket "${BUCKET}" \
    --server-side-encryption-configuration '{
      "Rules": [{
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }]
    }' \
    --profile "${PROFILE}"

  # Block all public access
  aws s3api put-public-access-block \
    --bucket "${BUCKET}" \
    --public-access-block-configuration \
      "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --profile "${PROFILE}"

  ok "Bucket created, versioned, encrypted, and private"
fi

# ─── DynamoDB lock table ───────────────────────────────────────────────────────
info "Creating DynamoDB lock table: ${LOCK_TABLE}"

if aws dynamodb describe-table \
    --table-name "${LOCK_TABLE}" \
    --region "${REGION}" \
    --profile "${PROFILE}" &>/dev/null; then
  ok "Lock table already exists — skipping creation"
else
  aws dynamodb create-table \
    --table-name "${LOCK_TABLE}" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "${REGION}" \
    --profile "${PROFILE}"

  ok "Lock table created"
fi

# ─── Log in to the state backend ──────────────────────────────────────────────
echo ""
info "Logging Pulumi into the S3 backend..."
AWS_PROFILE="${PROFILE}" pulumi login "s3://${BUCKET}" || \
  die "pulumi login failed. Is Pulumi installed? brew install pulumi"

ok "Logged in to s3://${BUCKET}"

# ─── Initialize stacks ────────────────────────────────────────────────────────
echo ""
info "Initializing stacks (if they don't exist yet)..."

cd "$(dirname "$0")"

for STACK in dev prod; do
  if AWS_PROFILE="${PROFILE}" pulumi stack ls 2>/dev/null | grep -q "^${STACK}"; then
    ok "Stack '${STACK}' already exists"
  else
    AWS_PROFILE="${PROFILE}" pulumi stack init "${STACK}" --secrets-provider passphrase
    ok "Stack '${STACK}' initialized"
  fi
done

echo ""
echo -e "${GREEN}${BOLD}Bootstrap complete.${RESET}"
echo ""
echo "Next steps:"
echo "  1. Select a stack:    pulumi stack select dev"
echo "  2. Dry-run:           pulumi preview"
echo "  3. See the README:    cat infra/README.md"
echo ""