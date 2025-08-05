
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


export default function ProfilePage() {
  const { toast } = useToast()
  const { user } = useAuth()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "")
      setEmail(user.email || "")
      // These would ideally come from the user's firestore document
      setPhone(user.phoneNumber || "")
      setLocation("") // Assuming location is not on the auth object
    }
  }, [user])

  const handleSave = async (section: string) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive"})
        return;
    }

    try {
        if (section === 'Personal') {
            await updateUserProfile({
                displayName: fullName,
                // email, phone, location can be added here to update firestore
            })
            console.log("Personal details updated successfully in Firebase Auth and Firestore.");
        }
        // Similar logic for 'Emergency Contact' can be added here
        
        toast({
            title: "Changes Saved!",
            description: `Your ${section} details have been updated.`,
        })
    } catch (error) {
        console.error(`Error updating ${section}:`, error)
        toast({
            title: "Error",
            description: `Failed to update ${section} details.`,
            variant: "destructive"
        })
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
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Update your information here. This information is kept private and secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA"/>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => handleSave('Personal')}>Save Personal Details</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>This contact will be used in case of an emergency.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="emergency-name">Contact Name</Label>
                  <Input id="emergency-name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency-phone">Contact Phone</Label>
                  <Input id="emergency-phone" type="tel" defaultValue="+1 (555) 987-6543" />
                </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => handleSave('Emergency Contact')}>Save Emergency Contact</Button>
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
