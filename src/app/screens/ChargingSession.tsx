import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Zap,
  Battery,
  Clock3,
  MapPin,
  Wallet,
  Gauge,
  CircleStop,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { useUser } from "../contexts/UserContext";

export function ChargingSession() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { activeBooking, setActiveBooking, batteryLevel } = useUser();

  const session = {
    id,
    stationName: activeBooking?.name ?? "BGC Central",
    connector: "CCS",
    power: "50 kW",
    location: "30th St, BGC, Taguig",
    startTime: "2:15 PM",
    remaining: "45 min",
    batteryStart: 35,
    batteryNow: batteryLevel,
    targetBattery: 80,
    energyDelivered: 14.2,
    ratePerHour: 45,
    estimatedTotal: 68,
  };

  const handleStopSession = () => {
    setActiveBooking(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-24">
      <div className="bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-foreground">Charging Session</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4 border-green-400/30 bg-green-400/10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-bold text-lg text-foreground">
                {session.stationName}
              </p>
              <p className="text-sm text-muted-foreground">
                {session.connector} • {session.power}
              </p>
            </div>
            <Badge className="bg-green-400 text-black">Charging</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{session.location}</span>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-foreground">
                Battery Progress
              </span>
            </div>
            <span className="font-bold text-xl text-green-600 dark:text-green-400">
              {session.batteryNow}%
            </span>
          </div>
          <Progress value={session.batteryNow} className="h-3 mb-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Started at {session.batteryStart}%</span>
            <span>Target {session.targetBattery}%</span>
          </div>
        </Card>

        <Card className="p-4 bg-card border-border">
          <h2 className="font-semibold mb-3 text-foreground">
            Session Details
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock3 className="w-4 h-4" />
                <span>Started</span>
              </div>
              <p className="font-semibold text-foreground">
                {session.startTime}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Zap className="w-4 h-4" />
                <span>Remaining</span>
              </div>
              <p className="font-semibold text-foreground">
                {session.remaining}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Gauge className="w-4 h-4" />
                <span>Energy</span>
              </div>
              <p className="font-semibold text-foreground">
                {session.energyDelivered} kWh
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Wallet className="w-4 h-4" />
                <span>Est. Total</span>
              </div>
              <p className="font-semibold text-green-600 dark:text-green-400">
                ₱{session.estimatedTotal}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Rate: ₱{session.ratePerHour}/hour
          </p>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 bg-card/95 backdrop-blur-xl border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Back to Map
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleStopSession}
          >
            <CircleStop className="w-4 h-4 mr-2" />
            Stop Session
          </Button>
        </div>
      </div>
    </div>
  );
}
