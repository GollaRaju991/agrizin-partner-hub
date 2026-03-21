import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  delay: string;
  badge?: string;
  serviceType: "rent_vehicle" | "farm_maker" | "agrizin_driver";
}

const ServiceCard = ({ title, description, image, delay, badge, serviceType }: ServiceCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (serviceType === "farm_maker") {
      if (user) {
        navigate("/register/farm-worker");
      } else {
        navigate("/login?redirect=/register/farm-worker");
      }
    } else {
      if (user) {
        navigate(`/dashboard?service=${serviceType}`);
      } else {
        navigate(`/login?redirect=/dashboard?service=${serviceType}`);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group cursor-pointer flex flex-col"
    >
      <div className="h-52 bg-accent overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-heading font-bold text-xl text-card-foreground">{title}</h3>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4 flex-1">{description}</p>
        <button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:opacity-90 transition-opacity">
          Register Now  →
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
