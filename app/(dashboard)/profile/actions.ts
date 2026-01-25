"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    dob: z.string().optional(),
})

export async function updateProfile(values: z.infer<typeof profileSchema>) {
    const session = await auth()

    if (!session?.user?.email) {
        return { error: "Not authenticated" }
    }

    const validatedFields = profileSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: validatedFields.data.name,
                phone: validatedFields.data.phone,
                dob: validatedFields.data.dob,
            },
        })

        revalidatePath("/profile")
        return { success: "Profile updated successfully" }
    } catch (error) {
        return { error: "Something went wrong" }
    }
}
