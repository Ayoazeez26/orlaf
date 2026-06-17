import { SupportOptionCard } from "../components/support-option-card"
import { SupportTicketForm } from "../components/support-ticket-form"
import { SUPPORT_OPTIONS } from "../constants"

export function SupportPage() {
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Support
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          We&apos;re here to help you grow on Sable TV.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SUPPORT_OPTIONS.map((option) => (
          <SupportOptionCard key={option.id} option={option} />
        ))}
      </div>

      <SupportTicketForm />
    </div>
  )
}
