import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  serviceType: "rent_vehicle" | "farm_maker" | "agrizin_driver";
  onComplete: () => void;
  onCancel: () => void;
}

const serviceLabels: Record<string, string> = {
  rent_vehicle: "Rent Vehicle",
  farm_maker: "Farm Maker",
  agrizin_driver: "Agrizin Driver",
};

const ServiceRegistrationForm = ({ serviceType, onComplete, onCancel }: Props) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: profile?.first_name || "",
    last_name: "",
    phone: profile?.phone || "",
    email: "",
    address: "",
    city: "",
    state: "",
    vehicle_type: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    registration_number: "",
    farm_size: "",
    farm_location: "",
    equipment_owned: "",
    experience_years: "",
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.first_name.trim() || !form.phone.trim()) {
      toast.error("First name and phone are required");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("service_applications").insert({
      user_id: user.id,
      service_type: serviceType,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim() || null,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      vehicle_type: form.vehicle_type.trim() || null,
      vehicle_make: form.vehicle_make.trim() || null,
      vehicle_model: form.vehicle_model.trim() || null,
      vehicle_year: form.vehicle_year.trim() || null,
      registration_number: form.registration_number.trim() || null,
      farm_size: form.farm_size.trim() || null,
      farm_location: form.farm_location.trim() || null,
      equipment_owned: form.equipment_owned.trim() || null,
      experience_years: form.experience_years ? parseInt(form.experience_years) : null,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to submit application");
    } else {
      toast.success("Application submitted successfully!");
      onComplete();
    }
  };

  const showVehicleFields = serviceType === "rent_vehicle" || serviceType === "agrizin_driver";
  const showFarmFields = serviceType === "farm_maker";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-foreground">
          {serviceLabels[serviceType]} Registration
        </h2>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground text-sm">
          ← Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Personal Details */}
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground mb-3 border-b border-border pb-2">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
              <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => update("city", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state} onChange={(e) => update("state", e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        {showVehicleFields && (
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3 border-b border-border pb-2">
              Vehicle Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Type</Label>
                <Input placeholder="e.g. Tractor, Harvester" value={form.vehicle_type} onChange={(e) => update("vehicle_type", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Vehicle Make</Label>
                <Input placeholder="e.g. John Deere, Mahindra" value={form.vehicle_make} onChange={(e) => update("vehicle_make", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Vehicle Model</Label>
                <Input value={form.vehicle_model} onChange={(e) => update("vehicle_model", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Vehicle Year</Label>
                <Input value={form.vehicle_year} onChange={(e) => update("vehicle_year", e.target.value.replace(/\D/g, "").slice(0, 4))} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Registration Number</Label>
                <Input placeholder="e.g. AP-09-AB-1234" value={form.registration_number} onChange={(e) => update("registration_number", e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>
        )}

        {/* Farm Details */}
        {showFarmFields && (
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3 border-b border-border pb-2">
              Farm Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Farm Size (acres)</Label>
                <Input value={form.farm_size} onChange={(e) => update("farm_size", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Farm Location</Label>
                <Input value={form.farm_location} onChange={(e) => update("farm_location", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Equipment Owned</Label>
                <Input placeholder="e.g. Plough, Tiller" value={form.equipment_owned} onChange={(e) => update("equipment_owned", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input type="number" value={form.experience_years} onChange={(e) => update("experience_years", e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSubmit} disabled={loading} className="flex-1 h-12 font-bold text-base">
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
          <Button variant="outline" onClick={onCancel} className="h-12">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRegistrationForm;
