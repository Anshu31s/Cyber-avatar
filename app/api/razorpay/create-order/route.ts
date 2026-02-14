import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Razorpay from "razorpay"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    console.log("Create Order Session:", JSON.stringify(session, null, 2))
    if (!session?.user?.id) {
      console.log("Unauthorized - Session is null or user ID missing")
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
        debug: { session }
      }, { status: 401 })
    }

    const { amount, credits } = await request.json()

    if (!amount || !credits || amount <= 0 || credits <= 0) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        credits
      }
    })

    await prisma.paymentTransaction.create({
      data: {
        userId: session.user.id,
        amount,
        credits,
        razorpayOrderId: order.id,
        status: "pending",
      }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })

  } catch (error) {
    console.error("Order Error:", error)
    return NextResponse.json({ success: false, error: "Order failed" }, { status: 500 })
  }
}
