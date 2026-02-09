"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Share2,
    TrendingUp,
    MessageSquare,
    BarChart3,
    ShieldAlert,
    Flame,
    Loader2
} from "lucide-react"
import Link from "next/link"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const mockHistory = [
    { time: "00:00", value: 30 },
    { time: "04:00", value: 45 },
    { time: "08:00", value: 62 },
    { time: "12:00", value: 85 },
    { time: "16:00", value: 78 },
    { time: "20:00", value: 92 },
    { time: "23:59", value: 88 },
]

export default function TrendDetailPage() {
    const { slug } = useParams()
    const title = slug ? (slug as string).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Trend Detail"
    const [isGenerating, setIsGenerating] = useState<string | null>(null)
    const [draftContent, setDraftContent] = useState<string>("As sugestões de conteúdo aparecerão aqui após a geração...")
    const [trendId, setTrendId] = useState<number>(1) // TODO: Fetch real ID from slug

    const generateDraft = async (type: string) => {
        setIsGenerating(type)
        try {
            const res = await fetch('/api/content/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trendId, type })
            })
            const data = await res.json()
            if (data.success) {
                setDraftContent(data.draft.content)
            }
        } catch (error) {
            console.error("Failed to generate draft", error)
        } finally {
            setIsGenerating(null)
        }
    }

    return (
        <div className="flex-1 space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">Technology</Badge>
                            <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">Viral 🚀</Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                            {title}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button className="bg-neon-green text-black hover:bg-neon-green/90 shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                        Analyze Deeply
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Stats Card */}
                <Card className="md:col-span-2 bg-black/40 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-neon-green" />
                            Virality Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockHistory}>
                                    <defs>
                                        <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                        itemStyle={{ color: '#39FF14' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#39FF14"
                                        fillOpacity={1}
                                        fill="url(#colorViral)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Insight Card */}
                <Card className="bg-black/40 border-neon-purple/20 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BarChart3 className="h-24 w-24 text-neon-purple" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-neon-purple" />
                            AI Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-white/80 leading-relaxed">
                            Esta tendência está ganhando força devido ao recente anúncio da OpenAI sobre novos modelos.
                            A conversa está altamente concentrada no Reddit e Twitter, com um sentimento predominante de "entusiasmo cauteloso".
                        </p>
                        <div className="pt-4 border-t border-white/10">
                            <div className="text-sm text-white/50 mb-2 font-mono uppercase tracking-tighter">Predição de Longevidade</div>
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span className="text-neon-pink">ALTA (7-10 dias)</span>
                                <Flame className="h-5 w-5 text-neon-pink animate-pulse" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Breakdown Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-black/20 border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm uppercase font-mono">Volume de Busca</div>
                        <div className="text-3xl font-bold mt-1">1.2M+</div>
                        <div className="text-neon-green text-xs mt-1">↑ 45.2% esta hora</div>
                    </CardContent>
                </Card>
                <Card className="bg-black/20 border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm uppercase font-mono">Menções Sociais</div>
                        <div className="text-3xl font-bold mt-1">85.4K</div>
                        <div className="text-neon-purple text-xs mt-1">Explodindo no Reddit</div>
                    </CardContent>
                </Card>
                <Card className="bg-black/20 border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm uppercase font-mono">Sentimento</div>
                        <div className="text-3xl font-bold mt-1">Positivo (82%)</div>
                        <div className="text-neon-blue text-xs mt-1">82% reações positivas</div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Generator Section */}
            <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-neon-teal" />
                        AI Content Generator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                        <Button
                            variant="outline"
                            className="border-neon-teal/30 hover:bg-neon-teal/10 hover:text-neon-teal"
                            disabled={!!isGenerating}
                            onClick={() => generateDraft('twitter_thread')}
                        >
                            {isGenerating === 'twitter_thread' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                            Generate Twitter Thread
                        </Button>
                        <Button
                            variant="outline"
                            className="border-neon-purple/30 hover:bg-neon-purple/10 hover:text-neon-purple"
                            disabled={!!isGenerating}
                            onClick={() => generateDraft('blog_post')}
                        >
                            {isGenerating === 'blog_post' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                            Generate Blog Post
                        </Button>
                        <Button
                            variant="outline"
                            className="border-neon-pink/30 hover:bg-neon-pink/10 hover:text-neon-pink"
                            disabled={!!isGenerating}
                            onClick={() => generateDraft('instagram')}
                        >
                            {isGenerating === 'instagram' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flame className="mr-2 h-4 w-4" />}
                            Generate Instagram Post
                        </Button>
                    </div>

                    <div className="rounded-lg bg-black/60 p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-mono text-white/40 uppercase">Draft Output</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[10px] text-white/60 hover:text-white"
                                onClick={() => {
                                    navigator.clipboard.writeText(draftContent)
                                    alert("Copiado!")
                                }}
                            >
                                Copy to Clipboard
                            </Button>
                        </div>
                        <div className="text-sm text-white/90 font-mono whitespace-pre-wrap leading-relaxed">
                            {draftContent}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
