import { Outlet, useNavigate, useLocation } from "react-router";
import { MapPin, Navigation, User, Zap } from "lucide-react";
import { cn } from "./ui/utils";
import { useUser } from "../contexts/UserContext";

export function BottomTabLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isHostMode } = useUser();

  const allTabs = [
    { path: "/", label: "Map", icon: MapPin },
    { path: "/route-planner", label: "Route", icon: Navigation },
    {
      path: "/host-dashboard",
      label: "Host",
      icon: Zap,
      requiresHostMode: true,
    },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const tabs = allTabs.filter((tab) => !tab.requiresHostMode || isHostMode);

  const isActiveTab = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col max-w-lg mx-auto bg-background motion-fade-in">
      {/* Main Content */}
      <div className="flex-1 overflow-auto motion-slide-up">
        <Outlet />
      </div>

      {/* Bottom Tabs - Fixed with frosted glass effect */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card/90 backdrop-blur-xl border-t border-border motion-smooth">
        <div className="flex items-center justify-around px-2 py-1.5 safe-area-inset-bottom">
          {tabs.map(({ path, label, icon: Icon }) => {
            const isActive = isActiveTab(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[64px] motion-smooth",
                  isActive
                    ? "text-green-400 bg-green-400/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-card",
                )}
              >
                <Icon
                  className={cn("w-4.5 h-4.5", isActive && "stroke-[2.5]")}
                />
                <span
                  className={cn(
                    "text-[11px] leading-none",
                    isActive ? "font-semibold" : "font-medium",
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Padding for fixed bottom nav */}
      <div className="h-16" />
    </div>
  );
}
