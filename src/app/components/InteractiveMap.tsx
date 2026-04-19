import { useState } from "react";
import { Map, Marker } from "pigeon-maps";

interface Charger {
  id: number;
  name: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  available: boolean;
  distance: string;
  type: string;
  power: string;
  peakPrice: number;
}

interface InteractiveMapProps {
  chargers: Charger[];
  center: [number, number];
  zoom: number;
  onChargerClick?: (id: number) => void;
  onMarkerSelect?: (id: number | null) => void;
}

function osm(x: number, y: number, z: number) {
  const s = ["a", "b", "c"][Math.floor(Math.random() * 3)];
  return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

export function InteractiveMap({
  chargers,
  center,
  zoom,
  onChargerClick,
  onMarkerSelect,
}: InteractiveMapProps) {
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);

  const handleMarkerClick = (charger: Charger) => {
    setSelectedCharger(charger);
    onMarkerSelect?.(charger.id);
    // Immediately navigate to detail page
    onChargerClick?.(charger.id);
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Map
        provider={osm}
        center={mapCenter}
        zoom={mapZoom}
        onBoundsChanged={({ center, zoom }) => {
          setMapCenter(center);
          setMapZoom(zoom);
        }}
        attribution={
          <span style={{ fontSize: 10 }}>
            ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap
            </a>
          </span>
        }
      >
        {chargers.map((charger) => (
          <Marker key={charger.id} anchor={[charger.lat, charger.lng]}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                transform: "translate(-50%, -100%)",
                touchAction: "none",
                padding: "8px",
                userSelect: "none",
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkerClick(charger);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkerClick(charger);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkerClick(charger);
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(-45deg)",
                  background: charger.available ? "#16a34a" : "#9ca3af",
                  border: "3px solid white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    transform: "rotate(45deg)",
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  ⚡
                </span>
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
