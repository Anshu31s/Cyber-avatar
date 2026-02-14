import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const LEAKOSINT_API_TOKEN = process.env.LEAKOSINT_API_TOKEN

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { serviceType, credits = 10, ...queryData } = body

    if (!serviceType) {
      return NextResponse.json(
        { success: false, error: "Service type is required" },
        { status: 400 }
      )
    }

    if (!LEAKOSINT_API_TOKEN) {
      console.error("LEAKOSINT_API_TOKEN is not defined in environment variables")
      return NextResponse.json(
        { success: false, error: "Configuration error" },
        { status: 500 }
      )
    }

    // Extract the first available query value (e.g., vehicleNumber, mobileNumber, email)
    // The frontend sends specific keys like { vehicleNumber: "MH02..." } so we take the first value.
    const searchRequest = Object.values(queryData)[0] as string

    if (!searchRequest) {
      return NextResponse.json(
        { success: false, error: "Missing search parameter" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credits: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    if (user.credits < credits) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient credits. Required: ${credits}, Available: ${user.credits}`,
        },
        { status: 402 }
      )
    }

    // Call Leakosint API
    let apiData
    try {
      const apiResponse = await fetch("https://leakosintapi.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: LEAKOSINT_API_TOKEN,
          request: searchRequest,
          limit: 1000,
          lang: "en",
          type: "json"
        }),
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error("Leakosint API error:", errorText)
        return NextResponse.json(
          {
            success: false,
            error: "External API failed",
            details: errorText,
          },
          { status: 502 }
        )
      }

      apiData = await apiResponse.json()

    } catch (err) {
      console.error("External API request failed:", err)
      return NextResponse.json(
        { success: false, error: "External API unreachable" },
        { status: 502 }
      )
    }

    // Deduct credits ONLY after successful API call
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { credits: { decrement: credits } },
      select: { credits: true },
    })

    console.log("Investigation success:", {
      user: session.user.email,
      serviceType,
      creditsUsed: credits,
    })

    return NextResponse.json({
      success: true,
      data: apiData,
      creditsRemaining: updatedUser.credits,
    })

  } catch (error) {
    console.error("Investigation API error:", error)

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
