import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  Wallet,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useUser } from "../contexts/UserContext";

export function BookingConfirm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setActiveBooking, kyc } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState("14:00");
  const [duration, setDuration] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("gcash");

  const charger = {
    name: "BGC Central",
    price: 45,
    peakPrice: 65,
  };

  const selectedHour = parseInt(timeSlot.split(":")[0]);
  const isPeakTime = selectedHour >= 18 && selectedHour < 22;
  const rate = isPeakTime ? charger.peakPrice : charger.price;
  const total = rate * duration;

  const timeSlots = [
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
    "00:00",
    "02:00",
  ];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-foreground">Book Charger</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Calendar */}
        <Card className="p-4 bg-card border-border">
          <Label className="flex items-center gap-2 mb-3 text-foreground">
            <CalendarIcon className="w-4 h-4" />
            Select Date
          </Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md w-full text-foreground"
            disabled={(date) => date < new Date()}
          />
        </Card>

        {/* Time Slot */}
        <Card className="p-4 bg-card border-border">
          <Label className="flex items-center gap-2 mb-3 text-foreground">
            <Clock className="w-4 h-4" />
            Select Time Slot
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const hour = parseInt(slot.split(":")[0]);
              const isOffPeak = hour >= 22 || hour < 5;
              return (
                <Button
                  key={slot}
                  className={
                    timeSlot === slot
                      ? "bg-green-500 hover:bg-green-600 text-black relative"
                      : "bg-muted border-border text-foreground hover:bg-muted/80 relative"
                  }
                  onClick={() => setTimeSlot(slot)}
                >
                  {slot}
                  {isOffPeak && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
                  )}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Off-peak hours (lower rates)
          </p>
        </Card>

        {/* Duration */}
        <Card className="p-4 bg-card border-border">
          <Label className="mb-3 block text-foreground">Duration (hours)</Label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((hrs) => (
              <Button
                key={hrs}
                className={
                  duration === hrs
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "bg-muted border-border text-foreground hover:bg-muted/80"
                }
                onClick={() => setDuration(hrs)}
              >
                {hrs}h
              </Button>
            ))}
          </div>
        </Card>

        {/* Smart Grid Prompt */}
        {!isPeakTime && selectedHour < 22 && selectedHour >= 5 && (
          <Card className="p-3 bg-green-400/10 border-green-400/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              💡 Consider booking between 10 PM - 5 AM for off-peak rates and to
              support grid stability!
            </p>
          </Card>
        )}

        {/* Payment Method */}
        <Card className="p-4 bg-card border-border">
          <Label className="flex items-center gap-2 mb-3 text-foreground">
            <CreditCard className="w-4 h-4" />
            Payment Method
          </Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg mb-2 hover:bg-muted/60">
              <RadioGroupItem value="gcash" id="gcash" />
              <Label
                htmlFor="gcash"
                className="flex-1 cursor-pointer flex items-center gap-2"
              >
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-foreground">GCash</p>
                  <p className="text-xs text-muted-foreground">
                    Instant payment
                  </p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/60">
              <RadioGroupItem value="maya" id="maya" />
              <Label
                htmlFor="maya"
                className="flex-1 cursor-pointer flex items-center gap-2"
              >
                <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-foreground">Maya</p>
                  <p className="text-xs text-muted-foreground">
                    Instant payment
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Summary */}
        <Card className="p-4 bg-blue-400/10 border-blue-400/20">
          <h3 className="font-semibold mb-3 text-foreground">
            Booking Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Charger</span>
              <span className="font-medium text-foreground">
                {charger.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">
                {date?.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-foreground">{timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">
                {duration} hours
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium text-foreground">
                ₱{rate}/hr {isPeakTime && "(Peak)"}
              </span>
            </div>
            <div className="border-t border-blue-400/30 pt-2 flex justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-green-600 dark:text-green-400 text-lg">
                ₱{total}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 max-w-lg mx-auto">
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
          size="lg"
          onClick={() => {
            if (kyc.status !== "verified") {
              navigate(`/kyc?returnTo=/booking/${id}`);
              return;
            }
            // Activate the charging session
            setActiveBooking({
              id: parseInt(id!),
              name: charger.name,
              timeLeft: "45 min",
            });
            // Navigate to charging session
            navigate(`/session/${id}`);
          }}
        >
          Confirm & Pay ₱{total}
        </Button>
      </div>
    </div>
  );
}
