"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Search,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Car,
  Phone,
  Mail,
  Building2,
  Shield,
} from "lucide-react";

// Define input field configurations for each service type
const serviceInputConfig: Record<
  string,
  {
    fields: Array<{
      name: string;
      label: string;
      placeholder: string;
      type?: string;
    }>;
  }
> = {
  // Vehicle Module
  "Vehicle Details": {
    fields: [
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        placeholder: "Enter vehicle number (e.g., MH01AB1234)",
      },
    ],
  },
  "Vehicle Owner History": {
    fields: [
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        placeholder: "Enter vehicle number (e.g., MH01AB1234)",
      },
    ],
  },
  "Vehicle to Mobile Number": {
    fields: [
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        placeholder: "Enter vehicle number (e.g., MH01AB1234)",
      },
    ],
  },
  // Phone Module
  "Mobile Breach Data Search": {
    fields: [
      {
        name: "mobileNumber",
        label: "Mobile Number",
        placeholder: "Enter 10-digit mobile number",
        type: "tel",
      },
    ],
  },
  "Mobile Identity Advanced": {
    fields: [
      {
        name: "mobileNumber",
        label: "Mobile Number",
        placeholder: "Enter 10-digit mobile number",
        type: "tel",
      },
    ],
  },
  "Mobile Universal Intelligence": {
    fields: [
      {
        name: "mobileNumber",
        label: "Mobile Number",
        placeholder: "Enter 10-digit mobile number",
        type: "tel",
      },
    ],
  },
  "Mobile to PAN Details": {
    fields: [
      {
        name: "mobileNumber",
        label: "Mobile Number",
        placeholder: "Enter 10-digit mobile number",
        type: "tel",
      },
    ],
  },
  "Mobile to Aadhaar Details": {
    fields: [
      {
        name: "mobileNumber",
        label: "Mobile Number",
        placeholder: "Enter 10-digit mobile number",
        type: "tel",
      },
    ],
  },
  // Email Module
  "Email Universal Intelligence": {
    fields: [
      {
        name: "email",
        label: "Email Address",
        placeholder: "Enter email address",
        type: "email",
      },
    ],
  },
  // Corporate Module
  "GST Details Advanced": {
    fields: [
      { name: "gstin", label: "GSTIN", placeholder: "Enter 15-digit GSTIN" },
    ],
  },
  "GST from PAN": {
    fields: [
      {
        name: "panNumber",
        label: "PAN Number",
        placeholder: "Enter 10-character PAN",
      },
    ],
  },
  "PAN to TIN": {
    fields: [
      {
        name: "panNumber",
        label: "PAN Number",
        placeholder: "Enter 10-character PAN",
      },
    ],
  },
  // Intel Module
  "UPI to Bank Details": {
    fields: [
      {
        name: "upiId",
        label: "UPI ID",
        placeholder: "Enter UPI ID (e.g., user@upi)",
      },
    ],
  },
  "PAN to Employment": {
    fields: [
      {
        name: "panNumber",
        label: "PAN Number",
        placeholder: "Enter 10-character PAN",
      },
    ],
  },
  "Complete PAN Intelligence": {
    fields: [
      {
        name: "panNumber",
        label: "PAN Number",
        placeholder: "Enter 10-character PAN",
      },
    ],
  },
};

// Map service types to icons
const getServiceIcon = (serviceType: string) => {
  if (serviceType.includes("Vehicle")) return Car;
  if (serviceType.includes("Mobile") || serviceType.includes("Phone"))
    return Phone;
  if (serviceType.includes("Email")) return Mail;
  if (serviceType.includes("GST") || serviceType.includes("Corporate"))
    return Building2;
  return Shield;
};

// Allowed keys for "Mobile to Aadhaar Details" — normalized (lowercase, no separators)
const AADHAAR_DISPLAY_KEYS = new Set([
  "region",
  "postcode",
  "phone",
  "lastname",
  "firstname",
  "email",
  "address2",
  "address",
  "docnumber",
]);

// Normalize a key: lowercase + remove spaces, underscores, hyphens
const normalizeKey = (key: string) => key.toLowerCase().replace(/[\s_\-]/g, "");

// Extract only allowed fields from a single data record
const pickAllowedFields = (
  record: Record<string, unknown>,
): Record<string, unknown> => {
  const picked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (
      AADHAAR_DISPLAY_KEYS.has(normalizeKey(key)) &&
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      picked[key] = value;
    }
  }
  return picked;
};

// Filter Leakosint API response: List → Sources → Data[] → pick fields
const filterAadhaarData = (
  data: Record<string, unknown>,
): Record<string, unknown> => {
  const list = data.List as Record<string, unknown> | undefined;
  if (!list) return data;

  const allRecords: Record<string, unknown>[] = [];

  for (const [, source] of Object.entries(list)) {
    if (typeof source === "object" && source !== null) {
      const sourceObj = source as Record<string, unknown>;
      const dataArray = sourceObj.Data as Record<string, unknown>[] | undefined;
      if (Array.isArray(dataArray)) {
        for (const record of dataArray) {
          const picked = pickAllowedFields(record);
          if (Object.keys(picked).length > 0) {
            allRecords.push(picked);
          }
        }
      }
    }
  }

  if (allRecords.length === 0) return data;

  return { Results: allRecords };
};

interface ApiResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  creditsRemaining?: number;
}

export default function InvestigatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceType = searchParams.get("service") || "";
  const credits = parseInt(searchParams.get("credits") || "10");
  const description = searchParams.get("description") || "";

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = serviceInputConfig[serviceType] || {
    fields: [
      { name: "query", label: "Query", placeholder: "Enter your search query" },
    ],
  };

  const Icon = getServiceIcon(serviceType);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Auto-prepend +91 to mobileNumber fields before sending
      const submitData = { ...formData };
      if (submitData.mobileNumber) {
        submitData.mobileNumber = `+91${submitData.mobileNumber}`;
      }

      const response = await fetch("/api/investigation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceType,
          credits,
          ...submitData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Investigation request failed");
      }

      // Filter response for "Mobile to Aadhaar Details" to show only selective fields
      if (serviceType === "Mobile to Aadhaar Details" && data.data) {
        console.log("RAW API RESPONSE:", JSON.stringify(data.data, null, 2));
        data.data = filterAadhaarData(data.data);
        console.log("FILTERED DATA:", JSON.stringify(data.data, null, 2));
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewInvestigation = () => {
    setFormData({});
    setResult(null);
    setError(null);
  };

  const renderResultData = (data: Record<string, unknown>, level = 0) => {
    return (
      <div
        className={`grid gap-4 ${level === 0 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 ml-4 mt-2"}`}
      >
        {Object.entries(data).map(([key, value]) => {
          if (value === null || value === undefined) return null;

          const formattedKey = key
            .replace(/_/g, " ")
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();

          if (typeof value === "object" && !Array.isArray(value)) {
            return (
              <div
                key={key}
                className={`${level === 0 ? "col-span-2" : ""} space-y-2 mt-2`}
              >
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {formattedKey}
                </h4>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                  {renderResultData(
                    value as Record<string, unknown>,
                    level + 1,
                  )}
                </div>
              </div>
            );
          }

          if (Array.isArray(value)) {
            return (
              <div
                key={key}
                className="col-span-1 md:col-span-2 space-y-2 mt-2"
              >
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {formattedKey}
                </h4>
                <div className="grid gap-3">
                  {value.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm p-4 bg-muted/30 rounded-lg border border-border/50"
                    >
                      {typeof item === "object"
                        ? renderResultData(
                            item as Record<string, unknown>,
                            level + 1,
                          )
                        : String(item)}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div
              key={key}
              className="flex flex-col space-y-1 p-3 rounded-lg bg-card border hover:shadow-sm transition-shadow"
            >
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {formattedKey}
              </span>
              <span className="text-sm font-semibold break-words">
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (!serviceType) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <div className="p-6 rounded-full bg-muted/50">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            No Service Selected
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please go back to the dashboard and select an investigation service
            to begin.
          </p>
        </div>
        <Button onClick={() => router.back()} size="lg" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col items-start gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="-ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Module
        </Button>

        <div className="flex items-start gap-5 w-full">
          <div className="p-4 rounded-xl bg-primary/10 shadow-inner">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">
                {serviceType}
              </h1>
              <Badge
                variant="secondary"
                className="text-sm font-medium px-3 py-1 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10"
              >
                {credits} Credits Required
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {description ||
                "Enter the required information below to initiate the investigation."}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* Main Content Area */}
      <div className="relative min-h-[400px]">
        {!result ? (
          <Card className="border-none shadow-xl bg-gradient-to-b from-card to-card/50">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl">Investigation Details</CardTitle>
              <CardDescription className="text-base">
                Please provide the target details carefully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6">
                  {config.fields.map((field) => (
                    <div key={field.name} className="space-y-2.5">
                      <Label
                        htmlFor={field.name}
                        className="text-sm font-semibold ml-1"
                      >
                        {field.label}
                      </Label>
                      {field.name === "mobileNumber" ? (
                        <div className="flex">
                          <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-base font-semibold">
                            +91
                          </span>
                          <Input
                            id={field.name}
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={formData[field.name] || ""}
                            onChange={(e) => {
                              const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              handleInputChange(field.name, value);
                            }}
                            required
                            disabled={isLoading}
                            maxLength={10}
                            pattern="[0-9]{10}"
                            className="h-12 px-4 text-base transition-all focus:ring-2 focus:ring-primary/20 rounded-l-none"
                          />
                        </div>
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          required
                          disabled={isLoading}
                          className="h-12 px-4 text-base transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-3 text-destructive text-sm bg-destructive/5 p-4 rounded-xl border border-destructive/10 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="flex-1 h-12 text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Investigation...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Start Investigation
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Success Status */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Investigation Successful
                  </h3>
                  <p className="text-green-600/80 dark:text-green-400/80 text-sm">
                    Data successfully retrieved and verified.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">
                  Credits Remaining
                </p>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {result.creditsRemaining}
                </p>
              </div>
            </div>

            {/* Results Card */}
            <Card className="shadow-xl overflow-hidden border-none ring-1 ring-border/50">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Result Data</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    {new Date().toLocaleString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {result.data && renderResultData(result.data)}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
              <Button
                onClick={handleNewInvestigation}
                className="flex-1 h-11"
                variant="secondary"
              >
                <Search className="mr-2 h-4 w-4" />
                Start New Investigation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
