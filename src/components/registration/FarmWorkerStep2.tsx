import { useState } from "react";
import { Briefcase, Clock, Banknote, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "0–1 years" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5+", label: "5+ years" },
];

const AVAILABILITY_OPTIONS = ["Full-time", "Part-time", "Daily", "Seasonal"];

export interface Step2Data {
  skills: string[];
  experience: string;
  availability: string;
  expected_wage: string;
  wage_type: string;
}

interface Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

const FarmWorkerStep2 = ({ data, onChange, onSubmit, onBack, loading }: Props) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (data.skills.includes(trimmed)) { toast.error("Skill already added"); return; }
    onChange({ ...data, skills: [...data.skills, trimmed] });
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = () => {
    if (data.skills.length === 0) { toast.error("Add at least one skill"); return; }
    if (!data.experience) { toast.error("Select experience"); return; }
    if (!data.availability) { toast.error("Select availability"); return; }
    onSubmit();
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Skills & Work */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Briefcase className="w-4 h-4 text-primary" />
          Skills & Work
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add work or skill..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="h-11 rounded-xl border-border focus:border-primary flex-1"
          />
          <Button
            type="button"
            onClick={addSkill}
            className="h-11 w-11 rounded-xl bg-primary text-primary-foreground p-0 shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

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
      </div>

      {/* Experience */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Briefcase className="w-4 h-4 text-primary" />
          Experience
        </div>
        <Select value={data.experience} onValueChange={(v) => onChange({ ...data, experience: v })}>
          <SelectTrigger className="h-11 rounded-xl border-border">
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Clock className="w-4 h-4 text-primary" />
          Availability
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ ...data, availability: opt.toLowerCase() })}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                data.availability === opt.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              }`}
            >
              {opt}
              {data.availability === opt.toLowerCase() && " ✓"}
            </button>
          ))}
        </div>
      </div>

      {/* Expected Wage */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
          <Banknote className="w-4 h-4 text-primary" />
          Expected Wage
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
              <SelectItem value="per_day">/ per day</SelectItem>
              <SelectItem value="per_hour">/ per hour</SelectItem>
              <SelectItem value="per_month">/ per month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sticky Submit */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border space-y-2">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base hover:opacity-90"
        >
          {loading ? "Submitting..." : "Submit"}
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

export default FarmWorkerStep2;
