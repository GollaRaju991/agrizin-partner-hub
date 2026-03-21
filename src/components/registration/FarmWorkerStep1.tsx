import { User, Phone, MapPin, Camera, ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getStates, getDistricts, getMandals } from "@/data/indianLocations";
import { useState } from "react";

export interface Step1Data {
  first_name: string;
  phone: string;
  gender: string;
  age: string;
  country: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  profileImage: File | null;
  profileImagePreview: string;
}

interface Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onNext: () => void;
  onBack: () => void;
}

const FarmWorkerStep1 = ({ data, onChange, onNext, onBack }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof Step1Data, value: string | File | null) => {
    onChange({ ...data, [field]: value });
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleStateChange = (state: string) => {
    onChange({ ...data, state, district: "", mandal: "" });
    setErrors((prev) => ({ ...prev, state: "", district: "", mandal: "" }));
  };

  const handleDistrictChange = (district: string) => {
    onChange({ ...data, district, mandal: "" });
    setErrors((prev) => ({ ...prev, district: "", mandal: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    const preview = URL.createObjectURL(file);
    onChange({ ...data, profileImage: file, profileImagePreview: preview });
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const removeProfileImage = () => {
    onChange({ ...data, profileImage: null, profileImagePreview: "" });
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.first_name.trim()) newErrors.first_name = "Name is required";
    if (!data.phone.trim() || data.phone.length < 10) newErrors.phone = "Valid 10-digit phone number is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.age || parseInt(data.age) < 14 || parseInt(data.age) > 100) newErrors.age = "Valid age (14-100) is required";
    if (!data.state) newErrors.state = "State is required";
    if (!data.district) newErrors.district = "District is required";
    if (!data.profileImage && !data.profileImagePreview) newErrors.profileImage = "Profile photo is required";

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

  return (
    <div className="space-y-5 pb-24">
      {/* Personal Details */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-4">
        {/* Title row with profile image inline */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base pt-1">
            <User className="w-4 h-4 text-primary" />
            Personal Details
          </div>
          {/* Profile Image - circular, top right */}
          <div className="flex flex-col items-center shrink-0">
            {data.profileImagePreview ? (
              <div className="relative">
                <img
                  src={data.profileImagePreview}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 shadow-md"
                />
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
                <label className="block text-center mt-0.5 cursor-pointer">
                  <span className="text-[9px] text-primary font-medium hover:underline">Change</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label
                className={`w-16 h-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all ${errors.profileImage ? "border-destructive bg-destructive/5" : "border-primary/30"}`}
              >
                <Camera className="w-4 h-4 text-muted-foreground mb-0.5" />
                <span className="text-[8px] text-muted-foreground font-medium">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
            {errors.profileImage && <p className="text-destructive text-[9px] mt-0.5">{errors.profileImage}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Name *"
                value={data.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                className={`pl-10 h-11 rounded-xl focus:border-primary ${errorClass("first_name")}`}
              />
            </div>
            {errors.first_name && <p className="text-destructive text-xs mt-1">{errors.first_name}</p>}
          </div>

          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
              <Input
                placeholder="90000 00000"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={`pl-[4.5rem] h-11 rounded-xl focus:border-primary ${errorClass("phone")}`}
              />
            </div>
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Gender *</Label>
            <RadioGroup
              value={data.gender}
              onValueChange={(v) => update("gender", v)}
              className="flex gap-6"
            >
              {["Male", "Female", "Other"].map((g) => (
                <div key={g} className="flex items-center gap-1.5">
                  <RadioGroupItem value={g.toLowerCase()} id={`gender-${g}`} />
                  <Label htmlFor={`gender-${g}`} className="text-sm text-foreground cursor-pointer">{g}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender}</p>}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-foreground whitespace-nowrap">Age *</Label>
              <Input
                type="number"
                placeholder="25"
                value={data.age}
                onChange={(e) => update("age", e.target.value.replace(/\D/g, "").slice(0, 3))}
                className={`h-11 rounded-xl focus:border-primary w-24 ${errorClass("age")}`}
              />
            </div>
            {errors.age && <p className="text-destructive text-xs mt-1">{errors.age}</p>}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <MapPin className="w-4 h-4 text-primary" />
          Address
        </div>

        <div className="flex items-center justify-between border border-border rounded-xl px-3 h-11">
          <span className="text-sm text-foreground">Country</span>
          <span className="text-sm text-muted-foreground">India</span>
        </div>

        <div>
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
        </div>

        <div>
          <Select
            value={data.district}
            onValueChange={handleDistrictChange}
            disabled={!data.state}
          >
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
        </div>

        <div>
          <Select
            value={data.mandal}
            onValueChange={(v) => update("mandal", v)}
            disabled={!data.district}
          >
            <SelectTrigger className="h-11 rounded-xl border-border">
              <SelectValue placeholder="Select mandal" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {mandals.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          placeholder="Village"
          value={data.village}
          onChange={(e) => update("village", e.target.value)}
          className="h-11 rounded-xl border-border focus:border-primary"
        />
      </div>

      {/* Upload Photo */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.profileImage ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Camera className="w-4 h-4 text-primary" />
          Upload Photo *
        </div>
        <p className="text-xs text-muted-foreground">Upload profile image. Max file size: 10 MB</p>

        <div className="flex items-center gap-4">
          {data.profileImagePreview ? (
            <img
              src={data.profileImagePreview}
              alt="Preview"
              className="w-20 h-20 rounded-xl object-cover border border-border"
            />
          ) : (
            <div className={`w-20 h-20 rounded-xl bg-muted border flex items-center justify-center ${errors.profileImage ? "border-destructive" : "border-border"}`}>
              <Camera className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              + Upload Photo
            </span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        {errors.profileImage && <p className="text-destructive text-xs">{errors.profileImage}</p>}
      </div>

      {/* Next button */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <Button
          onClick={handleNext}
          className="h-11 px-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-heading font-bold text-sm hover:opacity-90"
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

export default FarmWorkerStep1;
