import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { razorpayOrderId: razorpay_order_id }
    })

    if (!transaction || transaction.status === "success") {
      return NextResponse.json({ success: false, error: "Already processed" })
    }

    // Mark payment success
    await prisma.paymentTransaction.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        paymentId: razorpay_payment_id,
        status: "success"
      }
    })

    // Add credits to user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: { increment: transaction.credits }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Verify Error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
