
"use client"

import {
  Baby,
  Calendar as CalendarIcon,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  ExternalLink,
  MapPin,
  Plus,
  Stethoscope,
  Utensils,
  Lightbulb,
  AlertTriangle,
  FileText,
  Pencil,
  Trash2,
  Phone,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useModalStore } from "@/lib/store"

import { fetchBackend } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
const allAppointments = [
]

const upcomingAppointments = allAppointments
  .filter((a) => a.status === "Upcoming")
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
const completedAppointments = allAppointments
  .filter((a) => a.status === "Completed")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
const missedAppointments = allAppointments
  .filter((a) => a.status === "Missed")
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Upcoming":
      return {
        borderColor: "border-green-500/80",
        badgeVariant: "default",
      }
    case "Completed":
      return {
        borderColor: "border-blue-500/60",
        badgeVariant: "secondary",
      }
    case "Missed":
      return {
        borderColor: "border-red-500/60",
        badgeVariant: "destructive",
      }
    default:
      return {
        borderColor: "",
        badgeVariant: "outline",
      }
  }
}

interface AppointmentDetailsModalProps {
  appt: any; // Use a more specific type if available from backend schema
  children: React.ReactNode;
  onAppointmentDeleted: (id: number) => void;
}

const getAppointmentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "checkup":
    case "glucose test":
    case "dental checkup":
      return Stethoscope;
    case "ultrasound scan":
      return Baby;
    case "nutrition visit":
      return Utensils;
    default: return CalendarCheck;
  }
}
const AppointmentDetailsModal = ({ appt, children, onAppointmentDeleted }: AppointmentDetailsModalProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await fetchBackend(`/appointments/${appt.id}`, "DELETE");
      toast({
        title: "Appointment Deleted",
        description: "The appointment has been successfully removed.",
      });
      onAppointmentDeleted(appt.id);
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast({
        title: "Error",
        description: "Failed to delete appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{appt.type} with {appt.doctor}</DialogTitle>
                <DialogDescription>
                    {new Date(appt.date).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })} at {appt.time}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <a href="#" className="text-primary hover:underline">{appt.location}</a>
                </div>
                 <div className="flex items-center gap-4">
                    <Badge variant={getStatusStyles(appt.status).badgeVariant as any}>{appt.status}</Badge>
                </div>
                 <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-semibold">Preparation Checklist</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li>Arrive 15 minutes early</li>
                        <li>Bring your ID and insurance card</li>
                        <li>Write down any questions you have</li>
                    </ul>
                </div>
                 <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-semibold">Attached Files</h4>
                    <Button variant="link" className="p-0 h-auto gap-2">
                        <FileText className="w-4 h-4" /> Lab_Request_Form.pdf
                    </Button>
                </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2">
                <div>
                  {appt.status === "Upcoming" && <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={handleDelete}><Trash2 className="mr-2" /> Cancel</Button>}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto"><CalendarPlus className="mr-2" /> Add to Calendar</Button>
                    {appt.status === "Upcoming" && <Button size="sm" className="w-full sm:w-auto" onClick={() => openModal('editAppointment', { appointmentId: appt.id })}><Pencil className="mr-2" /> Edit</Button>}

                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);


};

function AppointmentCard({
  appt,
  onAppointmentDeleted,
}: {
  appt: any; // Use a more specific type
  onAppointmentDeleted: (id: number) => void;
}) {
  const { borderColor, badgeVariant } = getStatusStyles(appt.status)

  const isToday = new Date(appt.date).toDateString() === new Date().toDateString()
  const isTomorrow = new Date(appt.date).toDateString() === new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()
  
  let statusText = appt.status
  if (isToday && appt.status === "Upcoming") statusText = "Today"
  if (isTomorrow && appt.status === "Upcoming") statusText = "Tomorrow"

  return (
    <Card className={`transition-all hover:shadow-md ${borderColor}`}>
      <CardHeader className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-muted p-3">
              <appt.icon className="h-6 w-6 text-muted-foreground" />
</div>
            <div>
              <CardTitle className="text-lg">{appt.type}</CardTitle>
              <CardDescription>With {appt.doctor}</CardDescription>
            </div>
          </div>
          <Badge variant={badgeVariant as any} className="self-start sm:self-auto">{statusText}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted-foreground gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {new Date(appt.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at {appt.time}
            </span>
          </div>
          {appt.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{appt.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <CalendarPlus className="mr-2" />
            Add to Calendar
        </Button>
        <AppointmentDetailsModal appt={appt} onAppointmentDeleted={onAppointmentDeleted}>
            <Button variant="default" size="sm" className="w-full sm:w-auto">
                <ExternalLink className="mr-2" />
                View Details
            </Button>
        </AppointmentDetailsModal>
      </CardFooter>
    </Card>
  )
}

export default function AppointmentsPage() {
  const openModal = useModalStore((state) => state.openModal);
  const modalProps = useModalStore((state) => state.modalProps); // Get modal props
  const today = new Date();
  // @ts-ignore
  const todayFormatted = today.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });

  const [appointments, setAppointments] = React.useState<any[]>([]); // Use state for appointments
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: any[] = await fetchBackend("/appointments", "GET");
      // Add icons to appointments based on type
      const appointmentsWithIcons = data.map(appt => ({
        ...appt,
        icon: getAppointmentIcon(appt.type),
      }));
      setAppointments(appointmentsWithIcons);
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch appointments.");
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on the fetched data
  const upcomingAppointments = appointments
    .filter((a) => a.status === "Upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completedAppointments = appointments
    .filter((a) => a.status === "Completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const missedAppointments = appointments
    .filter((a) => a.status === "Missed")
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAppointmentAdded = () => {
    fetchAppointments(); // Refresh after adding
  };

  const handleAppointmentUpdated = () => {
    fetchAppointments(); // Refresh after updating
  };

  const handleAppointmentDeleted = () => {
    fetchAppointments(); // Refresh after deleting
  };

  const todaysAppointments = appointments.filter(
    (a) =>
      a.status === "Upcoming" &&
      new Date(a.date).toDateString() === today.toDateString()
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage your checkups, scans, and other visits.
            </p>
          </div>

          {loading && <div className="text-center text-muted-foreground py-8">Loading appointments...</div>}
          {error && (
            <div className="text-center text-destructive py-8">
              <p>Error: {error}</p>
              <Button onClick={fetchAppointments} variant="outline" className="mt-4">
                Retry Fetching Appointments
              </Button>
            </div>
          )}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="missed">
                Missed ({missedAppointments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4">
              <div className="grid gap-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appt: any) => (
                    <AppointmentCard key={appt.id} appt={appt} />
                  ))
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No upcoming appointments.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="grid gap-4">
                {completedAppointments.length > 0 ? (
                  completedAppointments.map((appt: any) => (
                    <AppointmentCard key={appt.id} appt={appt} />
                  ))
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No completed appointments yet.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="missed" className="mt-4">
              <div className="grid gap-4">
                {missedAppointments.length > 0 ? (
                  missedAppointments.map((appt: any) => (
                    <AppointmentCard key={appt.id} appt={appt} />
                  ))
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    No missed appointments. Great job!
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-6">
          <Card className="bg-primary/10 border-primary/30">
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
               <CardDescription>{todayFormatted}</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysAppointments.length > 0 ? (
                <p>You have {todaysAppointments.length} appointment(s) today.</p>
              ) : (
                <p>No appointments scheduled for today.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Visit Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Don't forget to write down any questions you have for your doctor before you go.</p>
              <p className="text-sm text-muted-foreground">Confirm the location and arrive 15 minutes early to handle any paperwork.</p>
            </CardContent>
          </Card>
          <Card className="border-red-500/20 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openModal('emergencyContacts')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">If you are experiencing a medical emergency, please contact your doctor or local emergency services immediately.</p>
                <Button className="w-full" variant="destructive" tabIndex={-1}>Call Emergency Contact</Button>
              </CardContent>
          </Card>
        </div>
      </aside>

      <Button
          className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg z-50 lg:hidden"
          size="icon"
          onClick={() => openModal('newAppointment')}
      >
          <Plus className="h-8 w-8" />
          <span className="sr-only">New Appointment</span>
      </Button>
       <Button
          className="fixed bottom-24 right-6 h-14 rounded-full shadow-lg z-50 hidden lg:flex"
          onClick={() => openModal('newAppointment')}
      >
          <Plus className="mr-2 h-5 w-5" />
          New Appointment
      </Button>
    </div>
  )
}
