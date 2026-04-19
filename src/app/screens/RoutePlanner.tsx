import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Navigation,
  MapPin,
  Battery,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { useUser } from "../contexts/UserContext";

interface RouteDestination {
  id: number;
  name: string;
  distance: number;
  time: string;
  elevation: number;
  chargers: number;
  requiredBattery: number;
}

export function RoutePlanner() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { batteryLevel } = useUser();
  const currentBattery = batteryLevel;

  const destinations: RouteDestination[] = [
    {
      id: 1,
      name: "Baguio City",
      distance: 250,
      time: "5h 30m",
      elevation: 1500,
      chargers: 4,
      requiredBattery: 85,
    },
    {
      id: 2,
      name: "Tagaytay",
      distance: 65,
      time: "1h 45m",
      elevation: 700,
      chargers: 2,
      requiredBattery: 55,
    },
    {
      id: 3,
      name: "Subic Bay",
      distance: 120,
      time: "2h 30m",
      elevation: 200,
      chargers: 3,
      requiredBattery: 68,
    },
  ];

  const isReachable = (required: number) => currentBattery >= required;

  const getBatteryDrain = (dest: RouteDestination) => {
    const baseDrain = Math.round(dest.distance * 0.24); // ~0.24% per km
    const elevationDrain = Math.round((dest.elevation / 100) * 1.2); // elevation impact
    const totalDrain = baseDrain + elevationDrain;
    const arrivalEstimate = currentBattery - totalDrain;
    return { baseDrain, elevationDrain, totalDrain, arrivalEstimate };
  };

  return (
    <div className="min-h-full bg-background pb-8">
      {/* Header */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Green-Nav</h1>
        <p className="text-muted-foreground text-sm">
          Route planning with charger stops & elevation analysis
        </p>
      </div>

      <div className="px-4 space-y-4">
        {/* Current Battery Display */}
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-foreground">
              <Battery className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-medium">Current Battery</span>
            </div>
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {currentBattery}%
            </span>
          </div>
          <div className="relative">
            <Progress value={currentBattery} className="h-3 bg-muted" />
          </div>
        </Card>

        {/* Destination Input */}
        <Card className="p-4 bg-card border-border">
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400" />
            <Input
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-12 bg-input border-border text-foreground placeholder:text-muted-foreground h-12"
            />
          </div>
        </Card>

        {/* Route Destinations */}
        <div className="space-y-6">
          {destinations.map((dest) => {
            const reachable = isReachable(dest.requiredBattery);

            return (
              <Collapsible
                key={dest.id}
                open={expandedCard === dest.id}
                onOpenChange={(open) => setExpandedCard(open ? dest.id : null)}
              >
                <Card className="bg-card border-border overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <div className="p-4 cursor-pointer hover:bg-card/80 transition-all w-full text-left">
                      {/* Location Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-lg font-semibold">
                            {dest.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              reachable
                                ? "bg-green-400 text-black hover:bg-green-500"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }
                          >
                            {reachable ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Reachable
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Charge Needed
                              </>
                            )}
                          </Badge>
                          {!reachable && (
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                              Need {dest.requiredBattery}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Route Metrics */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            Distance
                          </p>
                          <p className="text-foreground font-bold">
                            {dest.distance}km
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            Time
                          </p>
                          <p className="text-foreground font-bold">
                            {dest.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            Elevation
                          </p>
                          <p className="text-foreground font-bold">
                            +{dest.elevation}m
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            Chargers
                          </p>
                          <p className="text-green-600 dark:text-green-400 font-bold text-xl">
                            {dest.chargers}
                          </p>
                        </div>
                      </div>

                      {/* Battery Requirement Bar */}
                      <div className="relative h-10 bg-muted rounded-lg overflow-hidden border border-border">
                        <div
                          className={`h-full flex items-center justify-center text-sm font-bold transition-all ${
                            reachable
                              ? "bg-green-500 text-black"
                              : "bg-yellow-500 text-white"
                          }`}
                          style={{
                            width: `${currentBattery}%`,
                          }}
                        >
                          {currentBattery}%
                        </div>
                        {!reachable && (
                          <div
                            className="absolute top-0 h-full border-l-2 border-dashed border-red-500"
                            style={{
                              left: `${dest.requiredBattery}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  {/* Expanded Details */}
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-[collapsible-down_260ms_cubic-bezier(0.2,0,0,1)] data-[state=closed]:animate-[collapsible-up_220ms_cubic-bezier(0.2,0,0,1)]">
                    <div className="p-4 border-t border-border">
                      <div className="mb-4">
                        <h4 className="text-muted-foreground text-sm mb-3">
                          LiDAR Battery Drain Prediction
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 dark:text-blue-400">
                                📉
                              </span>
                              <span className="text-foreground">
                                Base drain (flat road)
                              </span>
                            </div>
                            <span className="text-foreground font-semibold">
                              -{getBatteryDrain(dest).baseDrain}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-600 dark:text-yellow-400">
                                ⛰️
                              </span>
                              <span className="text-foreground">
                                Elevation impact
                              </span>
                            </div>
                            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                              -{getBatteryDrain(dest).elevationDrain}%
                            </span>
                          </div>
                          <div className="border-t border-border pt-2 mt-2"></div>
                          <div className="flex items-center justify-between">
                            <span className="text-foreground font-medium">
                              Total drain
                            </span>
                            <span className="text-red-600 dark:text-red-400 font-bold text-lg">
                              -{getBatteryDrain(dest).totalDrain}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-foreground font-medium">
                              Arrival estimate
                            </span>
                            <span
                              className={`font-bold text-lg ${
                                getBatteryDrain(dest).arrivalEstimate > 20
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {getBatteryDrain(dest).arrivalEstimate}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {!reachable ? (
                        <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-red-700 dark:text-red-300 font-semibold mb-1">
                                Insufficient Battery
                              </h5>
                              <p className="text-red-600 dark:text-red-400/80 text-sm">
                                You have {currentBattery}% charge but need{" "}
                                {dest.requiredBattery}% for this route. Charge
                                at least {dest.requiredBattery - currentBattery}
                                % more before departing.
                              </p>
                            </div>
                          </div>
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/");
                            }}
                          >
                            <Battery className="w-4 h-4 mr-2" />
                            Find Nearby Charger
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Start Navigation
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}
