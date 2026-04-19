import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Zap,
  TrendingUp,
  Calendar,
  Settings,
  DollarSign,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useUser } from "../contexts/UserContext";

export function HostDashboard() {
  const navigate = useNavigate();
  const { kyc } = useUser();
  const [chargerActive, setChargerActive] = useState(true);
  const [dynamicPricing, setDynamicPricing] = useState(true);

  const hostData = {
    totalEarnings: 12500,
    thisMonth: 3200,
    activeBookings: 2,
    completedBookings: 48,
    rating: 4.8,
    reviews: 32,
  };

  const upcomingBookings = [
    {
      id: 1,
      guest: "Maria Santos",
      date: "Mar 8, 2026",
      time: "2:00 PM - 4:00 PM",
      amount: 90,
    },
    {
      id: 2,
      guest: "Jose Reyes",
      date: "Mar 9, 2026",
      time: "10:00 PM - 2:00 AM",
      amount: 180,
    },
  ];

  const earnings = [
    { date: "Mar 7", amount: 180 },
    { date: "Mar 6", amount: 90 },
    { date: "Mar 5", amount: 135 },
    { date: "Mar 4", amount: 270 },
  ];

  if (kyc.status !== "verified") {
    return (
      <div className="min-h-full bg-background pb-20">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-black px-4 py-6">
          <h1 className="text-xl font-semibold">Host Dashboard</h1>
        </div>
        <div className="p-4">
          <Card className="p-5 bg-yellow-400/10 border-yellow-400/30">
            <h2 className="font-semibold text-foreground mb-2">
              Host access requires KYC verification
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Complete identity verification first to manage charger settings
              and earnings.
            </p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-black"
              onClick={() => navigate("/kyc?returnTo=/host-dashboard")}
            >
              Verify Identity
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-black px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">Host Dashboard</h1>

        {/* Earnings Summary */}
        <div className="bg-black/20 backdrop-blur-xl rounded-lg p-4">
          <p className="text-black/80 text-sm mb-1">Total Earnings</p>
          <p className="text-3xl font-bold">
            ₱{hostData.totalEarnings.toLocaleString()}
          </p>
          <div className="flex gap-4 mt-3 text-sm">
            <div>
              <p className="text-black/80">This Month</p>
              <p className="font-semibold">₱{hostData.thisMonth}</p>
            </div>
            <div className="border-l pl-4">
              <p className="text-black/80">Rating</p>
              <p className="font-semibold">⭐ {hostData.rating}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Charger Status */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap
                className={`w-5 h-5 ${chargerActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  Charger Status
                </h3>
                <p className="text-sm text-muted-foreground">
                  BGC Central - Type 2, 22kW
                </p>
              </div>
            </div>
            <Switch
              checked={chargerActive}
              onCheckedChange={setChargerActive}
            />
          </div>
          <Badge
            className={
              chargerActive
                ? "w-full justify-center py-2 bg-green-400 text-black"
                : "w-full justify-center py-2 bg-gray-600 text-white"
            }
          >
            {chargerActive ? "Available for Booking" : "Offline"}
          </Badge>
        </Card>

        {/* Smart Features */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
            <Settings className="w-5 h-5" />
            Smart Features
          </h3>

          <div className="space-y-3">
            {/* Dynamic Pricing */}
            <div className="flex items-center justify-between p-3 bg-orange-400/10 rounded-lg border border-orange-400/20">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <Label className="font-medium text-foreground">
                    Dynamic Pricing
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-adjust rates during peak hours (6-10 PM)
                </p>
              </div>
              <Switch
                checked={dynamicPricing}
                onCheckedChange={setDynamicPricing}
              />
            </div>

            {/* AI Assistant (Placeholder) */}
            <div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <Label className="font-medium text-blue-700 dark:text-blue-300">
                  AI Market Manager
                </Label>
                <Badge className="text-xs bg-blue-400/20 text-blue-700 dark:text-blue-300">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400/80">
                AI learns your usage patterns to suggest optimal rental windows
              </p>
            </div>
          </div>
        </Card>

        {/* Open Hours */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5" />
              Open Hours
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted"
            >
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded">
              <p className="text-muted-foreground">Weekdays</p>
              <p className="font-medium text-foreground">24/7</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-muted-foreground">Weekends</p>
              <p className="font-medium text-foreground">24/7</p>
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            💡 Off-peak hours (10 PM - 5 AM) get 30% more bookings
          </p>
        </Card>

        {/* Tabs for Bookings and Earnings */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted border border-border">
            <TabsTrigger
              value="bookings"
              className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-card"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-card"
            >
              Recent Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-2 mt-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="p-4 bg-card border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">
                      {booking.guest}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date}
                    </p>
                  </div>
                  <Badge className="bg-green-400/20 text-green-700 dark:text-green-300">
                    Confirmed
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{booking.time}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ₱{booking.amount}
                  </span>
                </div>
              </Card>
            ))}
            {upcomingBookings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming bookings</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-2 mt-4">
            {earnings.map((earning, idx) => (
              <Card key={idx} className="p-4 bg-card border-border">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {earning.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Instant payout
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ₱{earning.amount}
                  </span>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/reviews/1")}
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            View Reviews ({hostData.reviews})
          </Button>
          <Button
            variant="outline"
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Charger Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
