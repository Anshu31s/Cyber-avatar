"use client"

import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, History, Phone } from "lucide-react"

const vehicleModuleServices = [
    {
        title: "Vehicle Details",
        description: "Fetch comprehensive vehicle information including owner details, vehicle specifications, insurance, and permit information",
        credits: 7,
        icon: Car,
    },
    {
        title: "Vehicle Owner History",
        description: "Track complete ownership history, previous owners, transfer dates, and registration changes",
        credits: 8,
        icon: History,
    },
    {
        title: "Vehicle to Mobile Number",
        description: "Discover mobile numbers associated with vehicle registration and owner contact information",
        credits: 10,
        icon: Phone,
    },
]

export default function VehicleModulePage() {
    const router = useRouter()

    const handleLaunch = (service: typeof vehicleModuleServices[0]) => {
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
                    <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-medium">Vehicle Module</h3>
                    <p className="text-sm text-muted-foreground">
                        Investigate vehicles and related registration information.
                    </p>
                </div>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vehicleModuleServices.map((service) => (
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
