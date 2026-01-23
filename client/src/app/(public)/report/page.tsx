"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileWarning,
  MapPin,
  Calendar,
  AlertTriangle,
  Send,
  Info,
  Loader2,
  Link as LinkIcon,
  Plus,
  X,
} from "lucide-react";
import { PrivateRoute } from "@/components/auth";
import { useSubmitCrime } from "@/hooks/useCrimes";
import { showSuccess, showError } from "@/lib/toast";
import { CrimeType, Severity } from "@/types/api.types";
import { BD_LOCATIONS } from "@/data/bd-divisions";

const crimeTypeOptions = [
  { value: CrimeType.THEFT, label: "Theft" },
  { value: CrimeType.ROBBERY, label: "Robbery" },
  { value: CrimeType.ASSAULT, label: "Assault" },
  { value: CrimeType.MURDER, label: "Murder" },
  { value: CrimeType.KIDNAPPING, label: "Kidnapping" },
  { value: CrimeType.FRAUD, label: "Fraud" },
  { value: CrimeType.CYBERCRIME, label: "Cybercrime" },
  { value: CrimeType.DRUG_RELATED, label: "Drug Related" },
  { value: CrimeType.VANDALISM, label: "Vandalism" },
  { value: CrimeType.HARASSMENT, label: "Harassment" },
  { value: CrimeType.DOMESTIC_VIOLENCE, label: "Domestic Violence" },
  { value: CrimeType.SEXUAL_ASSAULT, label: "Sexual Assault" },
  { value: CrimeType.BURGLARY, label: "Burglary" },
  { value: CrimeType.VEHICLE_THEFT, label: "Vehicle Theft" },
  { value: CrimeType.OTHER, label: "Other" },
];

const severityOptions = [
  {
    value: Severity.LOW,
    label: "Low",
    description: "Minor, non-violent incidents",
  },
  {
    value: Severity.MEDIUM,
    label: "Medium",
    description: "Moderate impact incidents",
  },
  {
    value: Severity.HIGH,
    label: "High",
    description: "Serious crimes requiring attention",
  },
  {
    value: Severity.CRITICAL,
    label: "Critical",
    description: "Severe, life-threatening situations",
  },
];

interface FormState {
  crimeType: CrimeType | "";
  severity: Severity | "";
  description: string;
  division: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  occurredAt: string;
  isAnonymous: boolean;
  media: string[];
}

function ReportCrimeContent() {
  const router = useRouter();
  const { mutate: submitCrime, isPending } = useSubmitCrime();

  const [formData, setFormData] = React.useState<FormState>({
    crimeType: "",
    severity: "",
    description: "",
    division: "Dhaka",
    district: "Dhaka",
    address: "",
    latitude: 23.8103,
    longitude: 90.4125,
    occurredAt: new Date().toISOString().slice(0, 16),
    isAnonymous: false,
    media: [],
  });

  const [mediaInput, setMediaInput] = React.useState("");

  const addMedia = () => {
    if (!mediaInput) return;

    // Basic URL validation
    try {
      let urlToAdd = mediaInput.trim();
      if (!/^https?:\/\//i.test(urlToAdd)) {
        urlToAdd = `https://${urlToAdd}`;
      }
      new URL(urlToAdd);

      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, urlToAdd],
      }));
      setMediaInput("");
      if (errors.media) setErrors((prev) => ({ ...prev, media: undefined }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        media: "Please enter a valid URL (e.g., https://example.com)",
      }));
    }
  };

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const [errors, setErrors] = React.useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.crimeType) newErrors.crimeType = "Please select a crime type";
    if (!formData.severity) newErrors.severity = "Please select severity level";
    if (formData.description.length < 20)
      newErrors.description = "Description must be at least 20 characters";
    if (formData.address.length < 5)
      newErrors.address = "Please provide a valid address";
    if (!formData.occurredAt)
      newErrors.occurredAt = "Please provide when the incident occurred";

    setErrors(newErrors);
    if (formData.description.length < 20)
      newErrors.description = "Description must be at least 20 characters";
    if (!formData.division) newErrors.division = "Please select a division";
    if (!formData.district) newErrors.district = "Please select a district";
    if (formData.address.length < 5)
      newErrors.address = "Please provide a valid address";
    if (!formData.occurredAt)
      newErrors.occurredAt = "Please provide when the incident occurred";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Handle pending media input (User typed but didn't click Add)
    const finalMedia = [...formData.media];
    let mediaInputError = null;

    if (mediaInput && mediaInput.trim() !== "") {
      try {
        let urlToAdd = mediaInput.trim();
        if (!/^https?:\/\//i.test(urlToAdd)) {
          urlToAdd = `https://${urlToAdd}`;
        }
        new URL(urlToAdd);
        finalMedia.push(urlToAdd);
      } catch {
        mediaInputError =
          "Please add or clear the invalid URL in the input field";
      }
    }

    const isFormValid = validate();

    if (mediaInputError) {
      setErrors((prev) => ({ ...prev, media: mediaInputError }));
      return;
    }

    if (!isFormValid) return;
    if (!formData.crimeType || !formData.severity) return;

    submitCrime(
      {
        crimeType: formData.crimeType,
        severity: formData.severity,
        description: formData.description,
        division: formData.division,
        district: formData.district,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        occurredAt: new Date(formData.occurredAt).toISOString(),
        isAnonymous: formData.isAnonymous,
        media: finalMedia,
      },
      {
        onSuccess: () => {
          showSuccess("Crime report submitted successfully!");
          router.push("/search");
        },
        onError: (error) => {
          showError(
            error instanceof Error ? error.message : "Failed to submit report",
          );
        },
      },
    );
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        showSuccess("Location updated!");
      },
      () => {
        showError("Unable to get your location. Please enter manually.");
      },
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileWarning className="size-8 text-primary" />
            Report a Crime
          </h1>
          <p className="mt-2 text-muted-foreground">
            Submit a crime report to help keep your community informed and safe
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="flex gap-3 p-4">
            <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Your report matters</p>
              <p className="mt-1 text-blue-700 dark:text-blue-300">
                All reports are reviewed by our moderation team before being
                published. You can choose to submit anonymously if you prefer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Crime Report Details</CardTitle>
            <CardDescription>
              Please provide as much detail as possible about the incident
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crime Type */}
              <div className="space-y-2">
                <Label htmlFor="crimeType">Crime Type *</Label>
                <select
                  id="crimeType"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={formData.crimeType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      crimeType: e.target.value as CrimeType,
                    })
                  }
                >
                  <option value="">Select crime type...</option>
                  {crimeTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.crimeType && (
                  <p className="text-sm text-destructive">{errors.crimeType}</p>
                )}
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <Label>Severity Level *</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {severityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer flex-col rounded-lg border p-3 transition-colors hover:bg-muted ${
                        formData.severity === option.value
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name="severity"
                        value={option.value}
                        checked={formData.severity === option.value}
                        onChange={() =>
                          setFormData({ ...formData, severity: option.value })
                        }
                      />
                      <span className="font-medium text-sm">
                        {option.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.severity && (
                  <p className="text-sm text-destructive">{errors.severity}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[120px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Describe the incident in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 20 characters. Be specific but do not include personal
                  identifying information.
                </p>
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Evidence / Sources */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sources / Evidence (Optional)</Label>
                  <p className="text-xs text-muted-foreground">
                    Add links to news articles, social media posts, or other
                    public evidence.
                  </p>

                  <div className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={mediaInput}
                      onChange={(e) => {
                        setMediaInput(e.target.value);
                        if (errors.media)
                          setErrors((prev) => ({ ...prev, media: undefined }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMedia();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addMedia}
                    >
                      <Plus className="size-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {errors.media && (
                    <p className="text-sm text-destructive">{errors.media}</p>
                  )}

                  {formData.media.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {formData.media.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm group"
                        >
                          <LinkIcon className="size-3 text-muted-foreground shrink-0" />
                          <span className="truncate flex-1">{url}</span>
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Location</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                  >
                    <MapPin className="mr-2 size-4" />
                    Use My Location
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="division">Division *</Label>
                    <select
                      id="division"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={formData.division}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          division: e.target.value,
                          district: "", // Reset district when division changes
                        })
                      }
                    >
                      <option value="">Select Division</option>
                      {Object.keys(BD_LOCATIONS).map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                    {errors.division && (
                      <p className="text-sm text-destructive">{errors.division}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <select
                      id="district"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={formData.district}
                      disabled={!formData.division}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                    >
                      <option value="">Select District</option>
                      {formData.division &&
                        BD_LOCATIONS[formData.division]?.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                    </select>
                    {errors.district && (
                      <p className="text-sm text-destructive">{errors.district}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter the location address..."
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          latitude: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          longitude: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="occurredAt" className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  When did this occur? *
                </Label>
                <Input
                  id="occurredAt"
                  type="datetime-local"
                  value={formData.occurredAt}
                  onChange={(e) =>
                    setFormData({ ...formData, occurredAt: e.target.value })
                  }
                />
                {errors.occurredAt && (
                  <p className="text-sm text-destructive">
                    {errors.occurredAt}
                  </p>
                )}
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                  id="isAnonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAnonymous: checked === true })
                  }
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="isAnonymous" className="cursor-pointer">
                    Submit Anonymously
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your identity will not be linked to this report. This cannot
                    be changed later.
                  </p>
                </div>
              </div>

              {/* Warning */}
              <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
                <CardContent className="flex gap-3 p-4">
                  <AlertTriangle className="size-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium">
                      False reports are taken seriously
                    </p>
                    <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                      Submitting false information may result in account
                      suspension and legal action.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <PrivateRoute>
      <ReportCrimeContent />
    </PrivateRoute>
  );
}
