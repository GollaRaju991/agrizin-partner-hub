import { useState, useRef, useEffect } from "react";
import { Car, FileText, Camera, X, ImagePlus, Upload, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VEHICLE_TYPE_OPTIONS = [
  { value: "Auto", label: "Auto / ఆటో" },
  { value: "Mini Truck", label: "Mini Truck / మినీ ట్రక్" },
  { value: "Truck", label: "Truck / ట్రక్" },
  { value: "Lorry", label: "Lorry / లారీ" },
  { value: "Tractor", label: "Tractor / ట్రాక్టర్" },
  { value: "Harvester", label: "Harvester / హార్వెస్టర్" },
  { value: "Others", label: "Others / ఇతరులు" },
];

export interface VehicleStep2Data {
  vehicle_number: string;
  driving_license_number: string;
  licenseFront: File | null;
  licenseFrontPreview: string;
  licenseBack: File | null;
  licenseBackPreview: string;
  rcImage: File | null;
  rcImagePreview: string;
  vehicleImages: File[];
  vehicleImagePreviews: string[];
  vehicle_usage_type: string;
}

interface Props {
  data: VehicleStep2Data;
  onChange: (data: VehicleStep2Data) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

const VehicleStep2 = ({ data, onChange, onSubmit, onBack, loading }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse stored vehicle_usage_type (comma-separated) into array
  const selectedTypes = data.vehicle_usage_type ? data.vehicle_usage_type.split(",").filter(Boolean) : [];

  const toggleType = (value: string) => {
    const updated = selectedTypes.includes(value)
      ? selectedTypes.filter((v) => v !== value)
      : [...selectedTypes, value];
    onChange({ ...data, vehicle_usage_type: updated.join(",") });
    if (errors.vehicle_usage_type) setErrors((prev) => ({ ...prev, vehicle_usage_type: "" }));
  };

  const removeType = (value: string) => {
    const updated = selectedTypes.filter((v) => v !== value);
    onChange({ ...data, vehicle_usage_type: updated.join(",") });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const update = (field: keyof VehicleStep2Data, value: string) => {
    onChange({ ...data, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileUpload = (
    field: "licenseFront" | "licenseBack" | "rcImage",
    previewField: "licenseFrontPreview" | "licenseBackPreview" | "rcImagePreview"
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

  const removeFile = (
    field: "licenseFront" | "licenseBack" | "rcImage",
    previewField: "licenseFrontPreview" | "licenseBackPreview" | "rcImagePreview"
  ) => {
    onChange({ ...data, [field]: null, [previewField]: "" });
  };

  const handleVehicleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) toast.error("Some files exceeded 10 MB limit");
    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    onChange({
      ...data,
      vehicleImages: [...data.vehicleImages, ...validFiles],
      vehicleImagePreviews: [...data.vehicleImagePreviews, ...newPreviews],
    });
  };

  const removeVehicleImage = (index: number) => {
    onChange({
      ...data,
      vehicleImages: data.vehicleImages.filter((_, i) => i !== index),
      vehicleImagePreviews: data.vehicleImagePreviews.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!data.vehicle_number.trim()) newErrors.vehicle_number = "Vehicle number is required";
    if (!data.driving_license_number.trim()) newErrors.driving_license_number = "License number is required";
    if (!data.licenseBack) newErrors.licenseBack = "License back image is required";
    if (!data.vehicle_usage_type) newErrors.vehicle_usage_type = "Please select at least one vehicle type / కనీసం ఒక వాహనం రకం ఎంచుకోండి";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return;
    }
    onSubmit();
  };

  const errorClass = (field: string) =>
    errors[field] ? "border-destructive ring-1 ring-destructive" : "";

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-semibold text-foreground mb-1.5">{children}</label>
  );

  const DocUpload = ({
    label,
    preview,
    field,
    previewField,
    required,
  }: {
    label: string;
    preview: string;
    field: "licenseFront" | "licenseBack" | "rcImage";
    previewField: "licenseFrontPreview" | "licenseBackPreview" | "rcImagePreview";
    required?: boolean;
  }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium">
        {label} {required && "*"}
      </span>
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-32 h-20 md:w-36 md:h-24 rounded-lg object-cover border-2 border-primary/30" />
          <button
            type="button"
            onClick={() => removeFile(field, previewField)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80 shadow-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <label className="block text-center mt-1 cursor-pointer">
            <span className="text-xs text-primary font-medium hover:underline">Change</span>
            <input type="file" accept="image/*" onChange={handleFileUpload(field, previewField)} className="hidden" />
          </label>
        </div>
      ) : (
        <label
          className={`w-32 h-20 md:w-36 md:h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors ${errors[field] ? "border-destructive" : "border-border"}`}
        >
          <Camera className="w-5 h-5 text-muted-foreground mb-1" />
          <span className="text-[10px] text-muted-foreground">Upload Image</span>
          <input type="file" accept="image/*" onChange={handleFileUpload(field, previewField)} className="hidden" />
        </label>
      )}
      {errors[field] && <p className="text-destructive text-[10px]">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-5 md:p-8 space-y-6">
        {/* Mobile step title */}
        <h2 className="md:hidden font-heading font-bold text-lg text-foreground">Step 2: Vehicle Details</h2>

        {/* Desktop: 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Vehicle Number */}
            <div>
              <FieldLabel>Vehicle Number *</FieldLabel>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  placeholder="E.g. MH01AB1234"
                  value={data.vehicle_number}
                  onChange={(e) => update("vehicle_number", e.target.value.toUpperCase())}
                  className={`pl-10 h-11 rounded-lg ${errorClass("vehicle_number")}`}
                />
              </div>
              {errors.vehicle_number && <p className="text-destructive text-xs mt-1">{errors.vehicle_number}</p>}
            </div>

            {/* DL Number */}
            <div>
              <FieldLabel>Driving License Number *</FieldLabel>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  placeholder="E.g. DL1234567890123"
                  value={data.driving_license_number}
                  onChange={(e) => update("driving_license_number", e.target.value.toUpperCase())}
                  className={`pl-10 h-11 rounded-lg ${errorClass("driving_license_number")}`}
                />
              </div>
              {errors.driving_license_number && <p className="text-destructive text-xs mt-1">{errors.driving_license_number}</p>}
            </div>

            {/* RC Upload */}
            <div>
              <FieldLabel>Upload RC Document (Optional)</FieldLabel>
              {data.rcImagePreview ? (
                <div className="relative inline-block">
                  <img src={data.rcImagePreview} alt="RC" className="w-full max-w-xs h-24 rounded-lg object-cover border-2 border-primary/30" />
                  <button
                    type="button"
                    onClick={() => removeFile("rcImage", "rcImagePreview")}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 h-11 px-4 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors w-fit">
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Upload RC Image</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload("rcImage", "rcImagePreview")} className="hidden" />
                </label>
              )}
            </div>

            {/* Vehicle Photos */}
            <div>
              <FieldLabel>Upload Vehicle Photos *</FieldLabel>
              <div className="flex flex-wrap gap-3">
                {data.vehicleImagePreviews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img src={preview} alt={`Vehicle ${i + 1}`} className="w-28 h-20 rounded-lg object-cover border-2 border-primary/30" />
                    <button
                      type="button"
                      onClick={() => removeVehicleImage(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <label className="block text-center mt-1 cursor-pointer">
                      <span className="text-xs text-primary font-medium hover:underline">Change</span>
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10 MB"); return; }
                        const newImages = [...data.vehicleImages];
                        const newPreviews = [...data.vehicleImagePreviews];
                        newImages[i] = file;
                        newPreviews[i] = URL.createObjectURL(file);
                        onChange({ ...data, vehicleImages: newImages, vehicleImagePreviews: newPreviews });
                      }} className="hidden" />
                    </label>
                  </div>
                ))}
                <label className="w-28 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <ImagePlus className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">Upload Image</span>
                  <input type="file" accept="image/*" multiple onChange={handleVehicleImages} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Aadhaar/PAN Images (desktop only - mobile shows in step1) */}
            <div className="hidden md:block">
              <FieldLabel>Upload Aadhaar / PAN Images *</FieldLabel>
              <p className="text-xs text-muted-foreground mb-3">Front and back side images</p>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-foreground">Front Side Image</span>
                  <div className="w-36 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                    <span className="text-xs text-muted-foreground">From Step 1</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-foreground">Back Side Image</span>
                  <div className="w-36 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                    <span className="text-xs text-muted-foreground">From Step 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Driving License Upload */}
            <div>
              <FieldLabel>Upload Driving License *</FieldLabel>
              <div className="flex gap-4">
                <DocUpload label="Front Image" preview={data.licenseFrontPreview} field="licenseFront" previewField="licenseFrontPreview" />
                <DocUpload label="Back Image" preview={data.licenseBackPreview} field="licenseBack" previewField="licenseBackPreview" required />
              </div>
            </div>

            {/* Vehicle Usage Type */}
            <div>
              <FieldLabel>Vehicle Usage Type *</FieldLabel>
              <div className="flex flex-wrap gap-3 mt-1">
                {USAGE_TYPES.map((type) => {
                  const val = type.toLowerCase().replace(/\s/g, "_");
                  const isSelected = data.vehicle_usage_type === val;
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        onChange({ ...data, vehicle_usage_type: val });
                        setErrors((prev) => ({ ...prev, vehicle_usage_type: "" }));
                      }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary bg-primary" : errors.vehicle_usage_type ? "border-destructive" : "border-border"}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                      </div>
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  );
                })}
              </div>
              {errors.vehicle_usage_type && <p className="text-destructive text-xs mt-1">{errors.vehicle_usage_type}</p>}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Step 1
          </button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 px-10 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-heading font-bold text-sm hover:opacity-90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleStep2;
