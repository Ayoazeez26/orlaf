import { Button } from "@workspace/ui/components/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { Mail } from "lucide-react"
import { useState } from "react"
import { useOnboarding } from "../../onboarding-context"
import { OnboardingShell } from "../onboarding-shell"

interface VerifyEmailStepProps {
  progress: { currentIndex: number; total: number }
  onBack: () => void
  onNext: () => void
}

export function VerifyEmailStep({
  progress,
  onBack,
  onNext,
}: VerifyEmailStepProps) {
  const { data, dispatch } = useOnboarding()
  const [code, setCode] = useState(data.verificationCode)
  const [resent, setResent] = useState(false)

  const handleVerify = () => {
    if (code.length !== 6) return
    dispatch({ type: "SET_VERIFICATION_CODE", payload: code })
    onNext()
  }

  const handleResend = () => {
    setResent(true)
    setTimeout(() => setResent(false), 3000)
  }

  return (
    <OnboardingShell progress={progress} showBack onBack={onBack}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We sent a 6-digit code to your inbox. Enter it below.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {([0, 1, 2, 3, 4, 5] as const).map((index) => (
              <InputOTPSlot key={`otp-slot-${index}`} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        type="button"
        className="mt-8 w-full text-base"
        disabled={code.length !== 6}
        onClick={handleVerify}
      >
        Verify
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="font-medium text-primary hover:underline"
        >
          {resent ? "Code sent!" : "Resend"}
        </button>
      </p>
    </OnboardingShell>
  )
}
