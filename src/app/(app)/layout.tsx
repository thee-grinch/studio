
"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Baby, CalendarDays, LayoutGrid, MessageSquare, User as UserIcon } from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/pregnancy", label: "Pregnancy", icon: Baby },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/chatbot", label: "Support Chat", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: UserIcon },
]

function Footer() {
    return (
        <footer className="w-full p-4 bg-background border-t border-border shadow md:flex md:items-center md:justify-between md:p-6 h-20">
            <span className="text-sm text-muted-foreground sm:text-center">© 2024 Mamatoto™. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-muted-foreground sm:mt-0">
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Terms of Service</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contact</a>
                </li>
            </ul>
        </footer>
    );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="h-[calc(100vh-5rem)] top-0 md:h-screen">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Separator className="my-2" />
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col md:pl-[14rem]">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
              <div className="md:hidden">
                 <SidebarTrigger />
              </div>
              <div className="flex-1">
                 {/* The logo is in the sidebar, no need to repeat it here. */}
              </div>
              <UserNav />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
            {children}
          </main>
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
