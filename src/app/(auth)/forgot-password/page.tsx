
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
import { useState, type FormEvent } from "react"
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/lib/auth"

export default function ForgotPasswordPage() {
    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError(null);
        try {
            await resetPassword(email);
            setEmailSent(true);
            toast({
                title: "Reset Link Sent!",
                description: "Check your email for instructions to reset your password.",
            });
        } catch (err: any) {
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <Card className="mx-auto w-full max-w-sm">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
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
