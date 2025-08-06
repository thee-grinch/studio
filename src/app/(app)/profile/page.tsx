
"use client"

import { useState, useEffect } from "react"
import { Activity, Bell, Palette, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { updateUserProfile } from "@/lib/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useModalStore } from "@/lib/store"

const personalDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters.").regex(/^[a-zA-Z\s]*$/, "Full name can only contain letters and spaces."),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export default function ProfilePage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  const form = useForm<z.infer<typeof personalDetailsSchema>>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.displayName || "",
        email: user.email || "",
        // These would ideally come from the user's firestore document
        phone: user.phoneNumber || "",
        location: "", // Assuming location is not on the auth object
      })
    }
  }, [user, form])

  const handleSave = async (values: z.infer<typeof personalDetailsSchema>) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive"})
        return;
    }
    setLoading(true);

    try {
        await updateUserProfile({
            displayName: values.fullName,
        })
        
        toast({
            title: "Changes Saved!",
            description: `Your personal details have been updated.`,
        })
    } catch (error) {
        console.error(`Error updating personal details:`, error)
        toast({
            title: "Error",
            description: `Failed to update personal details.`,
            variant: "destructive"
        })
    } finally {
        setLoading(false);
    }
  }
  
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-2">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and personal information.
            </p>
          </div>
          <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)}>
                    <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>
                        Update your information here. This information is kept private and secure.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" disabled {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="San Francisco, CA" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Personal Details"}</Button>
                    </CardFooter>
                </form>
            </Form>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>This contact will be used in case of an emergency.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Click the button below to view and manage your emergency contacts.
                </p>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => openModal('emergencyContacts')}>Manage Emergency Contacts</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Side Panel */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Account & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Appointments Booked</p>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Symptoms Logged</p>
                <Badge variant="secondary">48</Badge>
              </div>
               <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Chat Sessions</p>
                <Badge variant="secondary">31</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-auto sm:w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle">Theme</Label>
                 <ThemeToggle />
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="appt-reminders" className="pr-4">Appointment Reminders</Label>
                <Switch id="appt-reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-updates" className="pr-4">Weekly Updates</Label>
                <Switch id="weekly-updates" defaultChecked/>
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="tip-notifications" className="pr-4">Health Tips</Label>
                <Switch id="tip-notifications" />
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  )
}
