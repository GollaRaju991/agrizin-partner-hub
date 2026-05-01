import { useState } from "react";
import { Briefcase, Clock, Banknote, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { WORKER_TYPES } from "@/data/workerTypes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";

const AVAILABILITY_OPTIONS = ["Full-time", "Part-time", "Daily", "Seasonal"];

export interface Step2Data {
  skills: string[];
  experience: string;
  availability: string;
  expected_wage: string;
  wage_type: string;
  category: string;
  group_count: string;
}

interface Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

const FarmWorkerStep2 = ({ data, onChange, onSubmit, onBack, loading }: Props) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillsOpen, setSkillsOpen] = useState(false);

  const EXPERIENCE_OPTIONS = [
    { value: "0-1", label: t("exp01") },
    { value: "1-3", label: t("exp13") },
    { value: "3-5", label: t("exp35") },
    { value: "5+", label: t("exp5") },
  ];
  const availabilityLabel = (opt: string) => {
    const map: Record<string, string> = {
      "Full-time": t("fullTime"),
      "Part-time": t("partTime"),
      Daily: t("daily"),
      Seasonal: t("seasonal"),
    };
    return map[opt] || opt;
  };

  const toggleSkill = (skill: string) => {
    const updated = data.skills.includes(skill)
      ? data.skills.filter((s) => s !== skill)
      : [...data.skills, skill];
    onChange({ ...data, skills: updated });
    if (errors.skills && updated.length > 0) {
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!data.category) newErrors.category = "Please select a category";
    if (data.category === "group" && (!data.group_count || parseInt(data.group_count) < 2)) newErrors.group_count = "Enter valid group size (min 2)";
    if (data.skills.length === 0) newErrors.skills = "Select at least one skill";
    if (!data.experience) newErrors.experience = "Select experience level";
    if (!data.availability) newErrors.availability = "Select availability";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(t("fillRequired"));
      return;
    }
    onSubmit();
  };

  const errorClass = (field: string) =>
    errors[field] ? "border-destructive ring-1 ring-destructive" : "border-border";

  return (
    <div className="space-y-5 pb-24">
      {/* Category */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.category ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Briefcase className="w-4 h-4 text-primary" />
          {t("categoryReq")}
        </div>
        <Select
          value={data.category}
          onValueChange={(v) => {
            onChange({ ...data, category: v, group_count: v === "single" ? "" : data.group_count });
            setErrors((prev) => ({ ...prev, category: "", group_count: "" }));
          }}
        >
          <SelectTrigger className={`h-11 rounded-xl ${errorClass("category")}`}>
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">{t("single")}</SelectItem>
            <SelectItem value="group">{t("group")}</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}

        {data.category === "group" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t("workersCount")}</label>
            <Input
              type="number"
              min={2}
              placeholder={t("enterWorkers")}
              value={data.group_count}
              onChange={(e) => {
                onChange({ ...data, group_count: e.target.value });
                if (errors.group_count) setErrors((prev) => ({ ...prev, group_count: "" }));
              }}
              className={`h-11 rounded-xl ${errorClass("group_count")}`}
            />
            {errors.group_count && <p className="text-destructive text-xs">{errors.group_count}</p>}
          </div>
        )}
      </div>

      {/* Skills & Work */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.skills ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Briefcase className="w-4 h-4 text-primary" />
          {t("skillsWorkType")}
        </div>

        <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`flex items-center justify-between w-full h-11 px-3 rounded-xl border text-sm bg-background ${errorClass("skills")} hover:border-primary/50 transition-colors`}
            >
              <span className={data.skills.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                {data.skills.length > 0 ? `${data.skills.length} ${t("selected")}` : t("selectWorkTypes")}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 max-h-60 overflow-y-auto" align="start">
            {WORKER_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent cursor-pointer text-sm"
              >
                <Checkbox
                  checked={data.skills.includes(type)}
                  onCheckedChange={() => toggleSkill(type)}
                />
                <span className="text-foreground">{type}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>

        {data.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium"
              >
                🌿 {skill}
                <button onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-destructive">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.skills && <p className="text-destructive text-xs">{errors.skills}</p>}
      </div>

      {/* Experience */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Briefcase className="w-4 h-4 text-primary" />
          {t("experienceReq")}
        </div>
        <Select value={data.experience} onValueChange={(v) => {
          onChange({ ...data, experience: v });
          setErrors((prev) => ({ ...prev, experience: "" }));
        }}>
          <SelectTrigger className={`h-11 rounded-xl ${errorClass("experience")}`}>
            <SelectValue placeholder={t("selectExperience")} />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.experience && <p className="text-destructive text-xs mt-1">{errors.experience}</p>}
      </div>

      {/* Availability */}
      <div className={`bg-card rounded-2xl border p-4 shadow-card space-y-3 ${errors.availability ? "border-destructive" : "border-border"}`}>
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Clock className="w-4 h-4 text-primary" />
          {t("availabilityReq")}
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange({ ...data, availability: opt.toLowerCase() });
                setErrors((prev) => ({ ...prev, availability: "" }));
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                data.availability === opt.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary"
                  : `bg-card text-foreground hover:border-primary/50 ${errors.availability ? "border-destructive" : "border-border"}`
              }`}
            >
              {availabilityLabel(opt)}
              {data.availability === opt.toLowerCase() && " ✓"}
            </button>
          ))}
        </div>
        {errors.availability && <p className="text-destructive text-xs mt-1">{errors.availability}</p>}
      </div>

      {/* Expected Wage */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Banknote className="w-4 h-4 text-primary" />
          {t("expectedWageLabel")}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
            <Input
              type="number"
              placeholder="500"
              value={data.expected_wage}
              onChange={(e) => onChange({ ...data, expected_wage: e.target.value })}
              className="pl-8 h-11 rounded-xl border-border focus:border-primary"
            />
          </div>
          <Select value={data.wage_type} onValueChange={(v) => onChange({ ...data, wage_type: v })}>
            <SelectTrigger className="h-11 rounded-xl border-border w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per_day">{t("perDayShort")}</SelectItem>
              <SelectItem value="per_hour">{t("perHourShort")}</SelectItem>
              <SelectItem value="per_month">{t("perMonthShort")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("backToStep1")}
        </button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-11 px-10 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-heading font-bold text-sm hover:opacity-90"
        >
          {loading ? t("submitting") : t("submit")}
        </Button>
      </div>
    </div>
  );
};

export default FarmWorkerStep2;
