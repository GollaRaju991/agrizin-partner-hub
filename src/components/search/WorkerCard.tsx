import { Phone, MapPin, Star, Briefcase, User } from "lucide-react";

interface Worker {
  id: string;
  first_name: string;
  phone: string;
  gender: string | null;
  age: number | null;
  state: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  profile_photo_url: string | null;
  skills: string[] | null;
  experience_years: number | null;
  availability: string | null;
  expected_wage: number | null;
  wage_type: string | null;
}

const WorkerCard = ({ worker }: { worker: Worker }) => {
  const location = [worker.village, worker.mandal, worker.district]
    .filter(Boolean)
    .join(", ");

  const handleCall = () => {
    window.open(`tel:${worker.phone}`, "_self");
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi ${worker.first_name}, I found your profile on Agrizin. I'd like to discuss work opportunities.`
    );
    window.open(`https://wa.me/91${worker.phone}?text=${msg}`, "_blank");
  };

  const isAvailable = worker.availability === "Available" || worker.availability === "available";

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
            {worker.profile_photo_url ? (
              <img src={worker.profile_photo_url} alt={worker.first_name} className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-primary" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-bold text-foreground text-base truncate">
                  👨‍🌾 {worker.first_name}
                </h3>
                {location && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin size={12} /> {location}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isAvailable
                    ? "bg-[hsl(var(--status-completed))] text-[hsl(var(--status-completed-foreground))]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isAvailable ? "Available" : worker.availability || "N/A"}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              {worker.experience_years && (
                <span className="flex items-center gap-1">
                  <Briefcase size={12} /> {worker.experience_years} yrs exp
                </span>
              )}
              {worker.expected_wage && (
                <span className="font-semibold text-foreground">
                  ₹{worker.expected_wage}/{worker.wage_type === "per_day" ? "day" : worker.wage_type || "day"}
                </span>
              )}
              {worker.age && <span>Age: {worker.age}</span>}
            </div>

            {/* Skills */}
            {worker.skills && worker.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {worker.skills.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-medium">
                    {s}
                  </span>
                ))}
                {worker.skills.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{worker.skills.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          >
            <Phone size={16} /> Call
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[hsl(142,70%,40%)] text-[hsl(0,0%,100%)] text-sm font-semibold"
          >
            💬 WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
