"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Calendar as CalendarIcon, MapPin, PlusCircle, ExternalLink, CalendarPlus } from "lucide-react"
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
import { Stethoscope, Baby, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const appointments = [
  { id: 1, type: "Checkup", date: "2024-07-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope, status: "Upcoming", location: "Main Clinic, Room 201" },
  { id: 2, type: "Ultrasound Scan", date: "2024-07-29", time: "02:30 PM", doctor: "Tech. Johnson", icon: Baby, status: "Upcoming", location: "Imaging Center" },
  { id: 3, type: "Nutrition Visit", date: "2024-08-05", time: "11:00 AM", doctor: "Dr. Gable", icon: Utensils, status: "Upcoming", location: "Wellness Hub" },
  { id: 4, type: "Checkup", date: "2024-08-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope, status: "Upcoming", location: "Main Clinic, Room 201" },
  { id: 5, type: "Previous Checkup", date: "2024-06-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope, status: "Completed", location: "Main Clinic, Room 201" },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const isUpcoming = (date: string) => new Date(date) >= new Date();

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
        {appointments.map((appt) => {
          const upcoming = isUpcoming(appt.date);
          return (
          <Card key={appt.id} className={upcoming ? 'border-primary' : 'opacity-70'}>
            <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary rounded-lg p-3">
                            <appt.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{appt.type}</CardTitle>
                            <CardDescription>With {appt.doctor}</CardDescription>
                        </div>
                    </div>
                     <Badge variant={upcoming ? "default" : "secondary"}>{appt.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {appt.time}</span>
                    </div>
                    {appt.location && 
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{appt.location}</span>
                        </div>
                    }
                </div>
            </CardContent>
            {upcoming && (
            <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Add to Calendar
                </Button>
                <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Details
                </Button>
            </CardFooter>
            )}
          </Card>
        )})}
      </div>
    </div>
  )
}
