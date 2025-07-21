
"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Baby, CalendarDays, LayoutGrid, MessageSquare, User as UserIcon, Plus, Weight, HeartPulse, StickyNote, Phone } from "lucide-react"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useModalStore } from "@/lib/store"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/pregnancy", label: "Pregnancy", icon: Baby },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/chatbot", label: "Support Chat", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: UserIcon },
]

function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 z-20 w-full px-4 bg-background border-t border-border shadow flex items-center justify-between h-14 md:pl-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] ease-in-out duration-300">
            <span className="text-sm text-muted-foreground hidden sm:inline">© 2024 Mamatoto™. All Rights Reserved.
            </span>
             <span className="text-sm text-muted-foreground sm:hidden">© 2024 Mamatoto™.</span>
            <ul className="flex flex-wrap items-center text-sm font-medium text-muted-foreground gap-4 sm:gap-0">
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Privacy</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Terms</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contact</a>
                </li>
            </ul>
        </footer>
    );
}

const NewAppointmentModal = () => {
  const { modals, closeModal } = useModalStore();

  return (
    <Dialog open={modals.newAppointment} onOpenChange={() => closeModal('newAppointment')}>
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
          <Button variant="outline" onClick={() => closeModal('newAppointment')}>Cancel</Button>
          <Button type="submit" onClick={() => closeModal('newAppointment')}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

const LogWeightModal = () => {
    const { modals, closeModal } = useModalStore();
    return (
      <Dialog open={modals.logWeight} onOpenChange={() => closeModal('logWeight')}>
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
                 <Button variant="outline" onClick={() => closeModal('logWeight')}>Cancel</Button>
                <Button type="submit" onClick={() => closeModal('logWeight')}>Save Log</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
};

const LogSymptomModal = () => {
    const { modals, closeModal } = useModalStore();
    return (
    <Dialog open={modals.logSymptom} onOpenChange={() => closeModal('logSymptom')}>
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
                <Button variant="outline" onClick={() => closeModal('logSymptom')}>Cancel</Button>
                <Button type="submit" onClick={() => closeModal('logSymptom')}>Save Log</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
};

const AddNoteModal = () => {
    const { modals, closeModal } = useModalStore();
    return (
     <Dialog open={modals.addNote} onOpenChange={() => closeModal('addNote')}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Add Quick Note</DialogTitle>
                <DialogDescription>Jot down anything important you want to remember.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                    <Label htmlFor="note-content">Note</Label>
                    <Textarea id="note-content" placeholder="Remember to ask Dr. Smith about the prenatal vitamins." rows={5} />
                </div>
            </div>
            <DialogFooter>
                 <Button variant="outline" onClick={() => closeModal('addNote')}>Cancel</Button>
                <Button type="submit" onClick={() => closeModal('addNote')}>Save Note</Button>
            </DialogFooter>
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


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { openModal } = useModalStore();

  const hideFab = pathname === '/appointments';

  return (
    <SidebarProvider>
      <NewAppointmentModal />
      <LogWeightModal />
      <LogSymptomModal />
      <AddNoteModal />
      <EmergencyModal />

      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
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
              <UserNav />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20">
            {children}
          </main>
          
          {!hideFab && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button
                      className="fixed bottom-20 right-6 h-16 w-16 rounded-full shadow-lg z-50"
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

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  )
}
