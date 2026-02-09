"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Bell, Send, MessageSquare, Mail } from "lucide-react"

export default function AlertsPage() {
    const [minScore, setMinScore] = useState([85])
    const [telegramEnabled, setTelegramEnabled] = useState(true)
    const [whatsappEnabled, setWhatsappEnabled] = useState(false)
    const [emailEnabled, setEmailEnabled] = useState(false)

    const handleSave = () => {
        alert("Configurações salvas com sucesso!")
    }

    return (
        <div className="flex-1 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    Configurações de Alerta
                </h2>
                <p className="text-muted-foreground">
                    Gerencie como e quando você deseja ser notificado sobre tendências virais.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-neon-green" />
                            Gatilhos de Notificação
                        </CardTitle>
                        <CardDescription>
                            Defina o Viral Score mínimo para disparar um alerta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Viral Score Mínimo: <span className="text-neon-green font-bold">{minScore}%</span></Label>
                            </div>
                            <Slider
                                value={minScore}
                                onValueChange={setMinScore}
                                max={100}
                                step={1}
                                className="py-4"
                            />
                            <p className="text-xs text-white/40">
                                Tendências com score acima de {minScore}% serão enviadas para os canais ativados.
                            </p>
                        </div>
                        <Button onClick={handleSave} className="w-full bg-neon-green text-black hover:bg-neon-green/90 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                            Salvar Gatilhos
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-neon-blue" />
                            Canais de Envio
                        </CardTitle>
                        <CardDescription>
                            Escolha onde deseja receber as notificações.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neon-blue/10 rounded-lg">
                                    <Send className="h-4 w-4 text-neon-blue" />
                                </div>
                                <Label htmlFor="telegram">Telegram Bot</Label>
                            </div>
                            <Switch id="telegram" checked={telegramEnabled} onCheckedChange={setTelegramEnabled} />
                        </div>

                        <div className="flex items-center justify-between space-x-2 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neon-green/10 rounded-lg">
                                    <MessageSquare className="h-4 w-4 text-neon-green" />
                                </div>
                                <Label htmlFor="whatsapp">WhatsApp (via n8n)</Label>
                            </div>
                            <Switch id="whatsapp" checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neon-purple/10 rounded-lg">
                                    <Mail className="h-4 w-4 text-neon-purple" />
                                </div>
                                <Label htmlFor="email">E-mail Digest</Label>
                            </div>
                            <Switch id="email" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
