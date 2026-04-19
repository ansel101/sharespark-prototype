import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  Battery,
  Navigation,
  Search,
  Zap,
  Clock,
  Star,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { InteractiveMap } from "../components/InteractiveMap";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useUser } from "../contexts/UserContext";

// Mock charger data
const chargers = [
  {
    id: 1,
    name: "BGC Central",
    lat: 14.5547,
    lng: 121.0484,
    price: 45,
    rating: 4.8,
    available: true,
    distance: 0.5,
    type: "Type 2",
    power: "22 kW",
    peakPrice: 65,
    powerKw: 22,
  },
  {
    id: 2,
    name: "Makati Square",
    lat: 14.5536,
    lng: 121.0244,
    price: 40,
    rating: 4.6,
    available: true,
    distance: 1.2,
    type: "CCS",
    power: "50 kW",
    peakPrice: 60,
    powerKw: 50,
  },
  {
    id: 3,
    name: "Ayala Hub",
    lat: 14.549,
    lng: 121.0308,
    price: 50,
    rating: 4.9,
    available: false,
    distance: 2.1,
    type: "Type 2",
    power: "11 kW",
    peakPrice: 70,
    powerKw: 11,
  },
  {
    id: 4,
    name: "Forbes Park",
    lat: 14.5412,
    lng: 121.0345,
    price: 55,
    rating: 4.7,
    available: true,
    distance: 2.8,
    type: "CCS",
    power: "100 kW",
    peakPrice: 80,
    powerKw: 100,
  },
];

const recentChargers = [
  { id: 1, name: "BGC Central", lastUsed: "2 days ago" },
  { id: 2, name: "Makati Square", lastUsed: "1 week ago" },
];

export function MapView() {
  const navigate = useNavigate();
  const { activeBooking, setActiveBooking } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [selectedMapChargerId, setSelectedMapChargerId] = useState<
    number | null
  >(null);
  const [sortBy, setSortBy] = useState("distance");
  const [sheetHeight, setSheetHeight] = useState<
    "hidden" | "collapsed" | "full"
  >("collapsed");
  const dragStartY = useRef<number | null>(null);
  const { batteryLevel } = useUser();
  const estimatedRange = 45; // km
  const isCurrentlyCharging = Boolean(activeBooking);
  const currentChargingStation = chargers.find(
    (charger) => charger.name === activeBooking?.name,
  );

  const getEstimatedChargingTime = (powerKw: number) => {
    // Rough estimate: 60kWh battery, charging from current % to 80%
    const batteryCapacity = 60;
    const chargeNeeded = ((80 - batteryLevel) / 100) * batteryCapacity;
    const hours = chargeNeeded / powerKw;
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    return `${hours.toFixed(1)}h`;
  };

  const sortChargers = (chargersList: typeof chargers) => {
    const sorted = [...chargersList];
    switch (sortBy) {
      case "distance":
        return sorted.sort((a, b) => a.distance - b.distance);
      case "price":
        return sorted.sort((a, b) => a.price - b.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "power":
        return sorted.sort((a, b) => b.powerKw - a.powerKw);
      default:
        return sorted;
    }
  };

  const filteredChargers = showEmergencyMode
    ? sortChargers(chargers.filter((c) => c.available))
    : sortChargers(chargers);

  const visibleChargers = selectedMapChargerId
    ? sortChargers(chargers).filter(
        (charger) => charger.id === selectedMapChargerId,
      )
    : filteredChargers;

  const selectedMapCharger = selectedMapChargerId
    ? (chargers.find((charger) => charger.id === selectedMapChargerId) ?? null)
    : null;

  const expandSheet = () => {
    setSheetHeight((prev) => {
      if (prev === "hidden") return "collapsed";
      if (prev === "collapsed") return "full";
      return "full";
    });
  };

  const collapseSheet = () => {
    setSheetHeight((prev) => {
      if (prev === "full") return "collapsed";
      if (prev === "collapsed") return "hidden";
      return "hidden";
    });
  };

  const handleSheetToggle = () => {
    setSheetHeight((prev) => {
      if (prev === "full") return "collapsed";
      if (prev === "collapsed") return "hidden";
      return "full";
    });
  };

  const handleGestureStart = (clientY: number) => {
    dragStartY.current = clientY;
  };

  const handleGestureEnd = (clientY: number) => {
    if (dragStartY.current === null) return;
    const deltaY = clientY - dragStartY.current;
    const threshold = 24;

    if (deltaY < -threshold) {
      expandSheet();
    } else if (deltaY > threshold) {
      collapseSheet();
    }

    dragStartY.current = null;
  };

  return (
    <div className="h-full bg-background flex flex-col motion-fade-in overflow-hidden">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 motion-smooth">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
          <span className="font-semibold text-lg text-foreground">
            ChargeShare
          </span>
        </div>
      </div>

      {/* Battery Status */}
      <div className="bg-card border-b border-border px-4 py-3 backdrop-blur-sm motion-smooth">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Battery
              className={`w-5 h-5 ${batteryLevel < 20 ? "text-red-600 dark:text-red-400" : batteryLevel < 50 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}
            />
            <span className="font-semibold text-foreground">
              Vehicle Battery
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-2xl font-bold ${batteryLevel < 20 ? "text-red-600 dark:text-red-400" : batteryLevel < 50 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}
            >
              {batteryLevel}%
            </span>
            <p className="text-xs text-muted-foreground">
              ~{estimatedRange} km
            </p>
          </div>
        </div>
        <Progress value={batteryLevel} className="h-2 mb-2" />
        {batteryLevel < 20 && (
          <Button
            size="sm"
            variant="destructive"
            className="w-full mt-2"
            onClick={() => setShowEmergencyMode(!showEmergencyMode)}
          >
            <Zap className="w-4 h-4 mr-2" />
            {showEmergencyMode ? "Exit Emergency Mode" : "Emergency Mode"}
          </Button>
        )}
      </div>

      {/* Search Bar with Sort */}
      <div className="bg-card border-b border-border px-4 py-3 motion-smooth">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search BGC, Makati..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs w-36 border-border text-foreground bg-background">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Nearest First</SelectItem>
              <SelectItem value="price">Lowest Price</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="power">Fastest Charging</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="gap-1 text-xs whitespace-nowrap bg-green-400/20 text-green-700 dark:text-green-300 border-green-400/30 flex-1">
            <Clock className="w-3 h-3" />
            Off-Peak (10PM-5AM)
          </Badge>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-background overflow-hidden motion-slide-up">
        <InteractiveMap
          center={[14.5547, 121.0484]}
          zoom={13}
          chargers={chargers.map((c) => ({
            ...c,
            distance: `${c.distance} km`,
          }))}
          onMarkerSelect={(id) => {
            setSelectedMapChargerId(id);
            if (id !== null) {
              setSheetHeight("full");
            }
          }}
          onChargerClick={(id) => navigate(`/charger/${id}`)}
        />
      </div>

      {/* Draggable Bottom Sheet */}
      <div
        className={`bg-card/95 backdrop-blur-xl rounded-t-3xl shadow-2xl transition-all duration-300 border-t border-border motion-smooth ${
          sheetHeight === "full"
            ? "h-[80vh]"
            : sheetHeight === "collapsed"
              ? "h-64"
              : "h-12"
        } overflow-hidden flex flex-col min-h-0`}
      >
        {/* Drag Handle */}
        <div
          className={`px-4 py-3 cursor-grab active:cursor-grabbing active:bg-card/80 touch-none motion-smooth ${sheetHeight === "hidden" ? "border-b-0" : "border-b border-border"}`}
          onClick={handleSheetToggle}
          onTouchStart={(e) => handleGestureStart(e.touches[0].clientY)}
          onTouchEnd={(e) => handleGestureEnd(e.changedTouches[0].clientY)}
          onMouseDown={(e) => handleGestureStart(e.clientY)}
          onMouseUp={(e) => handleGestureEnd(e.clientY)}
        >
          <div
            className={`w-12 h-1 bg-muted rounded-full mx-auto ${sheetHeight === "hidden" ? "mb-0" : "mb-3"}`}
          ></div>
          <div
            className={`items-center justify-between ${sheetHeight === "hidden" ? "hidden" : "flex"}`}
          >
            <h3 className="font-bold text-lg text-foreground">
              {isCurrentlyCharging
                ? "Currently Charging Station"
                : showEmergencyMode
                  ? "🚨 Emergency - Nearest Available"
                  : "Available Chargers"}
            </h3>
            {isCurrentlyCharging ? (
              <Badge className="bg-green-400 text-black">Live</Badge>
            ) : (
              <Badge className="bg-green-400/20 text-green-700 dark:text-green-300">
                {visibleChargers.length}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y">
          {isCurrentlyCharging ? (
            <div className="p-4 space-y-4">
              <div className="p-4 border rounded-xl bg-green-400/10 border-green-400/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-foreground">
                      {currentChargingStation?.name ?? activeBooking.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {currentChargingStation?.type ?? "Type 2"} •{" "}
                      {currentChargingStation?.power ?? "22 kW"}
                    </p>
                  </div>
                  <Badge className="bg-green-400 text-black">Charging</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Session remaining
                    </span>
                    <span className="font-semibold text-foreground">
                      {activeBooking.timeLeft}
                    </span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ₱{currentChargingStation?.price ?? 45}/hour
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => navigate(`/session/${activeBooking?.id ?? 1}`)}
                  className="bg-green-500 hover:bg-green-600 text-black"
                >
                  View Session
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 dark:text-red-400 border-red-600/30 dark:border-red-400/30 hover:bg-red-600/10 dark:hover:bg-red-400/10"
                  onClick={() => setActiveBooking(null)}
                >
                  Stop Charging
                </Button>
              </div>
            </div>
          ) : (
            <>
              {selectedMapCharger && (
                <div className="px-4 py-3 bg-green-400/10 border-b border-green-400/20">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-base text-foreground">
                        {selectedMapCharger.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedMapCharger.type} • {selectedMapCharger.power} •{" "}
                        {selectedMapCharger.distance} km away
                      </p>
                    </div>
                    <Badge
                      className={
                        selectedMapCharger.available
                          ? "bg-green-400 text-black"
                          : "bg-gray-600 text-white"
                      }
                    >
                      {selectedMapCharger.available ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₱{selectedMapCharger.price}
                    </span>
                    <span className="text-sm text-foreground">
                      ★ {selectedMapCharger.rating}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-black"
                      onClick={() =>
                        navigate(`/charger/${selectedMapCharger.id}`)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:bg-muted"
                      onClick={() => setSelectedMapChargerId(null)}
                    >
                      Show All
                    </Button>
                  </div>
                </div>
              )}

              {/* Recent/Favorite Chargers */}
              {!showEmergencyMode &&
                !selectedMapChargerId &&
                recentChargers.length > 0 && (
                  <div className="px-4 py-3 bg-blue-400/10 border-b border-blue-400/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                        Recently Used
                      </h4>
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                      {recentChargers.map((charger) => (
                        <Button
                          key={charger.id}
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 bg-card border-border text-foreground hover:bg-card/80"
                          onClick={() => navigate(`/charger/${charger.id}`)}
                        >
                          <Star className="w-3 h-3 mr-1 fill-yellow-600 dark:fill-yellow-400 text-yellow-600 dark:text-yellow-400" />
                          {charger.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Charger List */}
              {visibleChargers.length > 0 ? (
                <div className="divide-y divide-border">
                  {visibleChargers.map((charger) => (
                    <div
                      key={charger.id}
                      className="px-4 py-4 hover:bg-card/80 cursor-pointer active:bg-card transition-colors"
                      onClick={() => navigate(`/charger/${charger.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-base text-foreground">
                              {charger.name}
                            </h4>
                            <Heart className="w-4 h-4 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:fill-red-600 dark:hover:fill-red-400" />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            <span className="font-medium">
                              {charger.distance} km away
                            </span>
                            <span>•</span>
                            <span className="font-medium">{charger.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ₱{charger.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            per hour
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              charger.available
                                ? "bg-green-400 text-black"
                                : "bg-gray-600 text-white"
                            }
                          >
                            {charger.available ? "🔌 Available" : "⏰ Booked"}
                          </Badge>
                          <Badge className="bg-white/10 text-gray-300 border-white/10 gap-1">
                            <Zap className="w-3 h-3" />
                            {charger.power}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <Star className="w-4 h-4 fill-yellow-600 dark:fill-yellow-400 text-yellow-600 dark:text-yellow-400" />
                            <span className="font-semibold">
                              {charger.rating}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          ~{getEstimatedChargingTime(charger.powerKw)} to 80%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-2">
                    No chargers found
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Try adjusting your search or explore nearby areas
                  </p>
                  <Button
                    variant="outline"
                    className="border-white/10 text-gray-300 hover:bg-white/10"
                    onClick={() => {
                      setSearchQuery("");
                      setShowEmergencyMode(false);
                      setSelectedMapChargerId(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
