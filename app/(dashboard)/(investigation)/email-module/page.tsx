"use client"

import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

const emailModuleServices = [
    {
        title: "Email Universal Intelligence",
        description: "Comprehensive intelligence and enrichment for email addresses",
        credits: 15,
        icon: Mail,
    },
]

export default function EmailModulePage() {
    const router = useRouter()

    const handleLaunch = (service: typeof emailModuleServices[0]) => {
        const params = new URLSearchParams({
            service: service.title,
            credits: service.credits.toString(),
            description: service.description,
        })
        router.push(`/investigate?${params.toString()}`)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-medium">Email Module</h3>
                    <p className="text-sm text-muted-foreground">
                        Intelligence services for email address investigation.
                    </p>
                </div>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {emailModuleServices.map((service) => (
                    <Card key={service.title} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <service.icon className="h-5 w-5 text-primary" />
                                </div>
                                <Badge variant="secondary" className="text-xs font-semibold">
                                    {service.credits} Credits
                                </Badge>
                            </div>
                            <CardTitle className="text-base mt-3">{service.title}</CardTitle>
                            <CardDescription className="text-xs">
                                {service.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button
                                className="w-full"
                                size="sm"
                                onClick={() => handleLaunch(service)}
                            >
                                Launch
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
