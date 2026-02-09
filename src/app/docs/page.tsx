
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background p-8 font-sans text-foreground">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-heading text-4xl font-bold text-foreground">Documentação</h1>
                        <p className="text-muted-foreground">Guias e padrões do FBR Trends</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Design Standards */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-heading text-2xl">Design Standards</CardTitle>
                            <CardDescription>Padrões visuais e de UX</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg text-primary">Cores</h3>
                                <div className="flex gap-4 mt-2">
                                    <div className="h-12 w-12 rounded-lg bg-background border shadow-sm flex items-center justify-center text-xs">Bg</div>
                                    <div className="h-12 w-12 rounded-lg bg-card border shadow-sm flex items-center justify-center text-xs">Card</div>
                                    <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs">Pri</div>
                                    <div className="h-12 w-12 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center text-xs">Sec</div>
                                    <div className="h-12 w-12 rounded-lg bg-muted text-muted-foreground flex items-center justify-center text-xs">Mut</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Docs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-heading text-2xl">API & Integrações</CardTitle>
                            <CardDescription>Conexões externas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li><strong>Firecrawl:</strong> Scraping avançado de URLs.</li>
                                <li><strong>Google Trends:</strong> Monitoramento de tendências de busca.</li>
                                <li><strong>Supabase:</strong> Banco de dados e autenticação.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
