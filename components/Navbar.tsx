"use client"

import { signOut, useSession } from "next-auth/react"

import { Bell, User, CreditCard, Settings, LogOut } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import React from "react"
import Link from "next/link"

function DynamicBreadcrumb() {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(Boolean)

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.length > 0 && <BreadcrumbSeparator />}
                {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1
                    const href = `/${pathSegments.slice(0, index + 1).join('/')}`
                    const title = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export function Navbar() {
    const { data: session } = useSession()

    // Get initials from user name (e.g., "John Doe" -> "JD")
    const getInitials = (name?: string | null) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="sticky top-4 z-50 mx-4 flex h-16 items-center gap-4 rounded-xl border bg-background/60 px-6 shadow-sm backdrop-blur-md transition-all">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <DynamicBreadcrumb />
            </div>

            <div className="ml-auto flex items-center gap-4">
                {/* Notification Bell */}
                {/* Notification Bell */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative transition-transform hover:scale-105">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px]">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">System Alert</span>
                                <span className="text-xs text-muted-foreground">High CPU usage detected on Server A.</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">New Case Assigned</span>
                                <span className="text-xs text-muted-foreground">Case #4023 has been assigned to you.</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">Update Available</span>
                                <span className="text-xs text-muted-foreground">Cyber Avatar v2.1 is ready to install.</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer justify-center text-center text-primary font-medium">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <div className="transition-transform hover:scale-105">
                    <ModeToggle />
                </div>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full transition-transform hover:scale-105">
                            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session?.user?.name || "Cyber User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session?.user?.email || "user@cyberavatar.com"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="w-full cursor-pointer flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Billing
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-500 focus:text-red-500 cursor-pointer"
                            onClick={() => signOut({ callbackUrl: "/signin" })}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
