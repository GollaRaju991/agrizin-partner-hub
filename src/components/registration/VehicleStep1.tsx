import { useState } from "react";
import { User, Phone, CreditCard, MapPin, Globe, Home, Camera, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getStates, getDistricts, getMandals } from "@/data/indianLocations";

export interface VehicleStep1Data {
  full_name: string;
  mobile: string;
  aadhaar_pan: string;
  country: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  profileImage: File | null;
  profileImagePreview: string;
  aadhaarFront: File | null;
  aadhaarFrontPreview: string;
  aadhaarBack: File | null;
  aadhaarBackPreview: string;
}

interface Props {
  data: VehicleStep1Data;
  onChange: (data: VehicleStep1Data) => void;
  onNext: () => void;
  onBack: () => void;
}

const VehicleStep1 = ({ data, onChange, onNext, onBack }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof VehicleStep1Data, value: string) => {
    onChange({ ...data, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleStateChange = (state: string) => {
    onChange({ ...data, state, district: "", mandal: "" });
    setErrors((prev) => ({ ...prev, state: "", district: "", mandal: "" }));
  };

  const handleDistrictChange = (district: string) => {
    onChange({ ...data, district, mandal: "" });
    setErrors((prev) => ({ ...prev, district: "", mandal: "" }));
  };

  const handleImageUpload = (
    field: "profileImage" | "aadhaarFront" | "aadhaarBack",
    previewField: "profileImagePreview" | "aadhaarFrontPreview" | "aadhaarBackPreview"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    onChange({ ...data, [field]: file, [previewField]: URL.createObjectURL(file) });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const removeImage = (
    field: "profileImage" | "aadhaarFront" | "aadhaarBack",
    previewField: "profileImagePreview" | "aadhaarFrontPreview" | "aadhaarBackPreview"
  ) => {
    onChange({ ...data, [field]: null, [previewField]: "" });
  };

  const validateAadhaarPan = (value: string): boolean => {
    const aadhaarRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
    return aadhaarRegex.test(value) || panRegex.test(value.toUpperCase());
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (!data.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!data.mobile.trim() || data.mobile.length < 10) newErrors.mobile = "Valid 10-digit mobile required";
    if (!data.aadhaar_pan.trim()) newErrors.aadhaar_pan = "Aadhaar/PAN is required";
    else if (!validateAadhaarPan(data.aadhaar_pan.trim())) newErrors.aadhaar_pan = "Enter valid 12-digit Aadhaar or 10-char PAN";
    if (!data.state) newErrors.state = "State is required";
    if (!data.district) newErrors.district = "District is required";
    if (!data.profileImage) newErrors.profileImage = "Profile photo is required";
    if (!data.aadhaarFront) newErrors.aadhaarFront = "Front image is required";
    if (!data.aadhaarBack) newErrors.aadhaarBack = "Back image is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return;
    }
    onNext();
  };

  const states = getStates();
  const districts = data.state ? getDistricts(data.state) : [];
  const mandals = data.state && data.district ? getMandals(data.state, data.district) : [];

  const errorClass = (field: string) =>
    errors[field] ? "border-destructive ring-1 ring-destructive" : "";

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-semibold text-foreground mb-1.5">{children}</label>
  );

  const ImageUpload = ({
    label,
    field,
    previewField,
    preview,
    rounded = false,
    size = "md",
  }: {
    label: string;
    field: "profileImage" | "aadhaarFront" | "aadhaarBack";
    previewField: "profileImagePreview" | "aadhaarFrontPreview" | "aadhaarBackPreview";
    preview: string;
    rounded?: boolean;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizeClasses = size === "lg" ? "w-28 h-28" : size === "md" ? "w-24 h-24" : "w-20 h-20";
    return (
      <div className="flex flex-col items-center gap-2">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={label}
              className={`${sizeClasses} ${rounded ? "rounded-full" : "rounded-lg"} object-cover border-2 border-primary/30`}
            />
            <button
              type="button"
              onClick={() => removeImage(field, previewField)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80 shadow-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <label className="mt-1 cursor-pointer">
              <span className="text-xs text-primary font-medium hover:underline">Change</span>
              <input type="file" accept="image/*" onChange={handleImageUpload(field, previewField)} className="hidden" />
            </label>
          </div>
        ) : (
          <label
            className={`${sizeClasses} ${rounded ? "rounded-full" : "rounded-lg"} border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors ${errors[field] ? "border-destructive" : "border-border"}`}
          >
            <Camera className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-[10px] text-muted-foreground">Upload</span>
            <input type="file" accept="image/*" onChange={handleImageUpload(field, previewField)} className="hidden" />
          </label>
        )}
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        {errors[field] && <p className="text-destructive text-[10px]">{errors[field]}</p>}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-5 md:p-8 space-y-6">
        {/* Mobile: Step title */}
        <h2 className="md:hidden font-heading font-bold text-lg text-foreground">Step 1: Personal Details</h2>

        {/* Desktop: 2-column layout for name+mobile+profile, Mobile: single column */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
          <div className="space-y-4">
            {/* Full Name & Mobile - 2 col on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Full Name *</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    placeholder="E.g. John Doe"
                    value={data.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    className={`pl-10 h-11 rounded-lg ${errorClass("full_name")}`}
                  />
                </div>
                {errors.full_name && <p className="text-destructive text-xs mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <FieldLabel>Mobile Number *</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    placeholder="E.g. 9876543210"
                    value={data.mobile}
                    onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={`pl-10 h-11 rounded-lg ${errorClass("mobile")}`}
                  />
                </div>
                {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>

            {/* Aadhaar / PAN */}
            <div>
              <FieldLabel>Aadhaar / PAN Number *</FieldLabel>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  placeholder="E.g. 123456789012 or ABCDE1234F"
                  value={data.aadhaar_pan}
                  onChange={(e) => update("aadhaar_pan", e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12))}
                  className={`pl-10 h-11 rounded-lg ${errorClass("aadhaar_pan")}`}
                />
              </div>
              {errors.aadhaar_pan && <p className="text-destructive text-xs mt-1">{errors.aadhaar_pan}</p>}
            </div>
          </div>

          {/* Profile Image - right side on desktop, below on mobile */}
          <div className="flex flex-col items-center md:items-center justify-start">
            <FieldLabel>Upload Profile Image *</FieldLabel>
            <ImageUpload label="" field="profileImage" previewField="profileImagePreview" preview={data.profileImagePreview} rounded size="lg" />
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-base text-foreground">Address Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                <div className="flex items-center h-11 rounded-lg border border-input bg-muted/50 pl-10 pr-3">
                  <span className="text-sm text-foreground">Country</span>
                  <span className="ml-auto text-sm text-muted-foreground">India</span>
                </div>
              </div>
            </div>
            <div>
              <Select value={data.state} onValueChange={handleStateChange}>
                <SelectTrigger className={`h-11 rounded-lg ${errorClass("state")}`}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Select State *" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
            </div>
            <div>
              <Select value={data.district} onValueChange={handleDistrictChange} disabled={!data.state}>
                <SelectTrigger className={`h-11 rounded-lg ${errorClass("district")}`}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Select District *" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-destructive text-xs mt-1">{errors.district}</p>}
            </div>
            <div>
              <Select value={data.mandal} onValueChange={(v) => update("mandal", v)} disabled={!data.district}>
                <SelectTrigger className="h-11 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Mandal *" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {mandals.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 md:max-w-[calc(50%-0.5rem)]">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  placeholder="E.g. Enter Village Name"
                  value={data.village}
                  onChange={(e) => update("village", e.target.value)}
                  className="pl-10 h-11 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aadhaar/PAN Images */}
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-base text-foreground">Aadhaar / PAN Images *</h3>
          <div className="flex gap-6 justify-center">
            <ImageUpload label="Front Side" field="aadhaarFront" previewField="aadhaarFrontPreview" preview={data.aadhaarFrontPreview} />
            <ImageUpload label="Back Side" field="aadhaarBack" previewField="aadhaarBackPreview" preview={data.aadhaarBackPreview} />
          </div>
        </div>

        {/* Next button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleNext}
            className="h-11 px-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-heading font-bold text-sm hover:opacity-90"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleStep1;
