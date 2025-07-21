
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

export default function VerifyEmailPage() {

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
                <p className="font-semibold text-foreground">jane.doe@example.com</p>
            </div>
            <p className="text-sm text-muted-foreground">
                Please click the link in that email to continue.
            </p>
            <Button className="w-full">
                Resend Verification Email
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
