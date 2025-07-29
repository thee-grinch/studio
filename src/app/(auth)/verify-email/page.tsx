
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
import { Logo } from "@/components/logo"
import { useAuth } from "@/hooks/use-auth"
import { sendEmailVerification } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    if (!user) {
        toast({ title: "Error", description: "You are not logged in.", variant: "destructive"});
        return;
    }
    setIsSending(true);
    try {
        await sendEmailVerification(user);
        toast({ title: "Email Sent!", description: "A new verification link has been sent to your email."});
    } catch (error) {
        toast({ title: "Error", description: "Failed to send verification email. Please try again.", variant: "destructive"});
        console.error(error);
    } finally {
        setIsSending(false);
    }
  }


  return (
    <Card className="mx-auto max-w-md w-full text-center">
        <CardHeader className="space-y-4">
            <div className="flex justify-center">
                <Logo />
            </div>
            <CardTitle className="text-2xl">One More Step!</CardTitle>
            <CardDescription>
                We've sent a verification link to activate your account.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold text-foreground">{user?.email || 'your email'}</p>
            </div>
            <p className="text-sm text-muted-foreground">
                Please click the link in that email to continue.
            </p>
            <Button className="w-full" onClick={handleResend} disabled={isSending}>
                {isSending ? "Sending..." : "Resend Verification Email"}
            </Button>
            <div className="text-sm">
                <p className="text-muted-foreground">
                    Didn't receive it? Check your spam folder.
                </p>
                 <Link href="/login" className="underline text-primary">
                    Already verified? Log In
                </Link>
            </div>
        </CardContent>
    </Card>
  )
}
