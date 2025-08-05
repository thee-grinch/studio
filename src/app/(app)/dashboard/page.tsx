
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
import { Baby, Calendar, Stethoscope, Utensils, Target, TrendingUp, AlertTriangle, CalendarPlus, MessageCircle, HeartPulse, Weight, Phone, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useModalStore } from "@/lib/store"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useUserDocument } from "@/hooks/use-user-document"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { getDashboardTip } from "@/ai/flows/dashboard-tip-flow"
import { useUserSubcollection } from "@/hooks/use-user-subcollection"


const upcomingAppointments = [
  { id: 1, type: "Checkup", date: "2024-07-15", time: "10:00 AM", doctor: "Dr. Smith", icon: Stethoscope },
  { id: 2, type: "Ultrasound Scan", date: "2024-07-29", time: "02:30 PM", doctor: "Tech. Johnson", icon: Baby },
]

const calculatePregnancyInfo = (dueDateStr: string | undefined) => {
    if (!dueDateStr) {
        return {
            dueDate: new Date(),
            currentWeek: 0,
            weeksRemaining: 40,
            trimester: 1,
            progressPercentage: 0,
        };
    }
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    const totalWeeks = 40;
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    
    const startDate = new Date(dueDate.getTime() - (totalWeeks * msInWeek));
    const currentWeek = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / msInWeek));
    const weeksRemaining = Math.max(0, totalWeeks - currentWeek);
    
    let trimester = 1;
    if (currentWeek > 27) {
        trimester = 3;
    } else if (currentWeek > 13) {
        trimester = 2;
    }

    const progressPercentage = (currentWeek / totalWeeks) * 100;

    return {
        dueDate,
        currentWeek,
        weeksRemaining,
        trimester,
        progressPercentage,
    }
}

const PersonalizedTip = ({ pregnancyInfo, symptoms, weights }: { pregnancyInfo: ReturnType<typeof calculatePregnancyInfo>, symptoms: any[], weights: any[] }) => {
    const { data: tip, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['dashboardTip', pregnancyInfo.currentWeek],
        queryFn: async () => {
            if (pregnancyInfo.currentWeek === 0) return null;
            return getDashboardTip({
                currentWeek: pregnancyInfo.currentWeek,
                trimester: pregnancyInfo.trimester,
                recentSymptoms: symptoms.slice(0, 5), // Get latest 5
                recentWeight: weights.slice(0, 5),
            })
        },
        enabled: pregnancyInfo.currentWeek > 0, // Only run if pregnancy has started
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <Skeleton className="h-24 w-full" />
    }

    if (isError || !tip) {
        return null; // Don't show anything on error or if no tip
    }

    return (
        <Alert variant={tip.isUrgent ? "destructive" : "default"} className={tip.isUrgent ? "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500" : ""}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                         {tip.isUrgent && <AlertTriangle className="h-4 w-4" />}
                        <AlertTitle>{tip.title}</AlertTitle>
                    </div>
                    <AlertDescription>{tip.description}</AlertDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </Alert>
    )
}


export default function DashboardPage() {
  const openModal = useModalStore((state) => state.openModal);
  const { user } = useAuth();
  const { userDocument, loading: userDocLoading } = useUserDocument();
  
  useEffect(() => {
    if (!userDocLoading && userDocument && !userDocument.dueDate) {
        openModal('profileSetup');
    }
  }, [userDocLoading, userDocument, openModal]);

  useEffect(() => {
    const symptomPromptShown = sessionStorage.getItem('symptomPromptShown');
    if (!symptomPromptShown) {
      openModal('logSymptom');
      sessionStorage.setItem('symptomPromptShown', 'true');
    }
  }, [openModal]);


  const pregnancyInfo = calculatePregnancyInfo(userDocument?.dueDate);
  const { data: symptoms, loading: symptomsLoading } = useUserSubcollection("symptoms");
  const { data: weights, loading: weightsLoading } = useUserSubcollection("weights");


  if (userDocLoading || symptomsLoading || weightsLoading) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-72 w-full lg:col-span-2" />
                <Skeleton className="h-72 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome, {user?.displayName || 'there'}!</h1>
        <p className="text-muted-foreground">You're doing great! Here's your personalized update.</p>
      </div>

      <PersonalizedTip pregnancyInfo={pregnancyInfo} symptoms={symptoms} weights={weights} />
      
      <Card className="w-full">
        <CardHeader>
            <CardTitle>Your Journey</CardTitle>
            <CardDescription>{userDocument?.dueDate ? `You're ${pregnancyInfo.progressPercentage.toFixed(0)}% of the way there!` : 'Please complete your profile to track your journey.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Due Date</p>
                <p className="text-2xl md:text-4xl font-bold text-primary">{userDocument?.dueDate ? pregnancyInfo.dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}</p>
            </div>
            <Progress value={pregnancyInfo.progressPercentage} aria-label={`${pregnancyInfo.progressPercentage.toFixed(0)}% of pregnancy complete`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
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
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
            <Button variant="outline" className="flex flex-col h-20 gap-1 text-xs sm:text-sm" onClick={() => openModal('logSymptom')}>
                <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Log Symptom</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-1 text-xs sm:text-sm" onClick={() => openModal('logWeight')}>
                <Weight className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Log Weight</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-20 gap-1 text-xs sm:text-sm" onClick={() => openModal('newAppointment')}>
                <CalendarPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>New Appt.</span>
            </Button>
            <Link href="/chatbot" className="contents">
                <Button variant="outline" className="flex flex-col h-20 gap-1 text-xs sm:text-sm">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Open Chat</span>
                </Button>
            </Link>
             <Button variant="destructive" className="flex flex-col h-20 gap-1 text-xs sm:text-sm col-span-2 sm:col-span-1 md:col-span-1" onClick={() => openModal('emergencyContacts')}>
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Emergency</span>
            </Button>
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
                            <Button variant="ghost" size="icon" asChild>
                               <Link href="/appointments"><ExternalLink className="h-5 w-5"/></Link>
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
