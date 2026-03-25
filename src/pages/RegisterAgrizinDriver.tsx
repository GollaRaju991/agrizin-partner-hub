import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { syncApplicationToExternal } from "@/integrations/external-supabase/sync";
import { toast } from "sonner";
import VehicleStep1, { type VehicleStep1Data } from "@/components/registration/VehicleStep1";
import AgrizinDriverStep2, { type AgrizinDriverStep2Data } from "@/components/registration/AgrizinDriverStep2";
import SuccessDialog from "@/components/registration/SuccessDialog";

const BUCKET = "vehicle-documents";

const uploadFile = async (userId: string, file: File, folder: string): Promise<string | null> => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) {
    console.error("Upload error:", error);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

const RegisterAgrizinDriver = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [step1, setStep1] = useState<VehicleStep1Data>({
    full_name: "",
    mobile: "",
    age: "",
    gender: "",
    aadhaar_pan: "",
    country: "India",
    state: "",
    district: "",
    mandal: "",
    village: "",
    profileImage: null,
    profileImagePreview: "",
    aadhaarFront: null,
    aadhaarFrontPreview: "",
    aadhaarBack: null,
    aadhaarBackPreview: "",
  });

  const [step2, setStep2] = useState<AgrizinDriverStep2Data>({
    vehicle_number: "",
    driving_license_number: "",
    licenseFront: null,
    licenseFrontPreview: "",
    licenseBack: null,
    licenseBackPreview: "",
    rcImage: null,
    rcImagePreview: "",
    vehicleImages: [],
    vehicleImagePreviews: [],
    vehicle_usage_type: "",
    work_duration: "",
    preferred_location: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/register/agrizin-driver");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkExisting = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("service_applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("service_type", "agrizin_driver")
        .limit(1);
      if (data && data.length > 0) setAlreadyRegistered(true);
      setCheckingDuplicate(false);
    };
    if (user) checkExisting();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setStep1((prev) => ({
        ...prev,
        full_name: prev.full_name || profile.first_name || "",
        mobile: prev.mobile || profile.phone || "",
      }));
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      const [profileUrl, aadhaarFrontUrl, aadhaarBackUrl, licenseFrontUrl, licenseBackUrl, rcUrl] =
        await Promise.all([
          step1.profileImage ? uploadFile(user.id, step1.profileImage, "profile") : Promise.resolve(null),
          step1.aadhaarFront ? uploadFile(user.id, step1.aadhaarFront, "aadhaar") : Promise.resolve(null),
          step1.aadhaarBack ? uploadFile(user.id, step1.aadhaarBack, "aadhaar") : Promise.resolve(null),
          step2.licenseFront ? uploadFile(user.id, step2.licenseFront, "license") : Promise.resolve(null),
          step2.licenseBack ? uploadFile(user.id, step2.licenseBack, "license") : Promise.resolve(null),
          step2.rcImage ? uploadFile(user.id, step2.rcImage, "rc") : Promise.resolve(null),
        ]);

      const { data, error } = await supabase.from("service_applications").insert({
        user_id: user.id,
        service_type: "agrizin_driver" as const,
        first_name: step1.full_name.trim(),
        phone: step1.mobile.trim(),
        age: step1.age ? parseInt(step1.age) : null,
        gender: step1.gender || null,
        country: step1.country,
        state: step1.state || null,
        district: step1.district || null,
        mandal: step1.mandal || null,
        village: step1.village.trim() || null,
        profile_photo_url: profileUrl,
        vehicle_type: step2.vehicle_usage_type || null,
        vehicle_make: step2.vehicle_number.trim() || null,
        vehicle_model: step2.driving_license_number.trim() || null,
        registration_number: step2.vehicle_number.trim() || null,
        availability: step2.work_duration || null,
        farm_location: step2.preferred_location.trim() || null,
      }).select().single();

      if (error) {
        console.error(error);
        toast.error("Failed to submit application");
      } else {
        if (data) syncApplicationToExternal(data);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || checkingDuplicate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="font-heading font-bold text-xl text-destructive">Duplicate Submission</h2>
          <div className="w-full h-px bg-destructive/30" />
          <p className="text-muted-foreground text-sm">You have already submitted your Agrizin Driver application.</p>
          <button
            onClick={() => navigate("/")}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <SuccessDialog open={showSuccess} onClose={() => navigate("/")} />
      {/* Green Banner Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 py-5 md:py-8 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 left-3 flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading font-bold text-lg md:text-3xl">Agrizin Driver Registration</h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className={`px-4 py-1 rounded-full text-[11px] font-semibold ${step === 1 ? "bg-primary-foreground text-primary" : "bg-primary-foreground/20 text-primary-foreground"}`}>
              Step 1
            </div>
            <div className="w-8 h-px bg-primary-foreground/40" />
            <div className={`px-4 py-1 rounded-full text-[11px] font-semibold ${step === 2 ? "bg-primary-foreground text-primary" : "bg-primary-foreground/20 text-primary-foreground"}`}>
              Step 2
            </div>
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {step === 1 ? (
          <VehicleStep1
            data={step1}
            onChange={setStep1}
            onNext={() => setStep(2)}
            onBack={() => navigate(-1)}
          />
        ) : (
          <AgrizinDriverStep2
            data={step2}
            onChange={setStep2}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterAgrizinDriver;
