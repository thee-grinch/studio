"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/lib/store";
import { fetchBackend } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NewAppointmentModalProps {
  onAppointmentAdded: () => void; // Function to call to refresh data
}

export default function NewAppointmentModal({
  onAppointmentAdded,
}: NewAppointmentModalProps) {
  const { modalType, closeModal } = useModalStore();
  const isOpen = modalType === "newAppointment";
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const appointmentData = {
      type,
      date, // Ensure date is in a format your backend expects (e.g., "YYYY-MM-DD")
      time, // Ensure time is in a format your backend expects (e.g., "HH:MM")
      doctor,
      location,
      status: "Upcoming", // Default status for new appointments
      summary: null, // New appointments don't have summaries initially
      pregnancy_id: null, // You might need to get the active pregnancy ID
    };

    try {
      await fetchBackend("/appointments", "POST", appointmentData);
      toast({
        title: "Appointment Created!",
        description: "Your new appointment has been scheduled.",
      });
      onAppointmentAdded(); // Refresh data on the Appointments page
      closeModal();
      // Clear form fields
      setType("");
      setDate("");
      setTime("");
      setDoctor("");
      setLocation("");
    } catch (err: any) {
      setError(err.message || "Failed to create appointment. Please try again.");
      toast({
        title: "Error",
        description:
          error || "Failed to create appointment. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Input
              id="type"
              placeholder="e.g., Checkup, Ultrasound"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="doctor">Doctor/Provider</Label>
            <Input
              id="doctor"
              placeholder="e.g., Dr. Smith"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Main Clinic"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}