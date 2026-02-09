"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    {/* Breadcrumbs or Title could go here */}
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search trends..."
                                className="pl-8 h-9 md:w-[300px] lg:w-[400px] bg-muted/50 border-none focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </nav>
                </div>
            </div>
        </header>
    )
}
