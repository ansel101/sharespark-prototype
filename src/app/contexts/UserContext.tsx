import { createContext, useContext, useState, ReactNode } from "react";

interface ActiveBooking {
  id: number;
  name: string;
  timeLeft: string;
}

export type KycStatus = "not_started" | "pending" | "verified" | "rejected";

interface KycState {
  status: KycStatus;
  idType: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

interface UserContextType {
  isHostMode: boolean;
  setIsHostMode: (value: boolean) => void;
  toggleHostMode: () => void;
  activeBooking: ActiveBooking | null;
  setActiveBooking: (booking: ActiveBooking | null) => void;
  batteryLevel: number;
  setBatteryLevel: (level: number) => void;
  kyc: KycState;
  submitKyc: (idType: string) => void;
  approveKyc: () => void;
  rejectKyc: (reason?: string) => void;
  resetKyc: () => void;
}

const defaultKycState: KycState = {
  status: "not_started",
  idType: "",
};

const defaultUserContext: UserContextType = {
  isHostMode: false,
  setIsHostMode: () => {},
  toggleHostMode: () => {},
  activeBooking: null,
  setActiveBooking: () => {},
  batteryLevel: 62,
  setBatteryLevel: () => {},
  kyc: defaultKycState,
  submitKyc: () => {},
  approveKyc: () => {},
  rejectKyc: () => {},
  resetKyc: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isHostMode, setIsHostMode] = useState(false);
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(
    null,
  );
  const [batteryLevel, setBatteryLevel] = useState(62);
  const [kyc, setKyc] = useState<KycState>(defaultKycState);

  const toggleHostMode = () => {
    setIsHostMode((prev) => !prev);
  };

  const submitKyc = (idType: string) => {
    setKyc({
      status: "pending",
      idType,
      submittedAt: new Date().toISOString(),
      verifiedAt: undefined,
      rejectionReason: undefined,
    });
  };

  const approveKyc = () => {
    setKyc((prev) => ({
      ...prev,
      status: "verified",
      verifiedAt: new Date().toISOString(),
      rejectionReason: undefined,
    }));
  };

  const rejectKyc = (reason = "Image quality was too low") => {
    setKyc((prev) => ({
      ...prev,
      status: "rejected",
      rejectionReason: reason,
      verifiedAt: undefined,
    }));
  };

  const resetKyc = () => {
    setKyc(defaultKycState);
  };

  return (
    <UserContext.Provider
      value={{
        isHostMode,
        setIsHostMode,
        toggleHostMode,
        activeBooking,
        setActiveBooking,
        batteryLevel,
        setBatteryLevel,
        kyc,
        submitKyc,
        approveKyc,
        rejectKyc,
        resetKyc,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
