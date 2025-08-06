

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Baby, Bot, CalendarCheck, HeartPulse, Sparkles, UserCheck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DynamicPexelsImage } from "@/components/dynamic-pexels-image"
import Image from "next/image"

const FeatureCard = ({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  const Icon = icon
  return (
    <Card className="text-center flex flex-col items-center">
      <CardHeader className="items-center">
        <div className="bg-primary/10 p-3 rounded-full mb-2">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

const TestimonialCard = ({ name, role, quote, avatarHint }: { name: string, role: string, quote: string, avatarHint: string }) => (
  <Card className="flex flex-col justify-between">
    <CardContent className="pt-6">
      <p className="text-muted-foreground italic">"{quote}"</p>
    </CardContent>
    <div className="p-6 pt-0 flex items-center gap-4">
      <Avatar>
        <DynamicPexelsImage hint={avatarHint} alt={name} className="h-10 w-10" />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </Card>
)

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-28">
          <div className="container grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter">
                Your Personal Guide Through Pregnancy
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                Mamatoto offers personalized support, AI-powered insights, and health tracking to empower you on your journey to motherhood.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-[600px] h-[400px] rounded-xl shadow-2xl overflow-hidden">
                <Image
                  src="/hero-image.jpg"
                  alt="Happy pregnant African mother using the app"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-28 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="outline" className="mb-2">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need, All in One Place</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From AI assistance to detailed tracking, we've got you covered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Bot}
                title="AI Support Chatbot"
                description="Get instant, empathetic answers to your pregnancy questions, available 24/7."
              />
              <FeatureCard 
                icon={HeartPulse}
                title="Health Symptom Tracking"
                description="Log symptoms and weight easily to monitor your health and identify trends."
              />
              <FeatureCard 
                icon={CalendarCheck}
                title="Appointment Management"
                description="Never miss an appointment with our smart scheduling and reminder system."
              />
               <FeatureCard 
                icon={Baby}
                title="Weekly Baby Updates"
                description="Receive personalized updates on your baby's development each week."
              />
               <FeatureCard 
                icon={Sparkles}
                title="Personalized AI Tips"
                description="Get daily tips and insights tailored to your specific week and symptoms."
              />
               <FeatureCard 
                icon={UserCheck}
                title="Personalized For You"
                description="Customize your profile for a fully personalized pregnancy tracking experience."
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 sm:py-28">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Getting Started is Easy</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Three simple steps to begin your personalized journey.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center p-6 space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
                        <h3 className="text-xl font-semibold">Create Your Account</h3>
                        <p className="text-muted-foreground">Sign up in seconds and tell us your due date to begin.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 space-y-4">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
                        <h3 className="text-xl font-semibold">Log Your Progress</h3>
                        <p className="text-muted-foreground">Start tracking symptoms, weight, and appointments.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 space-y-4">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
                        <h3 className="text-xl font-semibold">Receive Insights</h3>
                        <p className="text-muted-foreground">Enjoy personalized AI-driven tips and updates on your dashboard.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 sm:py-28 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
               <Badge variant="outline" className="mb-2">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Mothers Everywhere</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See what our users are saying about their experience with Mamatoto.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Jessica P."
                role="First-Time Mom"
                quote="This app was my go-to for everything. The AI chatbot was so reassuring for all my late-night questions. I felt so much more confident."
                avatarHint="african woman face"
              />
              <TestimonialCard
                name="Maria G."
                role="Mother of Two"
                quote="I wish I had Mamatoto for my first pregnancy! Tracking everything in one place made it so much easier to manage, especially with another child to look after."
                avatarHint="kenyan woman"
              />
              <TestimonialCard
                name="Sarah L."
                role="Soon-to-be Mom"
                quote="The weekly updates are my favorite part. Seeing how my baby is growing and what to expect each week is magical. I recommend it to all my pregnant friends!"
                avatarHint="nigerian woman face"
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 sm:py-28">
            <div className="container">
                <div className="bg-primary/10 rounded-2xl p-10 md:p-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground--">Ready to Start Your Journey?</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                        Join thousands of mothers who are navigating their pregnancy with confidence and support. Create your free account today.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" asChild>
                            <Link href="/register">Sign Up Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col sm:flex-row items-center justify-between py-8 text-sm text-muted-foreground">
          <div className="mb-4 sm:mb-0">
             <Logo />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
             <p>© {new Date().getFullYear()} Mamatoto. All Rights Reserved.</p>
             <div className="flex gap-4">
                <Link href="/terms-of-service" className="hover:underline">Terms</Link>
                <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
