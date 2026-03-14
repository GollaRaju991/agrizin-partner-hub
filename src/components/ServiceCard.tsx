interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  delay: string;
}

const ServiceCard = ({ title, description, image, delay }: ServiceCardProps) => {
  return (
    <div
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group animate-fade-up opacity-0"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      <div className="h-52 bg-accent flex items-center justify-center overflow-hidden p-6">
        <img
          src={image}
          alt={title}
          className="h-40 w-40 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl text-card-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <button className="mt-4 text-primary font-semibold hover:underline transition-all">
          Learn More →
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
