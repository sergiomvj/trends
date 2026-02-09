"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Globe, Hash, LayoutDashboard, Newspaper, Settings, Zap, Bell } from "lucide-react"

const sidebarNavItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Google Trends",
        href: "/dashboard/google",
        icon: Globe,
    },
    {
        title: "Alerts",
        href: "/alerts",
        icon: Bell,
    },
    {
        title: "Custom Sources",
        href: "/sources",
        icon: Newspaper,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 bg-sidebar border-r border-sidebar-border h-screen sticky top-0", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary fill-primary/20" />
                        <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                            FBR Trends
                        </span>
                    </h2>
                    <div className="space-y-1">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                        Saved Feeds
                    </h2>
                    <ScrollArea className="h-[300px] px-1">
                        <div className="space-y-1 p-2">
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                                <Hash className="mr-2 h-4 w-4" /> #AI
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                                <Hash className="mr-2 h-4 w-4" /> #Crypto
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                                <Hash className="mr-2 h-4 w-4" /> #Marketing
                            </Button>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
