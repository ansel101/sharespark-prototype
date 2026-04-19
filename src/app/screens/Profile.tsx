import { useNavigate } from "react-router";
import {
  User,
  Car,
  Zap,
  Settings,
  LogOut,
  RefreshCw,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Battery,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Switch as ToggleSwitch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

export function Profile() {
  const navigate = useNavigate();
  const { isHostMode, toggleHostMode, kyc } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  const user = {
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    car: "Tesla Model 3",
    batteryCapacity: "75 kWh",
    memberSince: "Jan 2024",
    guestBookings: 24,
    hostEarnings: 12500,
  };

  const handleRoleSwitch = () => {
    if (!isHostMode && kyc.status !== "verified") {
      navigate("/kyc?returnTo=/profile");
      return;
    }
    toggleHostMode();
  };

  const kycBadgeClass =
    kyc.status === "verified"
      ? "bg-green-500 text-black"
      : kyc.status === "pending"
        ? "bg-yellow-500 text-black"
        : kyc.status === "rejected"
          ? "bg-red-600 text-white"
          : "bg-muted text-foreground";

  const kycLabel =
    kyc.status === "not_started"
      ? "KYC Not Started"
      : kyc.status === "pending"
        ? "KYC Pending"
        : kyc.status === "rejected"
          ? "KYC Rejected"
          : "KYC Verified";

  return (
    <div className="min-h-full bg-background pb-20">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-xl border-b border-border px-4 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* User Info */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-border backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-green-400/30 shadow-lg">
              <AvatarFallback className="bg-green-400/20 text-green-700 dark:text-green-300 text-xl font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {user.name}
              </h2>
              <p className="text-muted-foreground text-sm mb-2">{user.email}</p>
              <Badge className="bg-gradient-to-r from-green-400/20 to-blue-400/20 text-green-700 dark:text-green-300 border-green-400/30">
                ⭐ Member since {user.memberSince}
              </Badge>
              <div className="mt-2">
                <Badge className={kycBadgeClass}>{kycLabel}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div className="p-4 bg-gradient-to-br from-green-400/10 to-green-500/5 rounded-xl border border-green-400/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs text-muted-foreground font-medium">
                  Total Bookings
                </p>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {user.guestBookings}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-400/10 to-blue-500/5 rounded-xl border border-blue-400/20">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-muted-foreground font-medium">
                  Host Earnings
                </p>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ₱{user.hostEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {kyc.status !== "verified" && (
          <Card className="p-4 bg-yellow-400/10 border-yellow-400/30">
            <h3 className="font-semibold text-foreground mb-1">
              Verify your identity to unlock host features
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              KYC is required before switching to Host mode and accepting
              bookings.
            </p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
              onClick={() => navigate("/kyc?returnTo=/profile")}
            >
              Start KYC
            </Button>
          </Card>
        )}

        {/* Role Switcher */}
        <Card className="p-5 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 border-border backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <Label className="font-semibold text-foreground text-base">
                    Switch Role
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Change your app mode
                  </p>
                </div>
              </div>
              <Badge
                className={
                  isHostMode
                    ? "bg-green-400 text-black font-semibold shadow-lg shadow-green-400/20"
                    : "bg-blue-400 text-black font-semibold shadow-lg shadow-blue-400/20"
                }
              >
                {isHostMode ? "Host" : "Guest"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-card/50 rounded-xl border border-border">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  {isHostMode ? "Switch to Guest Mode" : "Switch to Host Mode"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isHostMode
                    ? "Browse and book chargers"
                    : "Start earning by sharing your charger"}
                </p>
              </div>
              <ToggleSwitch
                checked={isHostMode}
                onCheckedChange={handleRoleSwitch}
                className="h-6 w-11 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
              />
            </div>
          </div>
        </Card>

        {/* Vehicle Info */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">My Vehicle</h3>
                <p className="text-xs text-muted-foreground">
                  Primary charging vehicle
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-400/10"
            >
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🚗</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{user.car}</p>
                  <p className="text-xs text-muted-foreground">
                    Type 2 / CCS Compatible
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Battery className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Battery Capacity</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {user.batteryCapacity}
              </span>
            </div>
          </div>
        </Card>

        {/* Settings Menu */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Settings & Preferences
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage your account
              </p>
            </div>
          </div>
          <div className="space-y-1">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3 hover:bg-card/80 rounded-lg transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Toggle app theme
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="h-6 w-11 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
              />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-3 hover:bg-card/80 rounded-lg transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Push alerts & updates
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="h-6 w-11 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
              />
            </div>

            {/* Privacy Mode Toggle */}
            <div className="flex items-center justify-between p-3 hover:bg-card/80 rounded-lg transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Privacy Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Hide profile from search
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={privacyMode}
                onCheckedChange={setPrivacyMode}
                className="h-6 w-11 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
              />
            </div>

            {/* Payment Methods */}
            <button
              className="flex items-center justify-between p-3 hover:bg-card/80 rounded-lg transition-colors w-full"
              onClick={() => navigate("/settings/payment")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Payment Methods</p>
                  <p className="text-xs text-gray-400">
                    GCash, Maya, Credit Card
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>

            {/* Help & Support */}
            <button
              className="flex items-center justify-between p-3 hover:bg-card/80 rounded-lg transition-colors w-full"
              onClick={() => navigate("/support")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Help & Support</p>
                  <p className="text-xs text-muted-foreground">
                    FAQs & contact us
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </Card>

        {/* Host Quick Access */}
        {!isHostMode && (
          <Card className="p-4 bg-green-400/10 border-green-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-700 dark:text-green-300">
                Become a Host
              </h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400/90 mb-3">
              Share your charger and earn ₱1,000+ per month
            </p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
              onClick={handleRoleSwitch}
            >
              Start Hosting
            </Button>
          </Card>
        )}

        {/* Logout */}
        <Card className="p-4 bg-red-400/5 border-red-400/20">
          <button
            className="flex items-center justify-between w-full p-3 hover:bg-red-400/10 rounded-lg transition-colors"
            onClick={() => {
              if (confirm("Are you sure you want to log out?")) {
                alert("Logged out");
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-400/20 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-400">Log Out</p>
                <p className="text-xs text-red-400/70">
                  Sign out of your account
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400/50" />
          </button>
        </Card>
      </div>
    </div>
  );
}
