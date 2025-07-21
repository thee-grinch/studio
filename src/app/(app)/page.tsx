import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Baby, Calendar, Stethoscope, Utensils, CalendarCheck, Target, TrendingUp } from "lucide-react"

const pregnancyInfo = {
  dueDate: "2024-12-25",
  currentWeek: 14,
  weeksRemaining: 26,
  trimester: 2,
}

const upcomingAppointments = [
  { id: 1, type: "Checkup", date: "2024-07-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope, status: "Upcoming", location: "Main Clinic, Room 201" },
  { id: 2, type: "Ultrasound Scan", date: "2024-07-29", time: "02:30 PM", doctor: "Tech. Johnson", icon: Baby, status: "Upcoming", location: "Imaging Center" },
  { id: 3, type: "Nutrition Visit", date: "2024-08-05", time: "11:00 AM", doctor: "Dr. Gable", icon: Utensils, status: "Upcoming", location: "Wellness Hub" },
]

export default function DashboardPage() {
  const progressPercentage = (pregnancyInfo.currentWeek / 40) * 100;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Jane!</h1>
        <p className="text-muted-foreground">Here's your personalized update for today. You're doing great!</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="md:col-span-2 xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Due Date</CardTitle>
                <CalendarCheck className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{new Date(pregnancyInfo.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <p className="text-xs text-muted-foreground mt-1">Mark your calendar!</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Current Week</CardTitle>
                <Target className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{pregnancyInfo.currentWeek}</div>
                <p className="text-xs text-muted-foreground">out of 40 weeks</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Trimester</CardTitle>
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{pregnancyInfo.trimester}</div>
                <p className="text-xs text-muted-foreground">{pregnancyInfo.weeksRemaining} weeks to go</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Pregnancy Progress</CardTitle>
            <CardDescription>You're {progressPercentage.toFixed(0)}% of the way there!</CardDescription>
        </CardHeader>
        <CardContent>
            <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% of pregnancy complete`} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upcoming Appointments</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingAppointments.map((appt) => (
            <Card key={appt.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary rounded-lg p-3">
                  <appt.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>{appt.type}</CardTitle>
                  <CardDescription>
                    {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {appt.time}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">With {appt.doctor}</p>
                 {appt.location && <p className="text-sm text-muted-foreground">at {appt.location}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
