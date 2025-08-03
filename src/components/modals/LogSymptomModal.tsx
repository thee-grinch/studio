"use client";

import { useState } from "react";
import { useModalStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchBackend } from "@/lib/api";

const LogSymptomModal = () => {
  const { modalType, closeModal } = useModalStore();
  const isOpen = modalType === "logSymptom";
  const [symptom, setSymptom] = useState("");
  const [mood, setMood] = useState("");
  const [severity, setSeverity] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming your backend expects a specific date format, e.g., YYYY-MM-DD
      const formattedDate = date; // You might need date formatting here
      await fetchBackend("/symptom-logs", "POST", {
        symptom,
        mood,
        severity,
        date: formattedDate,
        // You might need to include user_id and pregnancy_id here
      });
      toast({
        title: "Symptom Logged!",
        description: "Your symptom has been recorded.",
      });
      // TODO: Refetch symptom data on the pregnancy page
      closeModal();
    } catch (error) {
      console.error("Failed to log symptom:", error);
      toast({
        title: "Error",
        description: "Failed to log symptom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a Symptom</DialogTitle>
          <DialogDescription>
            Record any symptoms or how you're feeling today.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="symptom">Symptom</Label>
            <Textarea
              id="symptom"
              placeholder="Describe your symptom..."
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              required
            />
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="mood">Mood</Label>
                <Select value={mood} onValueChange={setMood} required>
                     <SelectTrigger id="mood">
                        <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Happy">Happy</SelectItem>
                        <SelectItem value="Okay">Okay</SelectItem>
                        <SelectItem value="Tired">Tired</SelectItem>
                        <SelectItem value="Anxious">Anxious</SelectItem>
                        <SelectItem value="Sad">Sad</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="severity">Severity</Label>
                 <Select value={severity} onValueChange={setSeverity} required>
                     <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Mild">Mild</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                </Select>
            </div>
           </div>
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
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Logging..." : "Log Symptom"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogSymptomModal;