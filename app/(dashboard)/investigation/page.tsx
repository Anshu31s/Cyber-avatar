"use client"

import * as React from "react"
import { Check, ChevronsUpDown, FileJson, FileText, Download, Copy, Loader2, Search } from "lucide-react"
import jsPDF from "jspdf"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

const searchTypes = [
  { value: "vehicle-search", label: "Vehicle Search" },
  { value: "mobile-lookup", label: "Mobile Lookup" },
  { value: "phone-to-upi", label: "Phone to UPI ID" },
  { value: "aadhaar-info", label: "Aadhaar Information" },
  { value: "email-investigation", label: "Email Investigation" },
  { value: "domain-whois", label: "Domain WHOIS" },
  { value: "ip-geolocation", label: "IP Geolocation" },
  { value: "document-lookup", label: "Document Lookup" },
  { value: "upi-investigation", label: "UPI Investigation" },
  { value: "social-media-osint", label: "Social Media OSINT" },
]

export default function InvestigationPage() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<any>(null)
  const [progress, setProgress] = React.useState(0)

  const handleSearch = async () => {
    if (!value || !query) {
      toast.error("Please select a type and enter a target.")
      return
    }

    setLoading(true)
    setResult(null)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      })
    }, 200)

    try {
      const selectedType = searchTypes.find((t) => t.value === value)?.label
      const res = await fetch("/api/investigation", {
        method: "POST",
        body: JSON.stringify({ type: selectedType, query }),
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()

      setProgress(100)
      setTimeout(() => {
        setResult(data)
        setLoading(false)
      }, 500)

      toast.success("Investigation complete.")
    } catch (error) {
      toast.error("An error occurred during investigation.")
      console.error(error)
      setLoading(false)
    } finally {
      clearInterval(interval)
    }
  }

  const copyToClipboard = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    toast.success("Copied to clipboard")
  }

  const downloadTXT = () => {
    if (!result) return
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(result, null, 2)], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `investigation-${query}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("TXT downloaded")
  }

  const downloadPDF = () => {
    if (!result) return
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Investigation Report", 10, 10)
    doc.setFontSize(12)
    doc.text(`Type: ${searchTypes.find((t) => t.value === value)?.label}`, 10, 20)
    doc.text(`Target: ${query}`, 10, 30)
    doc.text(`Date: ${new Date().toLocaleString()}`, 10, 40)

    doc.setFontSize(10)
    const lines = doc.splitTextToSize(JSON.stringify(result, null, 2), 180)
    doc.text(lines, 10, 50)

    doc.save(`investigation-${query}.pdf`)
    toast.success("PDF downloaded")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Investigation Hub</h1>
        <p className="text-muted-foreground">
          Select an investigation type and enter a target to retrieve detailed intelligence.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Investigation</CardTitle>
          <CardDescription>Enter the details below to start searching.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between md:w-[250px]"
                >
                  {value
                    ? searchTypes.find((framework) => framework.value === value)?.label
                    : "Select Type..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Search type..." />
                  <CommandList>
                    <CommandEmpty>No type found.</CommandEmpty>
                    <CommandGroup>
                      {searchTypes.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === framework.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-1 gap-2">
              <Input
                placeholder="Enter target (e.g., Phone Number, UPI ID, Domain...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Initiating investigation...</p>
            <Progress value={progress} className="w-full" />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5 ">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-[200px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {result && !loading && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Data retrieved for: <span className="font-mono font-medium text-foreground">{query}</span>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Raw
              </Button>
              <Button variant="outline" size="sm" onClick={downloadTXT}>
                <FileText className="mr-2 h-4 w-4" />
                TXT
              </Button>
              <Button variant="outline" size="sm" onClick={downloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="text">
                  <FileText className="mr-2 h-4 w-4" />
                  Text View
                </TabsTrigger>
                <TabsTrigger value="json">
                  <FileJson className="mr-2 h-4 w-4" />
                  Raw JSON
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-xs font-medium uppercase text-muted-foreground">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm font-medium break-all">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="json" className="mt-4">
                <div className="relative rounded-md border bg-muted">
                  <Textarea
                    readOnly
                    className="min-h-[300px] font-mono text-xs resize-none bg-transparent border-0 focus-visible:ring-0"
                    value={JSON.stringify(result, null, 2)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
