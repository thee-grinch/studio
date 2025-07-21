
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Baby, Calendar, Stethoscope, Utensils, Target, TrendingUp, AlertTriangle, CalendarPlus, MessageCircle, HeartPulse, Weight, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const pregnancyInfo = {
  dueDate: "2024-12-25",
  currentWeek: 14,
  weeksRemaining: 26,
  trimester: 2,
}

const upcomingAppointments = [
  { id: 1, type: "Checkup", date: "2024-07-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope },
  { id: 2, type: "Ultrasound Scan", date: "2024-07-29", time: "02:30 PM", doctor: "Tech. Johnson", icon: Baby },
]

const urgentAlerts = [
    { id: 1, title: "High Blood Pressure Reading", description: "Your last reading was higher than normal. Please monitor and contact your doctor if it persists."}
];

const NewAppointmentModal = ({ children }: { children: React.ReactNode }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
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
          <Input
            id="title"
            placeholder="e.g. Glucose Test"
            className="col-span-3"
          />
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
          <Label className="pt-2 text-right">Date</Label>
          <Calendar mode="single" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Create Appointment</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const LogWeightModal = ({ children }: { children: React.ReactNode }) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Log Your Weight</DialogTitle>
                <DialogDescription>Enter your current weight. Regular logging helps track your progress.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input id="weight" type="number" placeholder="e.g. 145.5" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea id="notes" placeholder="Feeling great today!"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
            </div>
            <DialogFooter>
                 <Button variant="outline">Cancel</Button>
                <Button type="submit">Save Log</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

const LogSymptomModal = ({ children }: { children: React.ReactNode }) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Log Today's Symptoms & Mood</DialogTitle>
                <DialogDescription>Select any symptoms you're experiencing and how you're feeling.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div className="space-y-4">
                    <Label>Symptoms</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2"><Checkbox id="nausea" /> <Label htmlFor="nausea">Nausea</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="fatigue" /> <Label htmlFor="fatigue">Fatigue</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="back-pain" /> <Label htmlFor="back-pain">Back Pain</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="swelling" /> <Label htmlFor="swelling">Swelling</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="headache" /> <Label htmlFor="headache">Headache</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="cravings" /> <Label htmlFor="cravings">Cravings</Label></div>
                    </div>
                </div>
                 <div className="space-y-4">
                    <Label>Mood</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2"><Checkbox id="happy" /> <Label htmlFor="happy">Happy</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="neutral" /> <Label htmlFor="neutral">Neutral</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="stressed" /> <Label htmlFor="stressed">Stressed</Label></div>
                        <div className="flex items-center gap-2"><Checkbox id="anxious" /> <Label htmlFor="anxious">Anxious</Label></div>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Save Log</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

const EmergencyModal = ({ children }: { children: React.ReactNode }) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Emergency Contacts</DialogTitle>
                <DialogDescription>In case of emergency, contact your provider or one of the contacts below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                 <Button className="w-full justify-start gap-4" size="lg" variant="destructive">
                    <Phone /> Call 911
                </Button>
                 <Button className="w-full justify-start gap-4" size="lg">
                    <Phone /> Call John Doe (Partner)
                </Button>
                 <Button className="w-full justify-start gap-4" size="lg" variant="secondary">
                    <Phone /> Call Dr. Smith (OB/GYN)
                </Button>
            </div>
             <DialogFooter>
                <DialogTrigger asChild>
                    <Button variant="outline">Close</Button>
                </DialogTrigger>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);


export default function DashboardPage() {
  const progressPercentage = (pregnancyInfo.currentWeek / 40) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Jane!</h1>
        <p className="text-muted-foreground">You're doing great! Here's your personalized update.</p>
      </div>

      {urgentAlerts.length > 0 && (
        <Alert variant="destructive" className="border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{urgentAlerts[0].title}</AlertTitle>
            <AlertDescription>
                {urgentAlerts[0].description}
            </AlertDescription>
        </Alert>
      )}
      
      <Card className="w-full">
        <CardHeader>
            <CardTitle>Your Journey</CardTitle>
            <CardDescription>You're {progressPercentage.toFixed(0)}% of the way there!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Due Date</p>
                <p className="text-4xl font-bold text-primary">{new Date(pregnancyInfo.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% of pregnancy complete`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Current Week</p>
                    <p className="text-2xl font-bold">{pregnancyInfo.currentWeek} <span className="text-lg font-normal">/ 40</span></p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Trimester</p>
                    <p className="text-2xl font-bold">{pregnancyInfo.trimester}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <LogSymptomModal>
                <Button variant="outline" className="flex flex-col h-20 gap-1">
                    <HeartPulse className="w-6 h-6" />
                    <span>Log Symptom</span>
                </Button>
            </LogSymptomModal>
            <LogWeightModal>
                <Button variant="outline" className="flex flex-col h-20 gap-1">
                    <Weight className="w-6 h-6" />
                    <span>Log Weight</span>
                </Button>
            </LogWeightModal>
            <NewAppointmentModal>
                <Button variant="outline" className="flex flex-col h-20 gap-1">
                    <CalendarPlus className="w-6 h-6" />
                    <span>New Appointment</span>
                </Button>
            </NewAppointmentModal>
            <Link href="/chatbot" className="contents">
                <Button variant="outline" className="flex flex-col h-20 gap-1">
                    <MessageCircle className="w-6 h-6" />
                    <span>Open Chat</span>
                </Button>
            </Link>
             <EmergencyModal>
                <Button variant="destructive" className="flex flex-col h-20 gap-1">
                    <Phone className="w-6 h-6" />
                    <span>Emergency</span>
                </Button>
            </EmergencyModal>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your next scheduled visits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {upcomingAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                        <div className="bg-primary rounded-lg p-3 flex-shrink-0">
                            <appt.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold">{appt.type}</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {appt.time}
                            </p>
                            <p className="text-sm text-muted-foreground">With {appt.doctor}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                               <Link href="/appointments"><ExternalLink /></Link>
                            </Button>
                        </div>
                    </div>
                ))}
                 <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href="/appointments">View all appointments</Link>
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Tip of the Week</CardTitle>
            </CardHeader>
            <CardContent>
                <img src="https://placehold.co/600x400.png" data-ai-hint="lemon fruit" alt="Weekly insight" className="rounded-lg mb-4" />
                <h3 className="font-semibold mb-1">Baby is the size of a lemon!</h3>
                <p className="text-sm text-muted-foreground">Your baby is developing taste buds this week. The food you eat can flavor the amniotic fluid!</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
