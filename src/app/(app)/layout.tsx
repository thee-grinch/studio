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
import { Button } from "@/components/ui/button"

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/pregnancy", label: "Pregnancy", icon: Baby },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/chatbot", label: "AI Chatbot", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: UserIcon },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
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
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
              <div className="md:hidden">
                 <SidebarTrigger />
              </div>
              <div className="flex-1">
                {/* Optional Header Title can go here */}
              </div>
              <UserNav />
          </header>
          <main className="flex-1 p-4 md:p-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
