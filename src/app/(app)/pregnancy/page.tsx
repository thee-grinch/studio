"use client"

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
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const activePregnancy = {
  dueDate: new Date("2024-12-25"),
  currentWeek: 14,
  trimester: 2,
}

const pastPregnancies = [
  { id: 1, dueDate: new Date("2021-03-10"), outcome: "Delivered" },
]

export default function PregnancyPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pregnancy Tracker</h1>
        <p className="text-muted-foreground">Manage and track your pregnancy details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Pregnancy</CardTitle>
          <CardDescription>Your current pregnancy at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="text-2xl font-bold">{activePregnancy.dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
            <p className="text-sm text-muted-foreground">Current Week</p>
            <p className="text-2xl font-bold">{activePregnancy.currentWeek}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
            <p className="text-sm text-muted-foreground">Trimester</p>
            <p className="text-2xl font-bold">{activePregnancy.trimester}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Pregnancy History</CardTitle>
            <CardDescription>View your past and current pregnancies.</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Pregnancy</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Pregnancy</DialogTitle>
                <DialogDescription>
                  Please select the estimated due date.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center">
                 <Calendar mode="single" />
              </div>
              <DialogFooter>
                <Button>Save Pregnancy</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{activePregnancy.dueDate.toLocaleDateString()}</TableCell>
                <TableCell><Badge>Active</Badge></TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
              {pastPregnancies.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.dueDate.toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="secondary">{p.outcome}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Set as Active</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
