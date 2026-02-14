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
import Links from "next/link";
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Image from "next/image"
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
    url: "/osint",
    icon: Globe,
  },
  {
    title: "Virtual Numbers",
    url: "/virtual-numbers",
    icon: Phone,
  },
  {
    title: "LEOR DIRECTORY",
    url: "/le-directory",
    icon: BookUser,
  },
  {
    title: "Domain Checker",
    url: "/domain-checker",
    icon: GlobeLock,
  },
  {
    title: "Location-Tracker",
    url: "/location-tracker",
    icon: MapPin,
  },
  {
    title: "Bulk IP",
    url: "/bulk-ip",
    icon: Network,
  },
  {
    title: "URL Spoofing",
    url: "/url-spoofing",
    icon: Link,
  },
  {
    title: "URL Scanner",
    url: "/url-scanner",
    icon: ScanLine,
  },
  {
    title: "Email Headers",
    url: "/email-headers",
    icon: Mail,
  },
  {
    title: "Hash Analyzer",
    url: "/hash-analyzer",
    icon: Hash,
  },
  {
    title: "Dork Generator",
    url: "/dork-generator",
    icon: Code,
  },
  {
    title: "Malware Scan",
    url: "/malware-scan",
    icon: Bug,
  },
]

const investigationModules = [
  {
    title: "Phone Module",
    url: "/phone-module",
    icon: Phone,
  },
  {
    title: "Email Module",
    url: "/email-module",
    icon: Mail,
  },
  {
    title: "Vehicle   Module",
    url: "/vehicle-module",
    icon: FileSearch,
  },
  {
    title: "Corporate Module",
    url: "/corporate-module",
    icon: Database,
  },
  {
    title: "Intel Module",
    url: "/intel-module",
    icon: Network,
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
      <SidebarHeader className="p-4 border-b">
        <Links href="/" className="flex items-center gap-3 text-lg font-semibold capitalize">
          <Image
            src="/logo.png"
            alt="Cyber Avatar Logo"
            width={50}
            height={50}
            className="object-contain"
            unoptimized
            priority
          />
          <span style={{ fontFamily: 'var(--font-blanka)' }} className="uppercase tracking-widest">cyber-avatar</span>
        </Links>
      </SidebarHeader>
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
          <SidebarGroupLabel>Investigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild defaultOpen className="group/investigation">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Investigation Modules">
                      <FileSearch />
                      <span>Investigation Modules</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/investigation:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {investigationModules.map((item) => (
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
        <div className="rounded-xl bg-linear-to-br from-[#3c145a]/10 via-[#3c145a]/5 to-transparent border border-[#3c145a]/20 p-4 relative overflow-hidden group hover:border-[#3c145a]/40 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <Coins className="h-12 w-12 text-[#3c145a] -mr-4 -mt-4 rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#3c145a]/20">
                <Coins className="h-4 w-4 text-[#3c145a]" />
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
            href="/recharge"
            className="mt-3 flex items-center justify-center w-full py-2 rounded-lg bg-[#3c145a] text-white text-xs font-bold hover:bg-[#3c145a] transition-colors shadow-lg shadow-[#3c145a]/20"
          >
            Add Credits
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
