import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Star,
  Zap,
  Clock,
  Shield,
  TrendingUp,
  Navigation as NavigationIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

export function ChargerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const charger = {
    id,
    name: "BGC Central",
    address: "5th Ave corner 26th St, BGC, Taguig",
    host: "Maria Santos",
    rating: 4.8,
    reviews: 127,
    price: 45,
    peakPrice: 65,
    type: "Type 2",
    power: "22 kW",
    available: true,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
    openHours: "24/7",
    features: ["Covered parking", "Security", "WiFi nearby"],
  };

  const currentHour = new Date().getHours();
  const isOffPeak = currentHour >= 22 || currentHour < 5;
  const isDynamicPeak = currentHour >= 18 && currentHour < 21;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-20">
      {/* Header Image - with dark overlay */}
      <div className="relative h-64 bg-muted">
        <img
          src={charger.image}
          alt={charger.name}
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.2]"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-black/20 hover:bg-black/30 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {charger.available && (
          <Badge className="absolute top-4 right-4 bg-green-400 text-black">
            Available Now
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Title & Rating */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{charger.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{charger.address}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-600 dark:fill-yellow-400 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-foreground">
                {charger.rating}
              </span>
              <span className="text-muted-foreground">({charger.reviews})</span>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              onClick={() => navigate(`/reviews/${id}`)}
            >
              View Reviews
            </Button>
          </div>
        </div>

        {/* Dynamic Pricing Alert */}
        {isDynamicPeak && (
          <Card className="p-3 bg-orange-400/10 border-orange-400/20">
            <div className="flex gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-700 dark:text-orange-300">
                  Peak Hour Pricing Active
                </p>
                <p className="text-sm text-orange-600/80 dark:text-orange-400/80">
                  Current rate: ₱{charger.peakPrice}/hr to help reduce grid
                  strain
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Off-Peak Promotion */}
        {isOffPeak && (
          <Card className="p-3 bg-green-400/10 border-green-400/20">
            <div className="flex gap-2">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">
                  Off-Peak Rate Active!
                </p>
                <p className="text-sm text-green-600/80 dark:text-green-400/80">
                  Save money and support the grid: ₱{charger.price}/hr
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Pricing */}
        <Card className="p-4 bg-card border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">
              Standard Rate (Off-Peak)
            </span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₱{charger.price}/hr
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Peak Rate (6 PM - 10 PM)
            </span>
            <span className="font-medium text-foreground">
              ₱{charger.peakPrice}/hr
            </span>
          </div>
        </Card>

        {/* Charger Info */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold mb-3 text-foreground">
            Charger Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium text-foreground">
                {charger.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Power</span>
              <span className="font-medium text-foreground">
                {charger.power}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open Hours</span>
              <span className="font-medium text-foreground">
                {charger.openHours}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Host</span>
              <span className="font-medium text-foreground">
                {charger.host}
              </span>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold mb-3 text-foreground">Features</h3>
          <div className="flex flex-wrap gap-2">
            {charger.features.map((feature) => (
              <Badge
                key={feature}
                className="bg-muted text-foreground border-border"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Trust & Safety */}
        <Card className="p-4 bg-blue-400/10 border-blue-400/20">
          <div className="flex gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300">
                Verified Host
              </p>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                This charger is part of the ShareSpark trusted community
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            size="lg"
            onClick={() => navigate(`/navigate/${id}`)}
          >
            <NavigationIcon className="w-5 h-5 mr-2" />
            Navigate
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-black font-semibold"
            size="lg"
            onClick={() => navigate(`/booking/${id}`)}
            disabled={!charger.available}
          >
            <Zap className="w-5 h-5 mr-2" />
            {charger.available ? "Book" : "Unavailable"}
          </Button>
        </div>
      </div>
    </div>
  );
}
