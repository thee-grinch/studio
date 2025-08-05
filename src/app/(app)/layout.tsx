
"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Baby, CalendarDays, LayoutGrid, MessageSquare, User as UserIcon, Plus, Weight, HeartPulse, StickyNote, Phone } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useModalStore } from "@/lib/store"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { updateUserProfile } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useUserDocument } from "@/hooks/use-user-document"
import { addUserSubcollectionDoc } from "@/lib/firestore"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/pregnancy", label: "Pregnancy", icon: Baby },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/chatbot", label: "Support Chat", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: UserIcon },
]

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
      <footer className="w-full px-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-4 text-sm text-muted-foreground">
           <span>© {currentYear} <a href="/" className="hover:underline">Mamatoto™</a>. All Rights Reserved.</span>
          <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
              <li>
                  <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
              </li>
              <li>
                  <Link href="/terms-of-service" className="hover:underline">Terms</Link>
              </li>
              <li>
                  <Link href="/contact" className="hover:underline">Contact</Link>
              </li>
          </ul>
        </div>
      </footer>
  );
}

const appointmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  type: z.string().min(1, "Please select an appointment type."),
  doctor: z.string().optional(),
  date: z.date({ required_error: "Please select a date."}),
  time: z.string().min(1, "Please select a time."),
}).refine(data => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return data.date >= today;
}, {
    message: "Appointment date cannot be in the past.",
    path: ["date"],
});

const NewAppointmentModal = () => {
  const { modals, closeModal } = useModalStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: "",
      type: "",
      doctor: "",
      time: "10:00"
    },
  });

  const handleSave = async (values: z.infer<typeof appointmentSchema>) => {
    setLoading(true);
    try {
      await addUserSubcollectionDoc('appointments', {
        ...values,
        date: format(values.date, 'yyyy-MM-dd'),
      });
      toast({ title: "Appointment Scheduled!", description: "Your appointment has been added." });
      form.reset();
      closeModal('newAppointment');
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast({ title: "Error", description: "Could not schedule appointment. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      closeModal('newAppointment');
    }
  }

  return (
    <Dialog open={modals.newAppointment} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details for your new appointment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4 py-4">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Glucose Test" className="col-span-3" {...field} />
                            </FormControl>
                            <FormMessage className="col-start-2 col-span-3" />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="checkup">Checkup</SelectItem>
                                    <SelectItem value="scan">Ultrasound Scan</SelectItem>
                                    <SelectItem value="nutrition">Nutrition Visit</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                             </Select>
                             <FormMessage className="col-start-2 col-span-3" />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="doctor"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Doctor</FormLabel>
                            <FormControl>
                                <Input placeholder="Dr. Smith" className="col-span-3" {...field} />
                            </FormControl>
                             <FormMessage className="col-start-2 col-span-3" />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Time</FormLabel>
                            <FormControl>
                                <Input type="time" className="col-span-3" {...field} />
                            </FormControl>
                            <FormMessage className="col-start-2 col-span-3" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-start gap-4">
                           <FormLabel className="pt-2 text-right">Date</FormLabel>
                           <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "col-span-3 w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                           <FormMessage className="col-start-2 col-span-3" />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>{loading ? 'Scheduling...' : 'Schedule'}</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
};

const weightSchema = z.object({
    weight: z.coerce.number().positive("Weight must be a positive number.").min(1, "Weight must be greater than zero."),
    notes: z.string().optional(),
    date: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date format"),
}).refine(data => new Date(data.date) <= new Date(), {
    message: "Date cannot be in the future.",
    path: ["date"],
});

const LogWeightModal = () => {
    const { modals, closeModal } = useModalStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof weightSchema>>({
        resolver: zodResolver(weightSchema),
        defaultValues: {
            weight: "" as any,
            notes: "",
            date: new Date().toISOString().split('T')[0],
        },
    });
    
    const handleSave = async (values: z.infer<typeof weightSchema>) => {
        setLoading(true);
        try {
            await addUserSubcollectionDoc('weights', {
                weight: values.weight,
                notes: values.notes,
                date: values.date,
            });
            toast({ title: "Weight Logged!", description: "Your weight has been saved." });
            form.reset();
            closeModal('logWeight');
        } catch (error) {
            console.error("Error logging weight:", error);
            toast({ title: "Error", description: "Could not save weight log. Please try again.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const onOpenChange = (open: boolean) => {
        if (!open) {
            form.reset({
                weight: '',
                notes: '',
                date: new Date().toISOString().split('T')[0]
            });
            closeModal('logWeight');
        }
    }

    return (
      <Dialog open={modals.logWeight} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Log Your Weight</DialogTitle>
                <DialogDescription>Enter your current weight. Regular logging helps track your progress.</DialogDescription>
            </DialogHeader>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4 py-4">
                     <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight (lbs)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g. 145.5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes (optional)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Feeling great today!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Log'}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    )
};

const symptomSchema = z.object({
  symptoms: z.array(z.string()).optional(),
  moods: z.array(z.string()).optional(),
}).refine(data => (data.symptoms && data.symptoms.length > 0) || (data.moods && data.moods.length > 0), {
    message: "Please select at least one symptom or mood.",
    path: ["symptoms"], // you can assign the error to a specific path if you like
});


const LogSymptomModal = () => {
    const { modals, closeModal } = useModalStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const symptomOptions = ["Nausea", "Fatigue", "Back Pain", "Swelling", "Headache", "Cravings"];
    const moodOptions = ["Happy", "Neutral", "Stressed", "Anxious"];

    const form = useForm<z.infer<typeof symptomSchema>>({
        resolver: zodResolver(symptomSchema),
        defaultValues: {
            symptoms: [],
            moods: [],
        },
    });

    const handleSave = async (values: z.infer<typeof symptomSchema>) => {
        setLoading(true);
        try {
            await addUserSubcollectionDoc('symptoms', {
                symptoms: values.symptoms,
                moods: values.moods,
                date: new Date().toISOString().split('T')[0],
            });
            toast({ title: "Log Saved!", description: "Your symptoms and mood have been recorded." });
            form.reset();
            closeModal('logSymptom');
        } catch (error) {
            console.error("Error logging symptoms:", error);
            toast({ title: "Error", description: "Could not save your log. Please try again.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };
    
    const onOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            closeModal('logSymptom');
        }
    }

    return (
    <Dialog open={modals.logSymptom} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Log Today's Symptoms & Mood</DialogTitle>
                <DialogDescription>Select any symptoms you're experiencing and how you're feeling.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-6 py-4">
                    <FormField
                        control={form.control}
                        name="symptoms"
                        render={() => (
                            <FormItem>
                                <div>
                                    <FormLabel>Symptoms</FormLabel>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {symptomOptions.map(item => (
                                        <FormField
                                            key={item}
                                            control={form.control}
                                            name="symptoms"
                                            render={({ field }) => (
                                                <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...(field.value || []), item])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== item
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{item}</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="moods"
                        render={() => (
                           <FormItem>
                                <div>
                                    <FormLabel>Mood</FormLabel>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                {moodOptions.map(item => (
                                    <FormField
                                    key={item}
                                    control={form.control}
                                    name="moods"
                                    render={({ field }) => {
                                        return (
                                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), item])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item
                                                        )
                                                    )
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                            {item}
                                            </FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormMessage>{form.formState.errors.symptoms?.message}</FormMessage>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Log'}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    )
};

const noteSchema = z.object({
  note: z.string().min(5, "Note must be at least 5 characters long."),
});

const AddNoteModal = () => {
    const { modals, closeModal } = useModalStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            note: "",
        },
    });

    const handleSave = async (values: z.infer<typeof noteSchema>) => {
        setLoading(true);
        try {
            await addUserSubcollectionDoc('notes', { content: values.note });
            toast({ title: "Note Saved!", description: "Your note has been added." });
            form.reset();
            closeModal('addNote');
        } catch (error) {
            console.error("Error saving note:", error);
            toast({ title: "Error", description: "Could not save note. Please try again.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };
    
    const onOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            closeModal('addNote');
        }
    }


    return (
     <Dialog open={modals.addNote} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add Quick Note</DialogTitle>
                <DialogDescription>Jot down anything important you want to remember.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4 py-4">
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Note</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Remember to ask Dr. Smith about the prenatal vitamins." rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Note'}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    )
};

const EmergencyModal = () => {
    const { modals, closeModal } = useModalStore();
    return (
    <Dialog open={modals.emergencyContacts} onOpenChange={() => closeModal('emergencyContacts')}>
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
                <Button variant="outline" onClick={() => closeModal('emergencyContacts')}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
};


const profileSetupSchema = z.object({
  dueDate: z.date({ required_error: "Please select your estimated due date." }),
  weight: z.coerce.number().positive("Weight must be a positive number.").min(50, "Please enter a realistic weight."),
});


const ProfileSetupModal = () => {
  const { modals, closeModal } = useModalStore();
  const { toast } = useToast();
  const { refreshUserDocument } = useUserDocument();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSetupSchema>>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      weight: "" as any,
    },
  });

  const handleSave = async (values: z.infer<typeof profileSetupSchema>) => {
    setLoading(true);
    try {
      await updateUserProfile({
        dueDate: format(values.dueDate, 'yyyy-MM-dd'),
        weight: values.weight,
      });
      toast({
        title: "Profile Updated!",
        description: "Your information has been saved.",
      });
      await refreshUserDocument();
      form.reset();
      closeModal('profileSetup');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const onOpenChange = (open: boolean) => {
    if(!open) {
      form.reset({
        weight: '',
      });
      closeModal('profileSetup');
    }
  }

  return (
    <Dialog open={modals.profileSetup} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            A few more details will help us personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4 py-4">
                 <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                           <FormLabel>Estimated Due Date</FormLabel>
                           <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                           <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                           <FormLabel>Current Weight (lbs)</FormLabel>
                           <FormControl>
                                <Input type="number" placeholder="e.g., 145" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save & Continue'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const LoadingSkeleton = () => (
  <div className="flex min-h-screen w-full bg-background">
      <div className="fixed inset-y-0 left-0 z-20 hidden h-screen flex-col border-r bg-sidebar md:flex w-[16rem] pb-14 p-4 space-y-4">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-auto space-y-2">
           <Skeleton className="h-10 w-full" />
        </div>
      </div>
       <div className="flex flex-1 flex-col md:pl-[16rem]">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
              <div className="flex-1"></div>
              <Skeleton className="h-9 w-9 rounded-full" />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-64 w-full" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Skeleton className="h-48 w-full" />
                 <Skeleton className="h-48 w-full" />
                 <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </main>
      </div>
  </div>
)


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { openModal } = useModalStore();
  const { user, loading } = useAuth();

  const hideFab = pathname === '/appointments';

  if (loading || !user) {
    return <LoadingSkeleton />;
  }

  return (
    <SidebarProvider>
      <NewAppointmentModal />
      <LogWeightModal />
      <LogSymptomModal />
      <AddNoteModal />
      <EmergencyModal />
      <ProfileSetupModal />

      <div className="flex min-h-screen w-full flex-col bg-background">
        <div className="flex flex-1">
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <Separator className="my-2" />
              <ThemeToggle />
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-1 flex-col md:pl-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] ease-in-out duration-300">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
                <div className="md:hidden">
                  <SidebarTrigger />
                </div>
                <div className="flex-1"></div>
                <UserNav user={user} />
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
        
        {!hideFab && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 lg:hidden"
                    size="icon"
                >
                    <Plus className="h-8 w-8" />
                    <span className="sr-only">Quick Log</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" side="top">
                <DropdownMenuLabel>Quick Log</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => openModal('logWeight')}>
                    <Weight className="mr-2 h-4 w-4" />
                    <span>Log Weight</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openModal('logSymptom')}>
                    <HeartPulse className="mr-2 h-4 w-4" />
                    <span>Log Symptom/Mood</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openModal('addNote')}>
                    <StickyNote className="mr-2 h-4 w-4" />
                    <span>Add Note</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/chatbot">
                    <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Quick Chat</span>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </SidebarProvider>
  )
}
