"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Newspaper, Globe, Hash, Trash2, Play } from "lucide-react"

const initialSources = [
    { id: 1, name: "Google Trends BR", type: "google", url: "https://trends.google.com", status: "active", lastRun: "2 horas atrás" },
    { id: 2, name: "G1 RSS", type: "rss", url: "https://g1.globo.com/rss", status: "active", lastRun: "1 hora atrás" },
    { id: 3, name: "Reddit r/Technology", type: "reddit", url: "r/technology", status: "active", lastRun: "30 min atrás" },
    { id: 4, name: "YouTube Trending", type: "youtube", url: "BR", status: "error", lastRun: "Falhou" },
]

export default function SourcesPage() {
    const [sources, setSources] = useState(initialSources)

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        Fontes Personalizadas
                    </h2>
                    <p className="text-muted-foreground">
                        Gerencie as origens de dados do seu motor de busca.
                    </p>
                </div>
                <Button className="bg-neon-green text-black hover:bg-neon-green/90 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                    <Plus className="mr-2 h-4 w-4" /> Nova Fonte
                </Button>
            </div>

            <div className="grid gap-4">
                {sources.map((source) => (
                    <Card key={source.id} className="bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${source.type === 'google' ? 'bg-blue-500/10 text-blue-500' :
                                        source.type === 'rss' ? 'bg-orange-500/10 text-orange-500' :
                                            source.type === 'reddit' ? 'bg-red-500/10 text-red-500' :
                                                'bg-neon-purple/10 text-neon-purple'
                                    }`}>
                                    {source.type === 'rss' ? <Newspaper className="h-5 w-5" /> :
                                        source.type === 'google' ? <Globe className="h-5 w-5" /> :
                                            <Hash className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-white">{source.name}</h3>
                                        <Badge variant={source.status === 'active' ? 'outline' : 'destructive'}
                                            className={source.status === 'active' ? 'border-neon-green/50 text-neon-green' : ''}>
                                            {source.status === 'active' ? 'Ativo' : 'Erro'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-white/40 font-mono">{source.url}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs text-white/20 uppercase font-bold">Última Execução</p>
                                    <p className="text-sm text-white/60">{source.lastRun}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="hover:text-neon-green">
                                        <Play className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:text-neon-pink">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
