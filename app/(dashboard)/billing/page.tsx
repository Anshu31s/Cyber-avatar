"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  Coins,
  CreditCard,
  Loader2,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const plans = [
  {
    name: "Starter",
    price: "399",
    credits: "410",
    icon: CreditCard,
    gradient: "from-blue-500 to-cyan-500",
    description: "Perfect for minor investigations and data lookups.",
    features: [
      "Access to LEOR Directory",
      "Standard Search Speed",
      "Email Support",
      "410 Credits Included",
    ],
  },
  {
    name: "Pro",
    price: "699",
    credits: "750",
    popular: true,
    icon: Zap,
    gradient: "from-purple-500 to-pink-500",
    description: "Enhanced capacity for frequent data requisitions.",
    features: [
      "Priority API Access",
      "Faster Search results",
      "24/7 Priority Support",
      "750 Credits Included",
      "Bulk Lookup Tools",
    ],
  },
  {
    name: "Elite",
    price: "999",
    credits: "1200",
    icon: Shield,
    gradient: "from-amber-500 to-orange-500",
    description: "Maximum power for deep-dive intelligence operations.",
    features: [
      "Unlimited Dashboard Usage",
      "Fastest Infrastructure",
      "Dedicated Account Manager",
      "1200 Credits Included",
      "Custom Report Generation",
    ],
  },
];

export default function Page() {
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch user credits
  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data?.user?.email) {
          const creditRes = await fetch(`/api/user/credits`);
          const creditData = await creditRes.json();
          if (creditData.credits !== undefined) {
            setUserCredits(creditData.credits);
          }
        }
      } catch {}
    }
    fetchCredits();
  }, []);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function handlePayment(plan: any) {
    if (loadingPlan) return;
    setLoadingPlan(plan.name);
    setNotification(null);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(plan.price),
          credits: Number(plan.credits),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setNotification({
          type: "error",
          message: data.error || "Failed to create order",
        });
        setLoadingPlan(null);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Cyber Avatar",
        description: `${plan.name} Credits Pack — ${plan.credits} credits`,
        order_id: data.orderId,
        image: "/logo.png",

        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },

        handler: async (response: any) => {
          setNotification({ type: "success", message: "Verifying payment..." });

          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verify.json();

          if (verifyData.success) {
            setNotification({
              type: "success",
              message: `🚀 Payment successful! ${plan.credits} credits added to your account.`,
            });
            // Update credit display
            setUserCredits((prev) => (prev ?? 0) + Number(plan.credits));
          } else {
            setNotification({
              type: "error",
              message: "Payment verification failed. Please contact support.",
            });
          }
          setLoadingPlan(null);
        },

        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
          },
          confirm_close: true,
          animation: true,
        },

        theme: {
          color: "#8b5cf6",
          backdrop_color: "rgba(0, 0, 0, 0.85)",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.on("payment.failed", (response: any) => {
        setNotification({
          type: "error",
          message:
            response?.error?.description || "Payment failed. Please try again.",
        });
        setLoadingPlan(null);
      });
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      setNotification({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
      setLoadingPlan(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 max-w-6xl mx-auto w-full">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 ${
            notification.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h1 className="text-3xl font-bold tracking-tight">
              Billing & Credits
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Choose a plan that fits your investigation requirements.
          </p>
        </div>

        {/* Current Balance */}
        {userCredits !== null && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="p-2 rounded-lg bg-purple-500 text-white">
              <Coins className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                Current Balance
              </span>
              <span className="text-2xl font-black text-purple-500">
                {userCredits.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isLoading = loadingPlan === plan.name;

          return (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? "border-purple-500 shadow-lg shadow-purple-500/10"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest z-10 shadow-md">
                  Most Popular
                </div>
              )}

              <CardHeader className="pb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-2 shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="min-h-[40px] mt-1 leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹{plan.price}</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    /one-time
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500 text-white shadow-lg shadow-purple-500/20">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold leading-none">
                        {plan.credits}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-purple-600/60 tracking-tighter">
                        Credits
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">
                    Included
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-foreground/80"
                    >
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
                  disabled={!!loadingPlan}
                  className={`w-full h-12 text-sm font-bold transition-all shadow-xl cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/20"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  } ${isLoading ? "opacity-80" : ""}`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Buy ${plan.credits} Credits`
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground pt-4">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          <span>Secured by Razorpay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5" />
          <span>Instant Credit Delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          <span>All Payment Methods Accepted</span>
        </div>
      </div>
    </div>
  );
}
