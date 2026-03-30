import { useState } from "react";
import { Car, FileText, Camera, X, ImagePlus, Calendar, MapPin, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const VEHICLE_TYPES = ["Bike", "Mini Truck", "Truck"];
const WORK_DURATIONS = ["1 Month", "3 Months", "6 Months", "1 Year"];

export interface AgrizinDriverStep2Data {
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
  work_duration: string;
  preferred_location: string;
}

interface Props {
  data: AgrizinDriverStep2Data;
  onChange: (data: AgrizinDriverStep2Data) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

const AgrizinDriverStep2 = ({ data, onChange, onSubmit, onBack, loading }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof AgrizinDriverStep2Data, value: string) => {
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
    if (!data.vehicle_usage_type) newErrors.vehicle_usage_type = "Please select vehicle type";
    if (!data.vehicle_number.trim()) newErrors.vehicle_number = "Vehicle number is required";
    if (!data.driving_license_number.trim()) newErrors.driving_license_number = "License number is required";
    if (!data.licenseBack) newErrors.licenseBack = "License back image is required";
    if (!data.work_duration) newErrors.work_duration = "Select work duration";
    if (!data.preferred_location.trim()) newErrors.preferred_location = "Preferred location is required";

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
    <label className="block text-xs font-semibold text-foreground mb-1">{children}</label>
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
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] text-muted-foreground font-medium">
        {label} {required && "*"}
      </span>
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-[100px] h-[68px] md:w-36 md:h-24 rounded-lg object-cover border-2 border-primary/20 shadow-sm" />
          <button
            type="button"
            onClick={() => removeFile(field, previewField)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
          >
            <X className="w-3 h-3" />
          </button>
          <label className="block text-center mt-0.5 cursor-pointer">
            <span className="text-[10px] text-primary font-medium hover:underline">Change</span>
            <input type="file" accept="image/*" onChange={handleFileUpload(field, previewField)} className="hidden" />
          </label>
        </div>
      ) : (
        <label
          className={`w-[100px] h-[68px] md:w-36 md:h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors ${errors[field] ? "border-destructive" : "border-border"}`}
        >
          <Camera className="w-4 h-4 text-muted-foreground mb-0.5" />
          <span className="text-[9px] text-muted-foreground">Upload</span>
          <input type="file" accept="image/*" onChange={handleFileUpload(field, previewField)} className="hidden" />
        </label>
      )}
      {errors[field] && <p className="text-destructive text-[9px]">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 md:p-8 space-y-5">
        <h2 className="font-heading font-bold text-base md:text-lg text-foreground">
          Step 2: Vehicle & Preferences
        </h2>

        {/* Vehicle Details */}
        <div className="space-y-3.5">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5">
            <Car className="w-4 h-4 text-primary" /> Vehicle Details
          </h3>

          {/* Vehicle Type - at the top */}
          <div>
            <FieldLabel>Vehicle Type *</FieldLabel>
            <Select value={data.vehicle_usage_type} onValueChange={(v) => update("vehicle_usage_type", v)}>
              <SelectTrigger className={`h-10 rounded-lg text-xs ${errorClass("vehicle_usage_type")}`}>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <SelectValue placeholder="Select Vehicle Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase().replace(/\s/g, "_")} className="text-xs">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicle_usage_type && <p className="text-destructive text-[10px] mt-0.5">{errors.vehicle_usage_type}</p>}
          </div>

          <div>
            <FieldLabel>Vehicle Number *</FieldLabel>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                placeholder="E.g. MH01AB1234"
                value={data.vehicle_number}
                onChange={(e) => update("vehicle_number", e.target.value.toUpperCase())}
                className={`pl-10 h-10 rounded-lg text-sm ${errorClass("vehicle_number")}`}
              />
            </div>
            {errors.vehicle_number && <p className="text-destructive text-[10px] mt-0.5">{errors.vehicle_number}</p>}
          </div>

          <div>
            <FieldLabel>Driving License Number *</FieldLabel>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                placeholder="E.g. DL1234567890123"
                value={data.driving_license_number}
                onChange={(e) => update("driving_license_number", e.target.value.toUpperCase())}
                className={`pl-10 h-10 rounded-lg text-sm ${errorClass("driving_license_number")}`}
              />
            </div>
            {errors.driving_license_number && <p className="text-destructive text-[10px] mt-0.5">{errors.driving_license_number}</p>}
          </div>

          {/* Driving License Upload */}
          <div>
            <FieldLabel>Upload Driving License *</FieldLabel>
            <div className="flex gap-4 justify-center">
              <DocUpload label="Front Image" preview={data.licenseFrontPreview} field="licenseFront" previewField="licenseFrontPreview" />
              <DocUpload label="Back Image" preview={data.licenseBackPreview} field="licenseBack" previewField="licenseBackPreview" required />
            </div>
          </div>

          {/* Vehicle Photos */}
          <div>
            <FieldLabel>Upload Vehicle Photos</FieldLabel>
            <div className="flex flex-wrap gap-2.5">
              {data.vehicleImagePreviews.map((preview, i) => (
                <div key={i} className="relative">
                  <img src={preview} alt={`Vehicle ${i + 1}`} className="w-24 h-16 rounded-lg object-cover border-2 border-primary/20" />
                  <button
                    type="button"
                    onClick={() => removeVehicleImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <ImagePlus className="w-4 h-4 text-muted-foreground mb-0.5" />
                <span className="text-[9px] text-muted-foreground">Add Photo</span>
                <input type="file" accept="image/*" multiple onChange={handleVehicleImages} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Driver Preferences */}
        <div className="space-y-3.5">
          <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5">
            📍 Driver Preferences
          </h3>

          {/* Work Duration */}
          <div>
            <FieldLabel>📅 Work Duration *</FieldLabel>
            <Select value={data.work_duration} onValueChange={(v) => update("work_duration", v)}>
              <SelectTrigger className={`h-10 rounded-lg text-xs ${errorClass("work_duration")}`}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <SelectValue placeholder="Select Duration" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {WORK_DURATIONS.map((d) => (
                  <SelectItem key={d} value={d.toLowerCase().replace(/\s/g, "_")} className="text-xs">{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.work_duration && <p className="text-destructive text-[10px] mt-0.5">{errors.work_duration}</p>}
          </div>

          {/* Preferred Location */}
          <div>
            <FieldLabel>📍 Preferred Location *</FieldLabel>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                placeholder="E.g. Hyderabad, Warangal, Guntur"
                value={data.preferred_location}
                onChange={(e) => update("preferred_location", e.target.value)}
                className={`pl-10 h-10 rounded-lg text-sm ${errorClass("preferred_location")}`}
              />
            </div>
            {errors.preferred_location && <p className="text-destructive text-[10px] mt-0.5">{errors.preferred_location}</p>}
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
          <button
            onClick={onBack}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Step 1
          </button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto h-11 px-10 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-heading font-bold text-sm hover:opacity-90 shadow-md"
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

export default AgrizinDriverStep2;
