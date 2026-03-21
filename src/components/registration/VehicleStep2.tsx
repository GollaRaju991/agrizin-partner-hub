import { useState } from "react";
import { Car, FileText, Camera, X, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const USAGE_TYPES = ["Farm Work", "Loading", "Transport", "Other"];

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
    if (!data.vehicle_usage_type) newErrors.vehicle_usage_type = "Select vehicle usage type";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return;
    }
    onSubmit();
  };

  const errorClass = (field: string) =>
    errors[field] ? "border-destructive ring-1 ring-destructive" : "border-border";

  const UploadBox = ({
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
      <p className="text-xs text-muted-foreground font-medium">
        {label} {required && "*"}
      </p>
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-24 h-24 rounded-xl object-cover border border-border" />
          <button
            type="button"
            onClick={() => removeFile(field, previewField)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${errors[field] ? "border-destructive" : "border-border"}`}>
          <Camera className="w-5 h-5 text-muted-foreground mb-1" />
          <span className="text-[10px] text-muted-foreground">Upload</span>
          <input type="file" accept="image/*" onChange={handleFileUpload(field, previewField)} className="hidden" />
        </label>
      )}
      {errors[field] && <p className="text-destructive text-[10px]">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="space-y-5 pb-24">
      {/* Vehicle Details */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Car className="w-4 h-4 text-primary" />
          Vehicle Details
        </div>

        <div className="space-y-3">
          <div>
            <Input
              placeholder="Vehicle Number (e.g. AP-09-AB-1234) *"
              value={data.vehicle_number}
              onChange={(e) => update("vehicle_number", e.target.value.toUpperCase())}
              className={`h-11 rounded-xl focus:border-primary ${errorClass("vehicle_number")}`}
            />
            {errors.vehicle_number && <p className="text-destructive text-xs mt-1">{errors.vehicle_number}</p>}
          </div>

          <div>
            <Input
              placeholder="Driving License Number *"
              value={data.driving_license_number}
              onChange={(e) => update("driving_license_number", e.target.value.toUpperCase())}
              className={`h-11 rounded-xl focus:border-primary ${errorClass("driving_license_number")}`}
            />
            {errors.driving_license_number && <p className="text-destructive text-xs mt-1">{errors.driving_license_number}</p>}
          </div>
        </div>
      </div>

      {/* Driving License Upload */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.licenseBack ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <FileText className="w-4 h-4 text-primary" />
          Driving License Images
        </div>
        <p className="text-xs text-muted-foreground">Upload front and back of your driving license</p>
        <div className="flex gap-6 justify-center">
          <UploadBox label="Front" preview={data.licenseFrontPreview} field="licenseFront" previewField="licenseFrontPreview" />
          <UploadBox label="Back" preview={data.licenseBackPreview} field="licenseBack" previewField="licenseBackPreview" required />
        </div>
      </div>

      {/* RC Upload */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <FileText className="w-4 h-4 text-primary" />
          RC (Registration Certificate)
        </div>
        <p className="text-xs text-muted-foreground">Upload RC image (optional)</p>
        <div className="flex justify-center">
          <UploadBox label="RC Image" preview={data.rcImagePreview} field="rcImage" previewField="rcImagePreview" />
        </div>
      </div>

      {/* Vehicle Images */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <ImagePlus className="w-4 h-4 text-primary" />
          Vehicle Images
        </div>
        <p className="text-xs text-muted-foreground">Upload photos of your vehicle</p>

        <div className="flex flex-wrap gap-3">
          {data.vehicleImagePreviews.map((preview, i) => (
            <div key={i} className="relative">
              <img src={preview} alt={`Vehicle ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-border" />
              <button
                type="button"
                onClick={() => removeVehicleImage(i)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <ImagePlus className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-[10px] text-muted-foreground">Add</span>
            <input type="file" accept="image/*" multiple onChange={handleVehicleImages} className="hidden" />
          </label>
        </div>
      </div>

      {/* Vehicle Usage Type */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.vehicle_usage_type ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Car className="w-4 h-4 text-primary" />
          Vehicle Usage Type *
        </div>
        <div className="flex flex-wrap gap-2">
          {USAGE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onChange({ ...data, vehicle_usage_type: type.toLowerCase().replace(/\s/g, "_") });
                setErrors((prev) => ({ ...prev, vehicle_usage_type: "" }));
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                data.vehicle_usage_type === type.toLowerCase().replace(/\s/g, "_")
                  ? "bg-primary text-primary-foreground border-primary"
                  : `bg-card text-foreground hover:border-primary/50 ${errors.vehicle_usage_type ? "border-destructive" : "border-border"}`
              }`}
            >
              {type}
              {data.vehicle_usage_type === type.toLowerCase().replace(/\s/g, "_") && " ✓"}
            </button>
          ))}
        </div>
        {errors.vehicle_usage_type && <p className="text-destructive text-xs mt-1">{errors.vehicle_usage_type}</p>}
      </div>

      {/* Sticky Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border space-y-2">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base hover:opacity-90"
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
        <button
          onClick={onBack}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          ← Back to Step 1
        </button>
      </div>
    </div>
  );
};

export default VehicleStep2;
