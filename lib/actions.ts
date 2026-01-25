"use server"

import { prisma } from "./prisma"

export async function getUserStatus(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { isActive: true }
        })

        console.log(`[ACTION] getUserStatus for ${email}:`, user?.isActive)

        if (!user) return { exists: false }
        return { exists: true, isActive: user.isActive }
    } catch (error) {
        console.error("[ACTION] getUserStatus error:", error)
        return { error: "Failed to fetch user status" }
    }
}

export async function getUserCredits() {
    const { auth } = await import("@/auth")
    try {
        const session = await auth()
        if (!session?.user?.email) return { credits: 0 }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { credits: true }
        })

        return { credits: user?.credits ?? 0 }
    } catch (error) {
        console.error("[ACTION] getUserCredits error:", error)
        return { credits: 0 }
    }
}
