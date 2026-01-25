import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/Navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Navbar />
                <div className="flex flex-1 flex-col gap-4 p-4 mt-2">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
