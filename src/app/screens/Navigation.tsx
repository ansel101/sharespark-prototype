import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Navigation as NavigationIcon,
  Phone,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import "leaflet/dist/leaflet.css";

const chargers = [
  {
    id: 1,
    name: "BGC Central",
    lat: 14.5547,
    lng: 121.0484,
    address: "5th Ave corner 26th St, BGC, Taguig",
    distance: 2.4,
  },
  {
    id: 2,
    name: "Makati Square",
    lat: 14.5536,
    lng: 121.0244,
    address: "Makati, Metro Manila",
    distance: 3.1,
  },
  {
    id: 3,
    name: "Ayala Hub",
    lat: 14.549,
    lng: 121.0308,
    address: "Ayala Ave, Makati",
    distance: 4.8,
  },
  {
    id: 4,
    name: "Forbes Park",
    lat: 14.5412,
    lng: 121.0345,
    address: "Forbes Park, Makati",
    distance: 5.2,
  },
];

const userLocation: [number, number] = [14.5595, 121.0245]; // BGC area

// Custom icon for user location marker
const userIcon = L.divIcon({
  html: `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    ">
      📍
    </div>
  `,
  iconSize: [32, 32],
  className: "custom-icon",
});

// Custom icon for charger marker
const chargerIcon = L.divIcon({
  html: `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background: #16a34a;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="transform: rotate(45deg); color: white; font-size: 18px; font-weight: bold;">
        ⚡
      </span>
    </div>
  `,
  iconSize: [40, 40],
  className: "custom-icon",
});

// Fetch route from OSRM API
async function fetchRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
) {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`,
    );
    const data = await response.json();
    if (data.routes && data.routes[0]) {
      return data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      );
    }
    return null;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}

export function Navigation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isNavigating, setIsNavigating] = useState(true);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const chargerId = parseInt(id || "1");
  const charger = chargers.find((c) => c.id === chargerId);

  // Fetch route on mount
  useEffect(() => {
    if (charger) {
      fetchRoute(
        userLocation[0],
        userLocation[1],
        charger.lat,
        charger.lng,
      ).then((routeCoords) => {
        setRoute(routeCoords);
        setLoadingRoute(false);
      });
    }
  }, [charger]);

  // Calculate simple distance and ETA
  const stats = useMemo(() => {
    if (!charger) return { distance: 0, eta: 0 };
    const lat1 = (userLocation[0] * Math.PI) / 180;
    const lat2 = (charger.lat * Math.PI) / 180;
    const dLat = ((charger.lat - userLocation[0]) * Math.PI) / 180;
    const dLng = ((charger.lng - userLocation[1]) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // km

    // Rough ETA: avg 30 km/h in city = 2 min per km
    const minutes = Math.round(distance * 2);

    return {
      distance: distance.toFixed(1),
      eta: minutes,
    };
  }, [charger]);

  if (!charger) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-4 bg-card border-border">
          <p className="text-foreground">Charger not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Navigation Map */}
      <div className="flex-1 relative">
        {loadingRoute && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading route...</p>
            </div>
          </div>
        )}
        <MapContainer
          center={[
            (userLocation[0] + charger.lat) / 2,
            (userLocation[1] + charger.lng) / 2,
          ]}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Route Polyline */}
          {route && route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "#3b82f6",
                weight: 4,
                opacity: 0.8,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          )}

          {/* User Location Marker */}
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={[charger.lat, charger.lng]} icon={chargerIcon}>
            <Popup>{charger.name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Navigation Info Panel */}
      <div className="bg-card/95 backdrop-blur-xl border-t border-border p-4 space-y-3">
        {/* ETA and Distance */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 bg-muted border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Distance</p>
            <p className="text-lg font-bold text-foreground">
              {stats.distance} km
            </p>
          </Card>
          <Card className="p-3 bg-muted border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">ETA</p>
            <p className="text-lg font-bold text-foreground">{stats.eta} min</p>
          </Card>
          <Card className="p-3 bg-muted border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Speed</p>
            <p className="text-lg font-bold text-foreground">30 km/h</p>
          </Card>
        </div>

        {/* Charger Info */}
        <Card className="p-3 bg-green-400/10 border-green-400/20">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">
                {charger.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {charger.address}
              </p>
            </div>
          </div>
        </Card>

        {/* Turn-by-turn (simplified) */}
        <Card className="p-3 bg-muted border-border">
          <p className="text-xs text-muted-foreground mb-1">Next Direction</p>
          <p className="text-sm font-semibold text-foreground">
            Continue straight on current route
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="border-border text-muted-foreground hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Exit
          </Button>
          <Button
            className={`${
              isNavigating
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
            onClick={() => setIsNavigating(!isNavigating)}
          >
            <NavigationIcon className="w-4 h-4 mr-1" />
            {isNavigating ? "Stop" : "Start"}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => alert("Calling charger host...")}
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
        </div>

        {/* Status */}
        {isNavigating && (
          <Badge className="w-full justify-center bg-green-500 text-black py-2">
            <NavigationIcon className="w-3 h-3 mr-1" />
            Navigating to {charger.name}
          </Badge>
        )}
      </div>
    </div>
  );
}
