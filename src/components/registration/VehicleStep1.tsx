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
    <label className="block text-xs font-semibold text-foreground mb-1">{children}</label>
  );

  const DocImageUpload = ({
    label,
    field,
    previewField,
    preview,
  }: {
    label: string;
    field: "aadhaarFront" | "aadhaarBack";
    previewField: "aadhaarFrontPreview" | "aadhaarBackPreview";
    preview: string;
  }) => (
    <div className="flex flex-col items-center gap-1.5">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-[100px] h-[68px] md:w-28 md:h-20 rounded-lg object-cover border-2 border-primary/20 shadow-sm"
          />
          <button
            type="button"
            onClick={() => removeImage(field, previewField)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
          >
            <X className="w-3 h-3" />
          </button>
          <label className="mt-0.5 cursor-pointer block text-center">
            <span className="text-[10px] text-primary font-medium hover:underline">Change</span>
            <input type="file" accept="image/*" onChange={handleImageUpload(field, previewField)} className="hidden" />
          </label>
        </div>
      ) : (
        <label
          className={`w-[100px] h-[68px] md:w-28 md:h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all ${errors[field] ? "border-destructive bg-destructive/5" : "border-border"}`}
        >
          <Camera className="w-4 h-4 text-muted-foreground mb-0.5" />
          <span className="text-[9px] text-muted-foreground font-medium">Upload</span>
          <input type="file" accept="image/*" onChange={handleImageUpload(field, previewField)} className="hidden" />
        </label>
      )}
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
      {errors[field] && <p className="text-destructive text-[9px]">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 md:p-8 space-y-5">

        {/* Title row with profile image inline */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading font-bold text-base md:text-lg text-foreground pt-1">
            Step 1: Personal Details
          </h2>
          {/* Profile Image - circular, top right */}
          <div className="flex flex-col items-center shrink-0">
            {data.profileImagePreview ? (
              <div className="relative">
                <img
                  src={data.profileImagePreview}
                  alt="Profile"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-primary/30 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage("profileImage", "profileImagePreview")}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
                <label className="block text-center mt-0.5 cursor-pointer">
                  <span className="text-[9px] text-primary font-medium hover:underline">Change</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload("profileImage", "profileImagePreview")} className="hidden" />
                </label>
              </div>
            ) : (
              <label
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all ${errors.profileImage ? "border-destructive bg-destructive/5" : "border-primary/30"}`}
              >
                <Camera className="w-4 h-4 text-muted-foreground mb-0.5" />
                <span className="text-[8px] text-muted-foreground font-medium">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload("profileImage", "profileImagePreview")} className="hidden" />
              </label>
            )}
            {errors.profileImage && <p className="text-destructive text-[9px] mt-0.5">{errors.profileImage}</p>}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3.5">
          {/* Full Name */}
          <div>
            <FieldLabel>Full Name *</FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                placeholder="E.g. John Doe"
                value={data.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                className={`pl-10 h-10 rounded-lg text-sm ${errorClass("full_name")}`}
              />
            </div>
            {errors.full_name && <p className="text-destructive text-[10px] mt-0.5">{errors.full_name}</p>}
          </div>

          {/* Mobile */}
          <div>
            <FieldLabel>Mobile Number *</FieldLabel>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                placeholder="E.g. 9876543210"
                value={data.mobile}
                onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`pl-10 h-10 rounded-lg text-sm ${errorClass("mobile")}`}
              />
            </div>
            {errors.mobile && <p className="text-destructive text-[10px] mt-0.5">{errors.mobile}</p>}
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
                className={`pl-10 h-10 rounded-lg text-sm ${errorClass("aadhaar_pan")}`}
              />
            </div>
            {errors.aadhaar_pan && <p className="text-destructive text-[10px] mt-0.5">{errors.aadhaar_pan}</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Address Details */}
        <div className="space-y-3.5">
          <h3 className="font-heading font-semibold text-sm text-foreground">Address Details</h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Country */}
            <div>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary z-10" />
                <div className="flex items-center h-10 rounded-lg border border-input bg-muted/50 pl-9 pr-3">
                  <span className="text-xs text-foreground">Country</span>
                  <span className="ml-auto text-xs text-muted-foreground">India</span>
                </div>
              </div>
            </div>
            {/* State */}
            <div>
              <Select value={data.state} onValueChange={handleStateChange}>
                <SelectTrigger className={`h-10 rounded-lg text-xs ${errorClass("state")}`}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <SelectValue placeholder="Select State *" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {states.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-destructive text-[10px] mt-0.5">{errors.state}</p>}
            </div>
            {/* District */}
            <div>
              <Select value={data.district} onValueChange={handleDistrictChange} disabled={!data.state}>
                <SelectTrigger className={`h-10 rounded-lg text-xs ${errorClass("district")}`}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <SelectValue placeholder="District *" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {districts.map((d) => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-destructive text-[10px] mt-0.5">{errors.district}</p>}
            </div>
            {/* Mandal */}
            <div>
              <Select value={data.mandal} onValueChange={(v) => update("mandal", v)} disabled={!data.district}>
                <SelectTrigger className="h-10 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-primary shrink-0" />
                    <SelectValue placeholder="Mandal" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {mandals.map((m) => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Village */}
          <div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
              <Input
                placeholder="Enter Village Name"
                value={data.village}
                onChange={(e) => update("village", e.target.value)}
                className="pl-9 h-10 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Aadhaar/PAN Images */}
        <div className="space-y-2.5">
          <h3 className="font-heading font-semibold text-sm text-foreground">Aadhaar / PAN Images *</h3>
          <div className="flex gap-6 justify-center">
            <DocImageUpload label="Front Side" field="aadhaarFront" previewField="aadhaarFrontPreview" preview={data.aadhaarFrontPreview} />
            <DocImageUpload label="Back Side" field="aadhaarBack" previewField="aadhaarBackPreview" preview={data.aadhaarBackPreview} />
          </div>
        </div>

        {/* Next button */}
        <div className="pt-1">
          <Button
            onClick={handleNext}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-heading font-bold text-sm hover:opacity-90 shadow-md"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleStep1;
