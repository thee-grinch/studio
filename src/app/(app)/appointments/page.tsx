"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, Baby, Utensils, PlusCircle } from "lucide-react"

const appointments = [
  { id: 1, type: "Checkup", date: "2024-07-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope },
  { id: 2, type: "Ultrasound Scan", date: "2024-07-29", time: "02:30 PM", doctor: "Tech. Johnson", icon: Baby },
  { id: 3, type: "Nutrition Visit", date: "2024-08-05", time: "11:00 AM", doctor: "Dr. Gable", icon: Utensils },
  { id: 4, type: "Checkup", date: "2024-08-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope },
].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">Manage your checkups, scans, and other visits.</p>
        </div>
         <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new appointment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" placeholder="e.g. Glucose Test" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                   <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkup">Checkup</SelectItem>
                      <SelectItem value="scan">Ultrasound Scan</SelectItem>
                      <SelectItem value="nutrition">Nutrition Visit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                   <Label className="text-right pt-2">
                    Date
                  </Label>
                  <Calendar mode="single" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </div>

      <div className="grid gap-4">
        {appointments.map((appt) => (
          <Card key={appt.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-primary rounded-lg p-3">
                  <appt.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{appt.type}</p>
                  <p className="text-sm text-muted-foreground">With {appt.doctor}</p>
                </div>
              </div>
               <div>
                  <p className="font-semibold text-right">{new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                  <p className="text-sm text-muted-foreground text-right">{appt.time}</p>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
