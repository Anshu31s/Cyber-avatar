import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "./profile-form"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/signin")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        redirect("/signin")
    }

    return (
        <div className="space-y-6">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <div className="flex-1 lg:max-w-2xl">
                    <ProfileForm user={user} />
                </div>
            </div>
        </div>
    )
}
