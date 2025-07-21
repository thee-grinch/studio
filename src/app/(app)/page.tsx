import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Baby, Calendar, Stethoscope, Utensils } from "lucide-react"

const pregnancyInfo = {
  dueDate: "2024-12-25",
  currentWeek: 14,
  weeksRemaining: 26,
  trimester: 2,
}

const upcomingAppointments = [
  { id: 1, type: "Checkup", date: "2024-07-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope },
  { id: 2, type: "Ultrasound Scan", date: "2024-07-29", time: "02:30 PM", doctor: "Tech. Johnson", icon: Baby },
  { id: 3, type: "Nutrition Visit", date: "2024-08-05", time: "11:00 AM", doctor: "Dr. Gable", icon: Utensils },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Jane!</h1>
        <p className="text-muted-foreground">Here's a summary of your pregnancy journey.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Current Week</CardDescription>
            <CardTitle className="text-5xl">{pregnancyInfo.currentWeek}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Trimester</CardDescription>
            <CardTitle className="text-5xl">{pregnancyInfo.trimester}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Weeks Remaining</CardDescription>
            <CardTitle className="text-5xl">{pregnancyInfo.weeksRemaining}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Due Date</CardDescription>
            <CardTitle className="text-4xl">{new Date(pregnancyInfo.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
          </CardHeader>
        </Card>
      </div>

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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
