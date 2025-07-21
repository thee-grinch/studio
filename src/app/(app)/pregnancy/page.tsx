
"use client"

import {
  Baby,
  Beaker,
  BookOpen,
  Calendar,
  ClipboardList,
  HeartPulse,
  LineChart as LineChartIcon,
  Target,
  Utensils,
  Weight,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const activePregnancy = {
  dueDate: new Date("2024-12-25"),
  startDate: new Date("2024-03-18"),
  currentWeek: 14,
  trimester: 2,
}

const nextAppointment = {
  id: 1,
  type: "Mid-pregnancy Ultrasound",
  date: "2024-07-29",
  time: "02:30 PM",
  doctor: "Tech. Johnson",
}

const weightData = [
  { date: "Wk 8", weight: 140 },
  { date: "Wk 9", weight: 140.5 },
  { date: "Wk 10", weight: 141 },
  { date: "Wk 11", weight: 142 },
  { date: "Wk 12", weight: 142.5 },
  { date: "Wk 13", weight: 144 },
  { date: "Wk 14", weight: 145 },
]

const symptomData = [
    { id: 1, date: "2024-07-10", symptom: "Morning Sickness", mood: "Tired", severity: "Mild"},
    { id: 2, date: "2024-07-09", symptom: "Fatigue", mood: "Okay", severity: "Moderate"},
    { id: 3, date: "2024-07-08", symptom: "Cravings (pickles)", mood: "Happy", severity: "Mild"},
]


const appointments = [
  {
    id: 1,
    type: "Checkup",
    date: "2024-07-15",
    time: "10:00 AM",
    doctor: "Dr. Smith",
    status: "Upcoming",
  },
  {
    id: 2,
    type: "Ultrasound Scan",
    date: "2024-07-29",
    time: "02:30 PM",
    doctor: "Tech. Johnson",
    status: "Upcoming",
  },
  {
    id: 3,
    type: "Initial Visit",
    date: "2024-04-01",
    time: "09:00 AM",
    doctor: "Dr. Smith",
    status: "Completed",
    summary: "Confirmed pregnancy. Discussed health history and initial advice."
  },
  {
    id: 4,
    type: "Blood Work",
    date: "2024-04-15",
    time: "08:30 AM",
    doctor: "Lab Quest",
    status: "Completed",
    summary: "Standard first trimester blood panel. Results normal."
  },
  {
    id: 5,
    type: "First Trimester Screening",
    date: "2024-05-20",
    time: "11:00 AM",
    doctor: "Dr. Smith",
    status: "Completed",
    summary: "Nuchal translucency scan and blood test. Low risk results."
  }
]

const chartConfig: ChartConfig = {
  weight: {
    label: "Weight (lbs)",
    color: "hsl(var(--chart-1))",
  },
}

function getWeeksToGo(dueDate: Date) {
  const today = new Date()
  const diffTime = dueDate.getTime() - today.getTime()
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
  return diffWeeks
}

export default function PregnancyPage() {
  const weeksToGo = getWeeksToGo(activePregnancy.dueDate)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pregnancy Tracker</h1>
        <p className="text-muted-foreground">
          Manage and track your pregnancy journey and health details.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
          <TabsTrigger value="baby">Baby Updates</TabsTrigger>
          <TabsTrigger value="tips">Health Tips</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="text-center">Your Journey</CardTitle>
                    <CardDescription className="text-center">
                        You’re {activePregnancy.currentWeek} weeks pregnant – entering the {activePregnancy.trimester}nd trimester!
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="text-2xl font-bold">{activePregnancy.dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    </div>
                     <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Time to Go</p>
                        <p className="text-2xl font-bold">{weeksToGo} weeks</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Trimester</p>
                        <p className="text-2xl font-bold">{activePregnancy.trimester}</p>
                    </div>
                </CardContent>
             </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Next Critical Action</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                     <div className="bg-primary rounded-lg p-3 flex-shrink-0">
                        <Beaker className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="font-semibold">Glucose Screening</p>
                        <p className="text-sm text-muted-foreground">Coming up in Week 24-28</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Next Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{nextAppointment.type}</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {nextAppointment.time}
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2">View All</Button>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1 border-amber-500/50">
                <CardHeader>
                    <CardTitle>Health Alert</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">AI analysis suggests your weight gain is slightly above the average for this week. No cause for alarm, but let's keep an eye on it.</p>
                </CardContent>
            </Card>

          </div>
        </TabsContent>

        <TabsContent value="checkins" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Weight Tracker</CardTitle>
                            <CardDescription>AI suggests weight gain is on a healthy track.</CardDescription>
                        </div>
                        <Button>
                            <Weight className="mr-2 h-4 w-4" /> Log Weight
                        </Button>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <LineChart data={weightData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Symptom & Mood Log</CardTitle>
                            <CardDescription>Recent check-ins.</CardDescription>
                        </div>
                         <Button>
                            <HeartPulse className="mr-2 h-4 w-4" /> Log Symptom
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {symptomData.map(log => (
                        <div key={log.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-semibold">{log.symptom}</p>
                                <p className="text-sm text-muted-foreground">{new Date(log.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={log.mood === "Happy" ? "default" : "secondary"}>{log.mood}</Badge>
                                <Badge variant="outline">{log.severity}</Badge>
                            </div>
                        </div>
                      ))}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="baby" className="mt-6">
           <Card>
            <CardHeader>
                <CardTitle>Week 14: Baby Updates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                 <img src="https://placehold.co/400x400.png" data-ai-hint="lemon fruit" alt="Baby size of lemon" className="w-full md:w-1/3 rounded-lg" />
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Your baby is the size of a lemon!</h3>
                    <p className="text-muted-foreground">This week, your little one is starting to grow fine hair called lanugo all over their body. They're also practicing breathing, swallowing, and sucking motions. Their unique fingerprints are now formed on their tiny fingers and toes.</p>
                     <Button variant="link" className="p-0 h-auto">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read more about fetal development
                    </Button>
                </div>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex items-center gap-4">
                         <div className="bg-primary rounded-lg p-3 flex-shrink-0">
                            <Utensils className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <CardTitle>Nutrition</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">AI Assistant: In the second trimester, focus on iron-rich foods like spinach and lean red meat to support increased blood volume.</p>
                        <Button variant="link" className="p-0 h-auto mt-2">Learn more</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex items-center gap-4">
                         <div className="bg-primary rounded-lg p-3 flex-shrink-0">
                            <HeartPulse className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <CardTitle>Exercise</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Gentle exercises like prenatal yoga or swimming are great for maintaining strength and flexibility. Aim for 30 minutes most days.</p>
                          <Button variant="link" className="p-0 h-auto mt-2">Find routines</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex items-center gap-4">
                         <div className="bg-primary rounded-lg p-3 flex-shrink-0">
                            <ClipboardList className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <CardTitle>Emotional Wellness</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">It's normal to feel a mix of emotions. Consider journaling or talking to a friend. Our chatbot is also here to listen.</p>
                          <Button variant="link" className="p-0 h-auto mt-2">Chat now</Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Your Appointments</CardTitle>
                     <Button>
                        <Calendar className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                            <div>
                                <p className="font-semibold">{appt.type}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {appt.time} with {appt.doctor}
                                </p>
                                {appt.status === "Completed" && <p className="text-xs text-muted-foreground mt-1">Summary: {appt.summary}</p>}
                            </div>
                            <Badge variant={appt.status === "Upcoming" ? "default" : "secondary"}>{appt.status}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

}
