"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Coins } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "399",
    credits: "410",
    description: "Perfect for minor investigations and data lookups.",
    features: [
      "Access to LEOR Directory",
      "Standard Search Speed",
      "Email Support",
      "410 Credits Included"
    ]
  },
  {
    name: "Pro",
    price: "699",
    credits: "750",
    popular: true,
    description: "Enhanced capacity for frequent data requisitions.",
    features: [
      "Priority API Access",
      "Faster Search results",
      "24/7 Priority Support",
      "750 Credits Included",
      "Bulk Lookup Tools"
    ]
  },
  {
    name: "Elite",
    price: "999",
    credits: "1200",
    description: "Maximum power for deep-dive intelligence operations.",
    features: [
      "Unlimited Dashboard Usage",
      "Fastest Infrastructure",
      "Dedicated Account Manager",
      "1200 Credits Included",
      "Custom Report Generation"
    ]
  }
]

export default function Page() {
  async function handlePayment(plan: any) {
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(plan.price),
          credits: Number(plan.credits),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.error || "Failed to create order")
        return
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Cyber Avatar",
        description: `${plan.name} Credits Pack`,
        order_id: data.orderId,

        handler: async (response: any) => {
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          })

          const verifyData = await verify.json()

          if (verifyData.success) {
            alert("Payment Successful 🚀 Credits Added!")
            window.location.reload()
          } else {
            alert("Payment verification failed ❌")
          }
        },

        theme: {
          color: "#8b5cf6",
          backdrop_color: "rgba(0, 0, 0, 0.85)"
        },
      }

      const razor = new (window as any).Razorpay(options)
      razor.open()
    } catch (err) {
      console.error("Payment error:", err)
      alert("Something went wrong")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="text-muted-foreground text-lg">
          Choose a plan that fits your investigation requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1 ${plan.popular ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-border'
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10 shadow-md">
                Most Popular
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px] mt-2 leading-relaxed">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black italic">₹{plan.price}</span>
                <span className="text-sm font-medium text-muted-foreground">/one-time</span>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500 text-white shadow-lg shadow-purple-500/20">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">{plan.credits}</span>
                    <span className="text-[10px] uppercase font-bold text-purple-600/60 tracking-tighter">Credits</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">
                  Included
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                    <div className="mt-0.5 rounded-full bg-green-500/10 p-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handlePayment(plan)}
                className={`w-full h-11 text-sm font-bold transition-all shadow-xl ${plan.popular
                  ? "bg-purple-500 hover:bg-purple-600 shadow-purple-500/20"
                  : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
              >
                Buy {plan.credits} Credits
              </Button>

            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
