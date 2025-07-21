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
import { Baby, Calendar, Stethoscope, Utensils, Target, TrendingUp, AlertTriangle, CalendarPlus, MessageCircle, HeartPulse, Weight } from "lucide-react"

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

// Mock data for new sections
const urgentAlerts = [
    { id: 1, title: "High Blood Pressure Reading", description: "Your last reading was higher than normal. Please monitor and contact your doctor if it persists."}
];

const healthSummary = {
    weightTrend: "+2 lbs this week",
    missedAppointments: 0,
};

const weeklyInsight = {
    title: "Baby is the size of a lemon!",
    content: "Your baby is developing taste buds this week. The food you eat can flavor the amniotic fluid!"
}


export default function DashboardPage() {
  const progressPercentage = (pregnancyInfo.currentWeek / 40) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Jane!</h1>
        <p className="text-muted-foreground">You're doing great! Here's your personalized update.</p>
      </div>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <Alert variant="destructive" className="border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{urgentAlerts[0].title}</AlertTitle>
            <AlertDescription>
                {urgentAlerts[0].description}
            </AlertDescription>
        </Alert>
      )}
      
      {/* Core Pregnancy Progress */}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-20 gap-1">
                <HeartPulse className="w-6 h-6" />
                <span>Log Symptom</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-1">
                <Weight className="w-6 h-6" />
                <span>Log Weight</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-1">
                <CalendarPlus className="w-6 h-6" />
                <span>New Appointment</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-1">
                <MessageCircle className="w-6 h-6" />
                <span>Open Chat</span>
            </Button>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Appointments */}
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
                         <Button variant="ghost" size="sm">View</Button>
                    </div>
                ))}
                 <Button variant="link" className="p-0 h-auto">View all appointments</Button>
            </CardContent>
        </Card>

        {/* Weekly Insights */}
        <Card>
            <CardHeader>
                <CardTitle>Tip of the Week</CardTitle>
            </CardHeader>
            <CardContent>
                <img src="https://placehold.co/600x400.png" data-ai-hint="lemon fruit" alt="Weekly insight" className="rounded-lg mb-4" />
                <h3 className="font-semibold mb-1">{weeklyInsight.title}</h3>
                <p className="text-sm text-muted-foreground">{weeklyInsight.content}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
