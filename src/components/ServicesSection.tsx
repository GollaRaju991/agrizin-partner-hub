import ServiceCard from "./ServiceCard";
import rentVehicleImg from "@/assets/rent-vehicle.png";
import farmWorkerImg from "@/assets/farm-worker.png";
import agrizinDriverImg from "@/assets/agrizin-driver.png";

const services = [
  {
    title: "Rent Vehicle",
    description: "Rent tractors, harvesters, and other agricultural vehicles at affordable rates. Available on-demand across your region.",
    image: rentVehicleImg,
    serviceType: "rent_vehicle" as const,
  },
  {
    title: "Farm Worker",
    description: "Hire experienced farm workers for harvesting, cutting, and field work or reaping hook.",
    image: farmWorkerImg,
    badge: "Field Service",
    serviceType: "farm_maker" as const,
  },
  {
    title: "Agrizin Driver",
    description: "Hire experienced agricultural vehicle drivers for your farming operations. Skilled, verified, and reliable.",
    image: agrizinDriverImg,
    serviceType: "agrizin_driver" as const,
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">Our Services</p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
            What We Offer
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three core services designed to support every aspect of your farming journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              image={service.image}
              serviceType={service.serviceType}
              delay={`${0.2 + index * 0.15}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
