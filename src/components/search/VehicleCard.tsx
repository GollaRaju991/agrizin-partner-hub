import { Phone, MapPin, Truck, User } from "lucide-react";

interface Vehicle {
  id: string;
  full_name: string;
  mobile: string;
  vehicle_number: string;
  vehicle_usage_type: string;
  state: string | null;
  district: string | null;
  mandal: string | null;
  village: string | null;
  profile_photo_url: string | null;
  vehicle_image_urls: string[] | null;
}

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const location = [vehicle.village, vehicle.mandal, vehicle.district]
    .filter(Boolean)
    .join(", ");

  const handleCall = () => {
    window.open(`tel:${vehicle.mobile}`, "_self");
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi ${vehicle.full_name}, I found your vehicle on Agrizin. I'd like to book your ${vehicle.vehicle_usage_type}.`
    );
    window.open(`https://wa.me/91${vehicle.mobile}?text=${msg}`, "_blank");
  };

  const firstImage = vehicle.vehicle_image_urls?.[0];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Vehicle Image */}
      {firstImage && (
        <div className="h-36 w-full bg-accent overflow-hidden">
          <img src={firstImage} alt={vehicle.vehicle_usage_type} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4">
        <div className="flex gap-3">
          {/* Owner Photo */}
          <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
            {vehicle.profile_photo_url ? (
              <img src={vehicle.profile_photo_url} alt={vehicle.full_name} className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-primary flex-shrink-0" />
              <h3 className="font-heading font-bold text-foreground text-base truncate">
                {vehicle.vehicle_usage_type}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Owner: {vehicle.full_name}
            </p>
            {location && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin size={12} /> {location}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              Vehicle No: {vehicle.vehicle_number}
            </p>
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

export default VehicleCard;
