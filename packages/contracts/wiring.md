# KAN-35 Wiring Guide — add @sable/contracts to each app

## 1. Add the dependency to all four apps

In each app's `package.json`, add to `dependencies`:

```json
"@sable/contracts": "workspace:*"
```

### apps/backend/package.json
```json
{
  "dependencies": {
    "@sable/contracts": "workspace:*"
  }
}
```

### apps/creator-web/package.json
```json
{
  "dependencies": {
    "@sable/contracts": "workspace:*"
  }
}
```

### apps/admin-web/package.json
```json
{
  "dependencies": {
    "@sable/contracts": "workspace:*"
  }
}
```

### apps/mobile/package.json
```json
{
  "dependencies": {
    "@sable/contracts": "workspace:*"
  }
}
```

Then run `pnpm install` from the repo root.

---

## 2. turbo.json — ensure contracts builds first

Make sure your `turbo.json` pipeline has:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

The `^build` means Turborepo will build `@sable/contracts` before any app that depends on it.

---

## 3. Usage examples

### Backend — NestJS DTO

```ts
// apps/backend/src/auth/dto/sign-in-google.dto.ts
import type { SignInGoogleRequest } from "@sable/contracts";
import { IsString, IsNotEmpty } from "class-validator";

export class SignInGoogleDto implements SignInGoogleRequest {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
```

```ts
// apps/backend/src/auth/auth.controller.ts
import type { SignInResponse } from "@sable/contracts";

@Post("google")
async signInGoogle(@Body() dto: SignInGoogleDto): Promise<SignInResponse> {
  return this.authService.signInWithGoogle(dto.idToken);
}
```

### Creator Web — API call with typed response

```ts
// apps/creator-web/src/api/auth.ts
import type { SignInGoogleRequest, SignInResponse } from "@sable/contracts";

export async function signInWithGoogle(
  body: SignInGoogleRequest
): Promise<SignInResponse> {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
```

### Mobile (Expo) — same pattern

```ts
// apps/mobile/src/api/auth.ts
import type { SignInAppleRequest, SignInResponse } from "@sable/contracts";

export async function signInWithApple(
  body: SignInAppleRequest
): Promise<SignInResponse> {
  const res = await fetch(`${API_BASE}/auth/apple`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
```

### Error handling with the code union

```ts
import type { ApiErrorResponse, AnyAuthErrorCode } from "@sable/contracts";

function handleAuthError(err: ApiErrorResponse<AnyAuthErrorCode>) {
  switch (err.code) {
    case "CONSENT_REQUIRED":
      router.navigate("/onboarding/consent");
      break;
    case "DUPLICATE_EMAIL":
      showToast("This email is already registered with another provider.");
      break;
    case "RATE_LIMITED":
      showToast("Too many attempts. Please wait and try again.");
      break;
    default:
      showToast("Authentication failed. Please try again.");
  }
}
```