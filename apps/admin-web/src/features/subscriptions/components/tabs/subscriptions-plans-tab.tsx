import { useAdminSubscriptionPlans } from "../../api/subscriptions-hooks"
import { SubscriptionPlanCard } from "../subscription-plan-card"

export function SubscriptionsPlansTab() {
  const { data: plans } = useAdminSubscriptionPlans()

  if (!plans) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Subscription plans
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Read-only view of VIP SKUs configured in RevenueCat and the app
          stores. Edit products in Play Console / App Store Connect.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            plan={plan}
            onLiveChange={() => {}}
            onEdit={() => {}}
            readOnly
          />
        ))}
      </div>
    </div>
  )
}
