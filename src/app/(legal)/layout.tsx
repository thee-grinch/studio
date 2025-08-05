
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Logo />
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
                    <Link href="/#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</Link>
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
    )
}

function Footer() {
    return (
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
    )
}


export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            <Header />
            <main className="flex-1 container">
                {children}
            </main>
            <Footer />
        </div>
    )
}
