"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Zap, Search, ArrowUp, ArrowDown } from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { TrendList } from "@/components/trends/trend-list"
import { CategoryFilter } from "@/components/trends/category-filter"
import { DatePickerWithRange } from "@/components/dashboard/date-range-picker"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"


export default function DashboardPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("score")

    return (
        <div className="flex-1 space-y-6 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                        Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                        Visão geral das tendências e performance.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <DatePickerWithRange />
                    <Button className="font-bold">Download Report</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Trends</CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-heading">1,284</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUp className="h-3 w-3 mr-1" /> +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Social Impact</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-heading">+45.2K</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUp className="h-3 w-3 mr-1" /> +180.1% from last hour
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Viral Score</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-heading">84.2</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <ArrowUp className="h-3 w-3 mr-1" /> +5.4% from yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Scrapers</CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-heading">12</div>
                        <p className="text-xs text-muted-foreground mt-1">All services operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-heading">Trend Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-heading">Top Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {['Technology', 'AI', 'Business'].map((cat, i) => (
                                <div key={cat} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{cat}</span>
                                        <span className="text-muted-foreground">{85 - (i * 10)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${85 - (i * 10)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold font-heading text-foreground">Live Trends</h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search trends..."
                                className="pl-8 w-[200px] lg:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <CategoryFilter
                            selectedCategories={selectedCategories}
                            onSelectCategories={setSelectedCategories}
                        />
                        <div className="flex gap-2">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="score">Viral Score</SelectItem>
                                    <SelectItem value="volume">Search Volume</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={() => window.open('/api/content/export', '_blank')}
                            >
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </div>
                <TrendList />
            </div>
        </div>
    )
}
