"use client";

import { useState, useEffect, type FormEvent } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EditAppointmentModalProps {
  appointmentId: number | null;
  onAppointmentUpdated: () => void; // Function to call to refresh data
}

export default function EditAppointmentModal({
  appointmentId,
  onAppointmentUpdated,
}: EditAppointmentModalProps) {
  const { modalType, closeModal } = useModalStore();
  const isOpen = modalType === "editAppointment";
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Upcoming");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true); // State to indicate if data is being fetched
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointment = async () => {
      if (isOpen && appointmentId !== null) {
        setFetching(true);
        setError(null);
        try {
          const data = await fetchBackend(`/appointments/${appointmentId}`, "GET");
          setType(data.type);
          setDate(data.date); // Ensure date is in a format that works with the input type="date"
          setTime(data.time); // Ensure time is in a format that works with the input type="time"
          setDoctor(data.doctor);
          setLocation(data.location || "");
          setSummary(data.summary || "");
        } catch (err: any) {
          setError(err.message || "Failed to fetch appointment details.");
          toast({
            title: "Error",
            description: "Failed to load appointment details.",
            variant: "destructive",
          });
          console.error("Failed to fetch appointment:", err);
        } finally {
          setFetching(false);
        }
      } else if (!isOpen) {
        // Reset form when modal closes
        setType("");
        setDate("");
        setTime("");
        setDoctor("");
        setStatus("Upcoming");
        setSummary("");
        setError(null);
        setFetching(true); // Reset fetching state
      }
    };

    fetchAppointment();
  }, [isOpen, appointmentId, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (appointmentId === null) return;

    setLoading(true);
    setError(null);

    const updatedAppointmentData = {
      type,
      date,
      time,
      doctor,
      location,
      status,
      // pregnancy_id is likely not updated here
    };

    try {
      await fetchBackend(`/appointments/${appointmentId}`, "PUT", updatedAppointmentData);
      toast({
        title: "Appointment Updated!",
        description: "Your appointment details have been saved.",
      });
      onAppointmentUpdated(); // Refresh data on the Appointments page
      closeModal();
    } catch (err: any) {
      setError(err.message || "Failed to update appointment. Please try again.");
      toast({
        title: "Error",
        description: error || "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        {fetching ? (
          <div className="py-8 text-center text-muted-foreground">Loading appointment details...</div>
        ) : error && !type ? ( // Display error only if fetching failed and no data loaded
            <div className="py-8 text-center text-destructive">{error}</div>
        ) : (
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
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "Completed" && (
              <div className="grid gap-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Add a summary for the completed appointment"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            )}

            {error && !fetching && <p className="text-sm text-destructive">{error}</p>} {/* Display submission error */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}