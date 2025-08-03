"use client";

import { useState } from "react";
import { useModalStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchBackend } from "@/lib/api";

export const LogWeightModal = ({ refreshWeightData }) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals.logWeight;
  const { toast } = useToast();

  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const weightData = {
        weight: parseFloat(weight), // Assuming weight is a number
        date: date,
        // You might need to include user_id and pregnancy_id here,
        // depending on how your backend is structured.
        // These could be obtained from user context or active pregnancy data.
      };

      await fetchBackend("/weight-logs", "POST", weightData);

      toast({
        title: "Weight Logged!",
        description: "Your weight has been successfully recorded.",
      });
      closeModal("logWeight");
      setWeight("");
      setDate("");
      if (refreshWeightData) {
        refreshWeightData();
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to log weight. Please try again."
      );
      toast({
        title: "Error",
        description:
          err.message || "Failed to log weight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal("logWeight")}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Your Weight</DialogTitle>
          <DialogDescription>
            Enter your current weight and the date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                className="col-span-3"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Weight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { useState } from "react";
import { useModalStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { fetchBackend } from "@/lib/api";

export const LogWeightModal = ({ refreshWeightData }) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals.logWeight;
  const { toast } = useToast();

  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const weightData = {
        weight: parseFloat(weight), // Assuming weight is a number
        date: date,
        // You might need to include user_id and pregnancy_id here,
        // depending on how your backend is structured.
        // These could be obtained from user context or active pregnancy data.
      };

      await fetchBackend("/weight-logs", "POST", weightData);

      toast({
        title: "Weight Logged!",
        description: "Your weight has been successfully recorded.",
      });
      closeModal("logWeight");
      setWeight("");
      setDate("");
      if (refreshWeightData) {
        refreshWeightData();
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to log weight. Please try again."
      );
      toast({
        title: "Error",
        description:
          err.message || "Failed to log weight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal("logWeight")}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Your Weight</DialogTitle>
          <DialogDescription>
            Enter your current weight and the date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                className="col-span-3"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Weight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};