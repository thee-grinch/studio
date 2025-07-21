
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useState } from "react"

export default function ForgotPasswordPage() {
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmailSent(true);
    }

  return (
    <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
                <Logo />
            </div>
            <CardTitle className="text-2xl">Account Recovery</CardTitle>
            <CardDescription>
                {emailSent 
                ? "Check your inbox for a secure reset link!" 
                : "Enter your email and we'll send you a link to reset your password."}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {emailSent ? (
                 <div className="text-center">
                    <p className="text-muted-foreground mb-4">Didn't receive it? Check your spam folder or try again.</p>
                    <Button onClick={() => setEmailSent(false)} variant="outline">Try a different email</Button>
                 </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Send Reset Link
                    </Button>
                </form>
            )}
            <div className="mt-4 text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline text-primary">
                    Back to Login
                </Link>
            </div>
        </CardContent>
    </Card>
  )
}
