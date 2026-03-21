import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  delay: string;
  serviceType: "rent_vehicle" | "farm_maker" | "agrizin_driver";
}

const ServiceCard = ({ title, description, image, delay, serviceType }: ServiceCardProps) => {
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
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group animate-fade-up opacity-0 cursor-pointer"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      <div className="h-52 bg-accent overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl text-card-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <span className="mt-4 inline-block text-primary font-semibold hover:underline transition-all">
          Register Now →
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
