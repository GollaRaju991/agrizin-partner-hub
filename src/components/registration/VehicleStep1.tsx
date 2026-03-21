import { useState } from "react";
import { User, Phone, MapPin, Camera, FileText, ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const update = (field: keyof VehicleStep1Data, value: string | File | null) => {
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

  const handleImageUpload = (field: "profileImage" | "aadhaarFront" | "aadhaarBack", previewField: "profileImagePreview" | "aadhaarFrontPreview" | "aadhaarBackPreview") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be under 10 MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      onChange({ ...data, [field]: file, [previewField]: preview });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const removeImage = (field: "profileImage" | "aadhaarFront" | "aadhaarBack", previewField: "profileImagePreview" | "aadhaarFrontPreview" | "aadhaarBackPreview") => {
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
    if (!data.mobile.trim() || data.mobile.length < 10) newErrors.mobile = "Valid 10-digit mobile number is required";
    if (!data.aadhaar_pan.trim()) newErrors.aadhaar_pan = "Aadhaar/PAN is required";
    else if (!validateAadhaarPan(data.aadhaar_pan.trim())) newErrors.aadhaar_pan = "Enter valid 12-digit Aadhaar or 10-char PAN";
    if (!data.state) newErrors.state = "State is required";
    if (!data.district) newErrors.district = "District is required";
    if (!data.profileImage) newErrors.profileImage = "Profile photo is required";
    if (!data.aadhaarFront) newErrors.aadhaarFront = "Aadhaar/PAN front image is required";
    if (!data.aadhaarBack) newErrors.aadhaarBack = "Aadhaar/PAN back image is required";

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
    errors[field] ? "border-destructive ring-1 ring-destructive" : "border-border";

  const ImageUploadBox = ({
    label,
    field,
    previewField,
    preview,
  }: {
    label: string;
    field: "profileImage" | "aadhaarFront" | "aadhaarBack";
    previewField: "profileImagePreview" | "aadhaarFrontPreview" | "aadhaarBackPreview";
    preview: string;
  }) => (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-24 h-24 rounded-xl object-cover border border-border" />
          <button
            type="button"
            onClick={() => removeImage(field, previewField)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${errors[field] ? "border-destructive" : "border-border"}`}>
          <Camera className="w-5 h-5 text-muted-foreground mb-1" />
          <span className="text-[10px] text-muted-foreground">Upload</span>
          <input type="file" accept="image/*" onChange={handleImageUpload(field, previewField)} className="hidden" />
        </label>
      )}
      {errors[field] && <p className="text-destructive text-[10px]">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="space-y-5 pb-24">
      {/* Personal Details */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <User className="w-4 h-4 text-primary" />
          Personal Details
        </div>

        <div className="space-y-3">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Full Name *"
                value={data.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                className={`pl-10 h-11 rounded-xl focus:border-primary ${errorClass("full_name")}`}
              />
            </div>
            {errors.full_name && <p className="text-destructive text-xs mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
              <Input
                placeholder="90000 00000"
                value={data.mobile}
                onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`pl-[4.5rem] h-11 rounded-xl focus:border-primary ${errorClass("mobile")}`}
              />
            </div>
            {errors.mobile && <p className="text-destructive text-xs mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Aadhaar (12 digits) or PAN (e.g. ABCDE1234F) *"
                value={data.aadhaar_pan}
                onChange={(e) => update("aadhaar_pan", e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12))}
                className={`pl-10 h-11 rounded-xl focus:border-primary ${errorClass("aadhaar_pan")}`}
              />
            </div>
            {errors.aadhaar_pan && <p className="text-destructive text-xs mt-1">{errors.aadhaar_pan}</p>}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <MapPin className="w-4 h-4 text-primary" />
          Address Details
        </div>

        <div className="flex items-center justify-between border border-border rounded-xl px-3 h-11">
          <span className="text-sm text-foreground">Country</span>
          <span className="text-sm text-muted-foreground">India</span>
        </div>

        <Select value={data.state} onValueChange={handleStateChange}>
          <SelectTrigger className={`h-11 rounded-xl ${errorClass("state")}`}>
            <SelectValue placeholder="Select state *" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {states.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}

        <Select value={data.district} onValueChange={handleDistrictChange} disabled={!data.state}>
          <SelectTrigger className={`h-11 rounded-xl ${errorClass("district")}`}>
            <SelectValue placeholder="Select district *" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {districts.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.district && <p className="text-destructive text-xs mt-1">{errors.district}</p>}

        <Select value={data.mandal} onValueChange={(v) => update("mandal", v)} disabled={!data.district}>
          <SelectTrigger className="h-11 rounded-xl border-border">
            <SelectValue placeholder="Select mandal" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {mandals.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Village"
          value={data.village}
          onChange={(e) => update("village", e.target.value)}
          className="h-11 rounded-xl border-border focus:border-primary"
        />
      </div>

      {/* Profile Photo */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.profileImage ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Camera className="w-4 h-4 text-primary" />
          Profile Photo *
        </div>
        <p className="text-xs text-muted-foreground">Upload a clear profile photo. Max 10 MB</p>
        <ImageUploadBox label="Profile" field="profileImage" previewField="profileImagePreview" preview={data.profileImagePreview} />
      </div>

      {/* Aadhaar / PAN Images */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.aadhaarFront || errors.aadhaarBack ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <FileText className="w-4 h-4 text-primary" />
          Aadhaar / PAN Images *
        </div>
        <p className="text-xs text-muted-foreground">Upload front and back of your Aadhaar or PAN card</p>
        <div className="flex gap-6 justify-center">
          <ImageUploadBox label="Front Side" field="aadhaarFront" previewField="aadhaarFrontPreview" preview={data.aadhaarFrontPreview} />
          <ImageUploadBox label="Back Side" field="aadhaarBack" previewField="aadhaarBackPreview" preview={data.aadhaarBackPreview} />
        </div>
      </div>

      {/* Sticky Next */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border space-y-2">
        <Button
          onClick={handleNext}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base hover:opacity-90"
        >
          Next →
        </Button>
        <button
          onClick={onBack}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>
    </div>
  );
};

export default VehicleStep1;
