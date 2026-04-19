import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Wallet, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";

const paymentOptions = [
  {
    id: "gcash",
    name: "GCash",
    description: "Fast peer-to-peer mobile money",
    icon: "💙",
    color: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "maya",
    name: "Maya",
    description: "Digital wallet & remittance",
    icon: "💚",
    color: "bg-green-400/10",
    borderColor: "border-green-400/20",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "qrph",
    name: "QRPH",
    description: "Quick Response Payment Hub",
    icon: "📱",
    color: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    textColor: "text-purple-600 dark:text-purple-400",
  },
];

export function PaymentMethods() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["gcash", "maya"]);

  const togglePaymentMethod = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

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
          <h1 className="font-semibold text-foreground">Payment Methods</h1>
          <p className="text-xs text-muted-foreground">
            Choose how to pay and receive money
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-3 bg-blue-400/10 border-blue-400/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Select at least one payment method for faster transactions
          </p>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-2">
          {paymentOptions.map((method) => (
            <button
              key={method.id}
              onClick={() => togglePaymentMethod(method.id)}
              className={`w-full text-left transition-all ${
                selected.includes(method.id)
                  ? `${method.color} border-2 ${method.borderColor}`
                  : "bg-card border border-border hover:bg-card/80"
              } rounded-lg p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {method.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
                {selected.includes(method.id) && (
                  <div className="flex-shrink-0">
                    <Badge className="bg-green-500 text-black">
                      <Check className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Methods Summary */}
        <Card className="p-4 bg-card border-border">
          <Label className="text-foreground font-semibold mb-2 block">
            Your Selected Methods
          </Label>
          <div className="flex flex-wrap gap-2">
            {selected.length > 0 ? (
              selected.map((id) => {
                const method = paymentOptions.find((m) => m.id === id);
                return (
                  <Badge
                    key={id}
                    className="bg-green-400/20 text-green-700 dark:text-green-300 border-green-400/30"
                  >
                    {method?.name}
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No methods selected
              </p>
            )}
          </div>
        </Card>

        {/* For Guest Bookings */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-2">When Booking</h3>
          <p className="text-sm text-muted-foreground mb-3">
            You'll be asked to select a payment method at checkout. Selected
            methods will be available during booking.
          </p>
          <Button
            variant="outline"
            className="w-full border-border text-muted-foreground hover:bg-muted"
          >
            View Booking Payment
          </Button>
        </Card>

        {/* For Host Payouts */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold text-foreground mb-2">Host Payouts</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Host earnings are automatically paid to your primary method. You can
            change it anytime.
          </p>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Primary Payout</p>
            <p className="font-semibold text-foreground">
              {selected[0]
                ? paymentOptions.find((m) => m.id === selected[0])?.name
                : "Not set"}
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="border-border text-muted-foreground hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-black"
            onClick={() => {
              // Save and return
              navigate(-1);
            }}
            disabled={selected.length === 0}
          >
            Save Methods
          </Button>
        </div>
      </div>
    </div>
  );
}
