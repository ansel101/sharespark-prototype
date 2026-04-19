import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { useUser } from "../contexts/UserContext";

const idTypes = ["National ID", "Driver's License", "Passport"];

export function KycVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { kyc, submitKyc, approveKyc, rejectKyc, resetKyc } = useUser();
  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState("National ID");

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("returnTo") || "/profile";
  }, [location.search]);

  const handleSubmit = () => {
    submitKyc(idType);
  };

  const statusBadge =
    kyc.status === "verified"
      ? "bg-green-500 text-black"
      : kyc.status === "pending"
        ? "bg-yellow-500 text-black"
        : kyc.status === "rejected"
          ? "bg-red-600 text-white"
          : "bg-muted text-foreground";

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-10">
      <div className="bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-semibold text-foreground">KYC Verification</h1>
          <p className="text-xs text-muted-foreground">Prototype demo flow</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Current Status</Label>
            <Badge className={statusBadge}>
              {kyc.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          {kyc.status === "rejected" && kyc.rejectionReason && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Reason: {kyc.rejectionReason}
            </p>
          )}
        </Card>

        {kyc.status !== "pending" && kyc.status !== "verified" && (
          <>
            {step === 1 && (
              <Card className="p-4 bg-card border-border space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Step 1: Choose Government ID
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose a document type for demo KYC.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {idTypes.map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      className={
                        idType === type
                          ? "border-green-500 text-green-600 dark:text-green-400"
                          : "border-border"
                      }
                      onClick={() => setIdType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-black"
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-4 bg-card border-border space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Step 2: ID Upload
                </h2>
                <p className="text-sm text-muted-foreground">
                  For demo, no actual upload is required. You can press Next.
                </p>
                <div className="border border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground">
                  ID front/back upload placeholder
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-black"
                    onClick={() => setStep(3)}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            )}

            {step === 3 && (
              <Card className="p-4 bg-card border-border space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Step 3: Selfie Check
                </h2>
                <p className="text-sm text-muted-foreground">
                  For demo, no selfie capture is required. Press Next.
                </p>
                <div className="border border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground">
                  Selfie capture placeholder
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-black"
                    onClick={() => setStep(4)}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            )}

            {step === 4 && (
              <Card className="p-4 bg-card border-border space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Step 4: Submit KYC
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selected ID: {idType}
                </p>
                <p className="text-xs text-muted-foreground">
                  This is a simulated workflow for prototype presentation.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-black"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}

        {kyc.status === "pending" && (
          <Card className="p-4 bg-yellow-400/10 border-yellow-400/30 space-y-3">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-semibold">KYC Under Review</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              For demo, choose an outcome below.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="bg-green-500 hover:bg-green-600 text-black"
                onClick={approveKyc}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => rejectKyc("Face match confidence too low")}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </Card>
        )}

        {kyc.status === "verified" && (
          <Card className="p-4 bg-green-400/10 border-green-400/30 space-y-3">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="w-5 h-5" />
              <h2 className="font-semibold">KYC Verified</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              You can now continue to booking and host features.
            </p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-black"
              onClick={() => navigate(returnTo)}
            >
              Continue
            </Button>
          </Card>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            resetKyc();
            setStep(1);
            setIdType("National ID");
          }}
        >
          Reset Demo KYC
        </Button>
      </div>
    </div>
  );
}
