
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { signUp } from "@/lib/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters.").regex(/^[a-zA-Z\s]*$/, "Full name can only contain letters and spaces."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});


export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

     const form = useForm<z.infer<typeof registerSchema>>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      },
    });

    const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
        setLoading(true);
        try {
            await signUp(values.email, values.password, values.fullName);
            toast({
                title: "Account Created!",
                description: "You have been successfully signed up.",
            });
            router.push('/dashboard');
        } catch (err: any) {
             if (err.code === 'auth/email-already-in-use') {
                form.setError("email", { type: "manual", message: "This email address is already in use." });
            } else {
                form.setError("root", { type: "manual", message: err.message || "Failed to create an account. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
            <Link href="/">
                <Logo />
            </Link>
        </div>
        <CardTitle className="text-2xl">Create Your Account</CardTitle>
        <CardDescription>
          Access personalized health support for you and your baby.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                           <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Create Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} {...field} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
          </div>
          
            <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 pt-2">
                         <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                         </FormControl>
                         <div className="grid gap-1.5 leading-none">
                            <FormLabel>
                                I agree to the <Link href="/terms-of-service" className="underline text-primary">Privacy Policy</Link> and <Link href="/terms-of-service" className="underline text-primary">Terms of Service</Link>.
                            </FormLabel>
                             <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
           {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline text-primary">
            Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
