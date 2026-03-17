import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FarmWorkerStep1, { type Step1Data } from "@/components/registration/FarmWorkerStep1";
import FarmWorkerStep2, { type Step2Data } from "@/components/registration/FarmWorkerStep2";

const RegisterFarmWorker = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [step1, setStep1] = useState<Step1Data>({
    first_name: "",
    phone: "",
    gender: "",
    age: "",
    country: "India",
    state: "",
    district: "",
    mandal: "",
    village: "",
    profileImage: null,
    profileImagePreview: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    skills: [],
    experience: "",
    availability: "",
    expected_wage: "",
    wage_type: "per_day",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/register/farm-worker");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setStep1((prev) => ({
        ...prev,
        first_name: prev.first_name || profile.first_name || "",
        phone: prev.phone || profile.phone || "",
      }));
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    let profilePhotoUrl: string | null = null;

    // Upload photo if provided
    if (step1.profileImage) {
      const ext = step1.profileImage.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(path, step1.profileImage);

      if (uploadError) {
        toast.error("Failed to upload photo");
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(path);
      profilePhotoUrl = urlData.publicUrl;
    }

    const experienceYears = step2.experience === "0-1" ? 0 : step2.experience === "1-3" ? 2 : step2.experience === "3-5" ? 4 : step2.experience === "5+" ? 6 : null;

    const { error } = await supabase.from("service_applications").insert({
      user_id: user.id,
      service_type: "farm_maker" as const,
      first_name: step1.first_name.trim(),
      phone: step1.phone.trim(),
      gender: step1.gender || null,
      age: step1.age ? parseInt(step1.age) : null,
      country: step1.country,
      state: step1.state || null,
      district: step1.district.trim() || null,
      mandal: step1.mandal.trim() || null,
      village: step1.village.trim() || null,
      profile_photo_url: profilePhotoUrl,
      skills: step2.skills,
      experience_years: experienceYears,
      availability: step2.availability || null,
      expected_wage: step2.expected_wage ? parseFloat(step2.expected_wage) : null,
      wage_type: step2.wage_type,
    } as any);

    setSubmitting(false);

    if (error) {
      console.error(error);
      toast.error("Failed to submit application");
    } else {
      toast.success("Registration submitted successfully!");
      navigate("/dashboard");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">A</span>
          </div>
          <span className="font-heading font-bold text-base text-foreground">
            Agrizin<span className="text-primary">Partner</span>
          </span>
        </div>
        <h1 className="font-heading font-bold text-xl text-foreground">Register as Farm Worker</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">Step {step} of 2</span>
          <div className="flex-1 flex gap-1.5">
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-lg mx-auto px-4 py-5">
        {step === 1 ? (
          <FarmWorkerStep1
            data={step1}
            onChange={setStep1}
            onNext={() => setStep(2)}
          />
        ) : (
          <FarmWorkerStep2
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

export default RegisterFarmWorker;
