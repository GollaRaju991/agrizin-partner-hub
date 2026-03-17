import { User, Phone, MapPin, Camera, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Indian states list
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

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
}

const FarmWorkerStep1 = ({ data, onChange, onNext }: Props) => {
  const update = (field: keyof Step1Data, value: string | File | null) =>
    onChange({ ...data, [field]: value });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    const preview = URL.createObjectURL(file);
    onChange({ ...data, profileImage: file, profileImagePreview: preview });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => toast.success("Location detected! Please fill address details."),
      () => toast.error("Could not detect location")
    );
  };

  const handleNext = () => {
    if (!data.first_name.trim()) { toast.error("Name is required"); return; }
    if (!data.phone.trim() || data.phone.length < 10) { toast.error("Valid phone number is required"); return; }
    if (!data.gender) { toast.error("Gender is required"); return; }
    if (!data.age || parseInt(data.age) < 14 || parseInt(data.age) > 100) { toast.error("Valid age is required"); return; }
    onNext();
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Personal Details */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <User className="w-4 h-4 text-primary" />
          Personal Details
        </div>

        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Name"
              value={data.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              className="pl-10 h-11 rounded-xl border-border focus:border-primary"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
            <Input
              placeholder="90000 00000"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="pl-[4.5rem] h-11 rounded-xl border-border focus:border-primary"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Gender</Label>
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
          </div>

          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium text-foreground whitespace-nowrap">Age</Label>
            <Input
              type="number"
              placeholder="25"
              value={data.age}
              onChange={(e) => update("age", e.target.value.replace(/\D/g, "").slice(0, 3))}
              className="h-11 rounded-xl border-border focus:border-primary w-24"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <MapPin className="w-4 h-4 text-primary" />
          Address
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleUseLocation}
          className="w-full h-11 rounded-xl border-border text-muted-foreground gap-2 justify-start"
        >
          <MapPin className="w-4 h-4 text-primary" />
          Use current location
        </Button>

        <div className="flex items-center justify-between border border-border rounded-xl px-3 h-11">
          <span className="text-sm text-foreground">Country</span>
          <span className="text-sm text-muted-foreground">India</span>
        </div>

        <Select value={data.state} onValueChange={(v) => update("state", v)}>
          <SelectTrigger className="h-11 rounded-xl border-border">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-foreground">State</span>
              <SelectValue placeholder="Select state" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="District"
          value={data.district}
          onChange={(e) => update("district", e.target.value)}
          className="h-11 rounded-xl border-border focus:border-primary"
        />

        <Input
          placeholder="Mandal"
          value={data.mandal}
          onChange={(e) => update("mandal", e.target.value)}
          className="h-11 rounded-xl border-border focus:border-primary"
        />

        <Input
          placeholder="Village"
          value={data.village}
          onChange={(e) => update("village", e.target.value)}
          className="h-11 rounded-xl border-border focus:border-primary"
        />
      </div>

      {/* Upload Photo */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Camera className="w-4 h-4 text-primary" />
          Upload Photo
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
            <div className="w-20 h-20 rounded-xl bg-muted border border-border flex items-center justify-center">
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
      </div>

      {/* Sticky Next button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <Button
          onClick={handleNext}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base hover:opacity-90"
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

export default FarmWorkerStep1;
