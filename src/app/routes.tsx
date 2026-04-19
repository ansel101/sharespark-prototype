import { createBrowserRouter } from "react-router";
import { MapView } from "./screens/MapView";
import { ChargerDetail } from "./screens/ChargerDetail";
import { BookingConfirm } from "./screens/BookingConfirm";
import { Profile } from "./screens/Profile";
import { HostDashboard } from "./screens/HostDashboard";
import { RoutePlanner } from "./screens/RoutePlanner";
import { Reviews } from "./screens/Reviews";
import { ChargingSession } from "./screens/ChargingSession";
import { BottomTabLayout } from "./components/BottomTabLayout";
import { KycVerification } from "./screens/KycVerification";
import { PaymentMethods } from "./screens/PaymentMethods";
import { Navigation } from "./screens/Navigation";

export const router = createBrowserRouter([
  {
    // Main app with bottom tabs
    path: "/",
    Component: BottomTabLayout,
    children: [
      {
        index: true,
        Component: MapView,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "host-dashboard",
        Component: HostDashboard,
      },
      {
        path: "route-planner",
        Component: RoutePlanner,
      },
    ],
  },
  // Detail screens without bottom tabs
  {
    path: "/charger/:id",
    Component: ChargerDetail,
  },
  {
    path: "/booking/:id",
    Component: BookingConfirm,
  },
  {
    path: "/session/:id",
    Component: ChargingSession,
  },
  {
    path: "/reviews/:chargerId",
    Component: Reviews,
  },
  {
    path: "/kyc",
    Component: KycVerification,
  },
  {
    path: "/settings/payment",
    Component: PaymentMethods,
  },
  {
    path: "/navigate/:id",
    Component: Navigation,
  },
]);
