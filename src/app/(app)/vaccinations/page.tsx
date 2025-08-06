
"use client"

import {
  ShieldCheck,
  Info,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

type VaccineStatus = "Recommended" | "Completed" | "Declined"

interface Vaccine {
  name: string
  description: string
  timing: string
  protectsAgainst: string[]
  status: VaccineStatus
}

const maternalVaccines: Vaccine[] = [
  {
    name: "Influenza (Flu) Shot",
    description: "The inactivated flu vaccine is recommended for pregnant women during flu season (October through May).",
    timing: "Any trimester",
    protectsAgainst: ["Influenza"],
    status: "Recommended",
  },
  {
    name: "Tetanus, Diphtheria, and Pertussis (Tdap)",
    description: "The Tdap vaccine helps protect against pertussis (whooping cough), which is serious for newborns.",
    timing: "Between 27 and 36 weeks of each pregnancy",
    protectsAgainst: ["Tetanus", "Diphtheria", "Pertussis"],
    status: "Recommended",
  },
  {
    name: "COVID-19 Vaccine",
    description: "Staying up to date with COVID-19 vaccines is recommended before, during, and after pregnancy.",
    timing: "Any trimester",
    protectsAgainst: ["COVID-19"],
    status: "Completed",
  },
]

const infantVaccines: Vaccine[] = [
  {
    name: "Hepatitis B (HepB)",
    description: "First dose given to most newborns before they leave the hospital.",
    timing: "Birth",
    protectsAgainst: ["Hepatitis B"],
    status: "Recommended",
  },
  {
    name: "Diphtheria, Tetanus, and Pertussis (DTaP)",
    description: "A 5-dose series for infants and children.",
    timing: "2, 4, 6, 15–18 months, 4–6 years",
    protectsAgainst: ["Diphtheria", "Tetanus", "Pertussis"],
    status: "Recommended",
  },
  {
    name: "Haemophilus influenzae type b (Hib)",
    description: "Protects against a leading cause of bacterial meningitis in children.",
    timing: "2, 4, 6, 12–15 months",
    protectsAgainst: ["Meningitis", "Pneumonia", "Epiglottitis"],
    status: "Recommended",
  },
  {
    name: "Pneumococcal (PCV13)",
    description: "Protects against pneumococcal disease, which can cause ear infections, pneumonia, and meningitis.",
    timing: "2, 4, 6, 12–15 months",
    protectsAgainst: ["Pneumonia", "Meningitis"],
    status: "Declined",
  },
  {
    name: "Polio (IPV)",
    description: "Protects against poliovirus, a disabling and life-threatening disease.",
    timing: "2, 4, 6–18 months, 4–6 years",
    protectsAgainst: ["Poliomyelitis"],
    status: "Completed",
  },
  {
    name: "Rotavirus (RV)",
    description: "Protects against rotavirus, which causes severe diarrhea, mostly in babies and young children.",
    timing: "2, 4, 6 months",
    protectsAgainst: ["Rotavirus"],
    status: "Recommended",
  },
];

const getStatusStyles = (status: VaccineStatus) => {
  switch (status) {
    case "Recommended":
      return {
        variant: "secondary",
        icon: <HelpCircle className="w-4 h-4 text-blue-500" />,
        textColor: "text-blue-500",
      };
    case "Completed":
      return {
        variant: "default",
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
        textColor: "text-green-500",
      };
    case "Declined":
      return {
        variant: "destructive",
        icon: <XCircle className="w-4 h-4" />,
        textColor: "text-destructive",
      };
    default:
      return {
        variant: "outline",
        icon: <HelpCircle className="w-4 h-4" />,
        textColor: "",
      };
  }
}

function VaccineCard({ vaccine }: { vaccine: Vaccine }) {
  const { variant, icon, textColor } = getStatusStyles(vaccine.status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            {vaccine.name}
          </CardTitle>
          <Badge variant={variant as any} className="flex items-center gap-1">
            {icon} {vaccine.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-2">
          <Calendar className="w-4 h-4" />
          Recommended: {vaccine.timing}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{vaccine.description}</p>
        <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold">Protects Against:</span>
            {vaccine.protectsAgainst.map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function VaccinationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Vaccinations</h1>
        <p className="text-muted-foreground">
          Track recommended vaccines for a healthy pregnancy and a healthy baby.
        </p>
      </div>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader className="flex flex-row items-center gap-4">
            <Info className="w-6 h-6 text-blue-600" />
            <div>
                <CardTitle className="text-blue-800 dark:text-blue-300">Important Disclaimer</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-400">
                    This information is for educational purposes only. Always consult with your healthcare provider to determine the best vaccination schedule for you and your baby.
                </CardDescription>
            </div>
        </CardHeader>
      </Card>


      <Tabs defaultValue="maternal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="maternal">
            Maternal Vaccines
          </TabsTrigger>
          <TabsTrigger value="infant">
            Infant Vaccines
          </TabsTrigger>
        </TabsList>
        <TabsContent value="maternal" className="mt-6">
          <div className="grid gap-6">
            {maternalVaccines.map((vaccine) => (
              <VaccineCard key={vaccine.name} vaccine={vaccine} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="infant" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {infantVaccines.map((vaccine) => (
              <VaccineCard key={vaccine.name} vaccine={vaccine} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
