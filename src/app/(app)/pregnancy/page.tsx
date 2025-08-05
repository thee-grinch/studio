
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
  Plus,
  ExternalLink
} from "lucide-react"
import {
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
import { useModalStore } from "@/lib/store"
import { useUserSubcollection } from "@/hooks/use-user-subcollection"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { useUserDocument } from "@/hooks/use-user-document"
import { useQuery } from "@tanstack/react-query"
import { getBabyUpdate } from "@/ai/flows/baby-update-flow"
import { getHealthTips } from "@/ai/flows/health-tips-flow"
import Link from "next/link"
import Image from "next/image"


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

    return {
        dueDate,
        currentWeek,
        weeksRemaining,
        trimester,
    }
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

const chartConfig: ChartConfig = {
  weight: {
    label: "Weight (lbs)",
    color: "hsl(var(--chart-1))",
  },
}

const getIconForCategory = (category: string) => {
    switch (category) {
        case "Nutrition":
            return Utensils;
        case "Exercise":
            return HeartPulse;
        case "Emotional Wellness":
            return ClipboardList;
        default:
            return Utensils;
    }
};

const getLinkForCategory = (category: string) => {
    switch (category) {
        case "Nutrition":
            return "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy";
        case "Exercise":
            return "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy";
        case "Emotional Wellness":
            return "https://www.marchofdimes.org/find-support/topics/pregnancy/emotional-and-mental-health-during-pregnancy";
        default:
            return "#";
    }
}

function BabyUpdateImage({ hint, alt }: { hint: string, alt: string }) {
    const { data: imageUrl, isLoading, isError } = useQuery({
        queryKey: ['pexelsImage', hint],
        queryFn: async () => {
            const response = await fetch(`/api/images?q=${encodeURIComponent(hint)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            const data = await response.json();
            return data.imageUrl;
        },
        enabled: !!hint,
        staleTime: Infinity, // Cache the image URL forever
    });

    if (isLoading) {
        return <Skeleton className="w-full h-64 md:w-1/3 rounded-lg" />;
    }

    if (isError || !imageUrl) {
        return <Image src="https://placehold.co/400x400.png" alt={alt} width={400} height={400} className="w-full md:w-1/3 rounded-lg" />;
    }

    return <Image src={imageUrl} alt={alt} width={400} height={400} className="w-full md:w-1/3 rounded-lg object-cover" />;
}


function BabyUpdatesTab({ currentWeek }: { currentWeek: number }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['babyUpdate', currentWeek],
        queryFn: () => getBabyUpdate({ currentWeek }),
        enabled: currentWeek > 0,
    });

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                     <Skeleton className="w-full h-64 md:w-1/3 rounded-lg" />
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-16 w-full" />
                         <Skeleton className="h-6 w-1/2" />
                    </div>
                </CardContent>
           </Card>
        );
    }
    
    if (isError || !data) return <p>Could not load baby updates at this time.</p>;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Week {currentWeek}: Baby Updates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                 <BabyUpdateImage hint={data.imageHint} alt={data.title} />
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{data.title}</h3>
                    <p className="text-muted-foreground">{data.description}</p>
                    <Button variant="link" className="p-0 h-auto" asChild>
                        <a href="https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/fetal-development/art-20046151" target="_blank" rel="noopener noreferrer">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read more about fetal development
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardContent>
           </Card>
    );
}

function HealthTipsTab({ currentWeek }: { currentWeek: number }) {
     const { data, isLoading, isError } = useQuery({
        queryKey: ['healthTips', currentWeek],
        queryFn: () => getHealthTips({ currentWeek }),
        enabled: currentWeek > 0,
    });

     if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({length: 3}).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex items-center gap-4">
                             <Skeleton className="w-12 h-12 rounded-lg" />
                            <Skeleton className="w-32 h-6" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-5 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
     }

     if (isError || !data) return <p>Could not load health tips at this time.</p>;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.tips.map((tip) => {
                const Icon = getIconForCategory(tip.category);
                const link = getLinkForCategory(tip.category);
                return (
                    <Card key={tip.category}>
                        <CardHeader className="flex items-center gap-4">
                             <div className="bg-primary rounded-lg p-3 flex-shrink-0">
                                <Icon className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <CardTitle>{tip.category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{tip.tip}</p>
                            <Button variant="link" className="p-0 h-auto mt-2" asChild>
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                  Learn more <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}


export default function PregnancyPage() {
  const openModal = useModalStore((state) => state.openModal);
  const { userDocument, loading: userDocLoading } = useUserDocument();
  const { data: symptomData, loading: symptomsLoading } = useUserSubcollection("symptoms");
  const { data: appointmentsData, loading: appointmentsLoading } = useUserSubcollection("appointments");
  
  const pregnancyInfo = calculatePregnancyInfo(userDocument?.dueDate);

  const getStatus = (date: string, time: string) => {
    const now = new Date();
    const apptDateTime = new Date(`${date}T${time}`);
    if (apptDateTime < now) return "Completed";
    return "Upcoming";
  }

  const processedAppointments = useMemo(() => {
    if (!appointmentsData) return [];
    return appointmentsData.map(appt => ({
        ...appt,
        status: getStatus(appt.date, appt.time),
    }));
  }, [appointmentsData]);

  const nextAppointment = processedAppointments
    .filter((a) => a.status === "Upcoming")
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];


  if (userDocLoading) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pregnancy Tracker</h1>
        <p className="text-muted-foreground">
          Manage and track your pregnancy journey and health details.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
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
                       {pregnancyInfo.currentWeek > 0 
                        ? `You’re ${pregnancyInfo.currentWeek} weeks pregnant – entering the ${pregnancyInfo.trimester}${pregnancyInfo.trimester === 1 ? 'st' : pregnancyInfo.trimester === 2 ? 'nd' : 'rd'} trimester!`
                        : "Update your profile to start your journey."
                       }
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-3">
                    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="text-xl sm:text-2xl font-bold">{pregnancyInfo.dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    </div>
                     <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Time to Go</p>
                        <p className="text-xl sm:text-2xl font-bold">{pregnancyInfo.weeksRemaining} weeks</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Trimester</p>
                        <p className="text-xl sm:text-2xl font-bold">{pregnancyInfo.trimester}</p>
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
                  {appointmentsLoading ? <Skeleton className="h-10 w-full" /> : nextAppointment ? (
                    <>
                      <p className="font-semibold">{nextAppointment.title}</p>
                      <p className="text-sm text-muted-foreground">
                          {new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {nextAppointment.time}
                      </p>
                    </>
                  ) : <p className="text-sm text-muted-foreground">No upcoming appointments.</p>}
                    <Button variant="link" className="p-0 h-auto mt-2" asChild>
                      <Link href="/appointments">View All</Link>
                    </Button>
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
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Weight Tracker</CardTitle>
                            <CardDescription>AI suggests weight gain is on a healthy track.</CardDescription>
                        </div>
                        <Button onClick={() => openModal('logWeight')}>
                            <Weight className="mr-2 h-4 w-4" /> Log Weight
                        </Button>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <ResponsiveContainer>
                                <LineChart data={weightData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Symptom & Mood Log</CardTitle>
                            <CardDescription>Recent check-ins.</CardDescription>
                        </div>
                         <Button onClick={() => openModal('logSymptom')}>
                            <HeartPulse className="mr-2 h-4 w-4" /> Log Symptom
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {symptomsLoading ? (
                         Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-16 rounded-full" />
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                          </div>
                        ))
                      ) : symptomData && symptomData.length > 0 ? (
                        symptomData.map(log => (
                          <div key={log.id} className="flex flex-col sm:flex-row justify-between items-start p-3 bg-muted rounded-lg gap-2">
                              <div>
                                <p className="font-semibold">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {log.symptoms?.length > 0 && <p>Symptoms: {log.symptoms.join(", ")}</p>}
                                  {log.moods?.length > 0 && <p>Moods: {log.moods.join(", ")}</p>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                                  {log.moods?.map((mood: string) => <Badge key={mood} variant="secondary">{mood}</Badge>)}
                              </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No symptoms logged yet.</p>
                      )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="baby" className="mt-6">
           <BabyUpdatesTab currentWeek={pregnancyInfo.currentWeek} />
        </TabsContent>

        <TabsContent value="tips" className="mt-6">
            <HealthTipsTab currentWeek={pregnancyInfo.currentWeek} />
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle>Your Appointments</CardTitle>
                     <Button onClick={() => openModal('newAppointment')}>
                        <Calendar className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {appointmentsLoading ? (
                        Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                    ) : processedAppointments.length > 0 ? (
                        processedAppointments.map((appt) => (
                            <div key={appt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted gap-2">
                                <div>
                                    <p className="font-semibold">{appt.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at {appt.time} with {appt.doctor}
                                    </p>
                                    {appt.status === "Completed" && <p className="text-xs text-muted-foreground mt-1">Summary: {appt.summary}</p>}
                                </div>
                                <Badge variant={appt.status === "Upcoming" ? "default" : "secondary"}>{appt.status}</Badge>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No appointments have been scheduled yet.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
