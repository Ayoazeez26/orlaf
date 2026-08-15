import { PASSWORD_POLICY_MESSAGE, validatePassword } from "@sable/contracts"
import { z } from "zod"

export const passwordFieldSchema = z
  .string()
  .refine((value) => validatePassword(value).valid, PASSWORD_POLICY_MESSAGE)
