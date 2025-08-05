
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
import { useToast } from "@/hooks/use-toast"
import { resetPassword } from "@/lib/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordPage() {
    const [emailSent, setEmailSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: {
        email: "",
      },
    });

    const handleSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        setLoading(true);
        try {
            await resetPassword(values.email);
            setEmailSent(true);
            toast({
                title: "Reset Link Sent!",
                description: "Check your email for instructions to reset your password.",
            });
        } catch (err: any) {
            form.setError("email", { type: "manual", message: "Failed to send reset email. Please try again." });
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                      <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                      <Input
                                          type="email"
                                          placeholder="you@example.com"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                  </form>
                </Form>
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
