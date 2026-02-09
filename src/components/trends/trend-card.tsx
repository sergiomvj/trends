"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import Link from 'next/link'

interface TrendCardProps {
    title: string
    slug: string
    category: string
    score: number
    volume: string
    growth: number
    data: { value: number }[]
}

export function TrendCard({ title, slug, category, score, volume, growth, data }: TrendCardProps) {
    const isPositive = growth > 0
    const isNeutral = growth === 0

    return (
        <Link href={`/trend/${slug}`}>
            <Card className="hover:border-primary/50 border-border bg-card transition-all cursor-pointer group shadow-sm hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-border bg-muted/50">
                            {category}
                        </Badge>
                        <CardTitle className="font-heading text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 text-foreground">
                            {title}
                        </CardTitle>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`text-2xl font-bold font-mono ${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                            {score}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">Viral Score</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[60px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border bg-popover p-2 shadow-sm border-border text-popover-foreground">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Volume
                                                        </span>
                                                        <span className="font-bold">
                                                            {payload[0].value}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isPositive ? "#22c55e" : isNeutral ? "#94a3b8" : "#ef4444"}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <span>{volume}</span>
                            <span className="text-xs">searches</span>
                        </div>
                        <div className={`flex items-center gap-1 font-medium ${isPositive ? 'text-green-500' : isNeutral ? 'text-muted-foreground' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="h-4 w-4" /> : isNeutral ? <Minus className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {Math.abs(growth)}%
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
