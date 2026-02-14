"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  "Adhaar to Aadhaar Details": {
    fields: [
      {
        name: "aadhaarNumber",
        label: "Aadhaar Number",
        placeholder: "Enter 12-digit Aadhaar number",
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

interface ServiceConfig {
  title: string;
  description: string;
  credits: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface InvestigationFormDialogProps {
  service: ServiceConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ApiResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export function InvestigationFormDialog({
  service,
  isOpen,
  onClose,
}: InvestigationFormDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!service) return null;

  const config = serviceInputConfig[service.title] || {
    fields: [
      { name: "query", label: "Query", placeholder: "Enter your search query" },
    ],
  };

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
          serviceType: service.title,
          credits: service.credits,
          ...submitData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Investigation request failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setResult(null);
    setError(null);
    onClose();
  };

  const renderResultData = (data: Record<string, unknown>, level = 0) => {
    return (
      <div
        className={`space-y-2 ${level > 0 ? "ml-4 border-l-2 border-primary/20 pl-3" : ""}`}
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
              <div key={key} className="space-y-1">
                <span className="font-medium text-sm text-muted-foreground">
                  {formattedKey}:
                </span>
                {renderResultData(value as Record<string, unknown>, level + 1)}
              </div>
            );
          }

          if (Array.isArray(value)) {
            return (
              <div key={key} className="space-y-1">
                <span className="font-medium text-sm text-muted-foreground">
                  {formattedKey}:
                </span>
                <div className="ml-4 space-y-1">
                  {value.map((item, index) => (
                    <div key={index} className="text-sm">
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
            <div key={key} className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">{formattedKey}</span>
              <span className="font-medium text-right">{String(value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <service.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg">{service.title}</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {service.description}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold">
              {service.credits} Credits
            </Badge>
          </div>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.name === "mobileNumber" ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm font-medium">
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
                      className="rounded-l-none"
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
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Investigating...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Investigate
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 mt-4">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-base">
                    Investigation Complete
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {result.data && renderResultData(result.data)}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setResult(null);
                  setFormData({});
                }}
              >
                New Investigation
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
