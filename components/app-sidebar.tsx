"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  BookUser,
  Bot,
  Bug,
  ChevronRight,
  Code,
  Coins,
  CreditCard,
  Database,
  FileSearch,
  Globe,
  GlobeLock,
  Hash,
  Home,
  Link,
  Mail,
  MapPin,
  Network,
  Phone,
  ScanLine,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserCredits } from "@/lib/actions"

// Menu structure
const mainNav = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Start Investigation",
    url: "/investigation",
    icon: FileSearch,
  },
  {
    title: "Data Requisition",
    url: "/data-requisition",
    icon: Database,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
]

const intelligenceTools = [
  {
    title: "Data Requisition",
    url: "/data-requisition",
    icon: Database,
  },
  {
    title: "OSINT Toolkit",
    url: "/tools/osint",
    icon: Globe,
  },
  {
    title: "Virtual Numbers",
    url: "/tools/virtual-numbers",
    icon: Phone,
  },
  {
    title: "LEOR DIRECTORY",
    url: "/tools/le-directory",
    icon: BookUser,
  },
  {
    title: "Domain Checker",
    url: "/tools/domain-checker",
    icon: GlobeLock,
  },
  {
    title: "Location-Tracker",
    url: "/tools/location-tracker",
    icon: MapPin,
  },
  {
    title: "Bulk IP",
    url: "/tools/bulk-ip",
    icon: Network,
  },
  {
    title: "URL Spoofing",
    url: "/tools/url-spoofing",
    icon: Link,
  },
  {
    title: "URL Scanner",
    url: "/tools/url-scanner",
    icon: ScanLine,
  },
  {
    title: "Email Headers",
    url: "/tools/email-headers",
    icon: Mail,
  },
  {
    title: "Hash Analyzer",
    url: "/tools/hash-analyzer",
    icon: Hash,
  },
  {
    title: "Dork Generator",
    url: "/tools/dork-generator",
    icon: Code,
  },
  {
    title: "Malware Scan",
    url: "/tools/malware-scan",
    icon: Bug,
  },
]

export function AppSidebar() {
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCredits() {
      const result = await getUserCredits()
      setCredits(result.credits)
      setIsLoading(false)
    }
    fetchCredits()
  }, [])

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Intelligence Tools">
                      <Bot />
                      <span>Intelligence Tools</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {intelligenceTools.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={item.url}>
                              <item.icon className="scale-90" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-xl bg-linear-to-br from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 p-4 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <Coins className="h-12 w-12 text-orange-500 -mr-4 -mt-4 rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-orange-500/20">
                <Coins className="h-4 w-4 text-orange-500" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Credits</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <span className="text-2xl font-bold">{credits?.toLocaleString()}</span>
              )}
              <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Available</span>
            </div>
          </div>
          <a
            href="/billing"
            className="mt-3 flex items-center justify-center w-full py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            Add Credits
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
