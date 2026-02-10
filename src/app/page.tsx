import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-12 bg-background transition-colors duration-500">

      {/* Hero Section */}
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-block mb-4 px-6 py-2 rounded-full bg-background shadow-[inset_4px_4px_8px_#E2E8F0,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0A0E17,inset_-4px_-4px_8px_#232F42] text-sm font-semibold text-primary tracking-wide">
          ✨ The Future of Trends
        </div>

        <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight text-foreground drop-shadow-sm">
          FBR <span className="text-primary">Trends</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed font-sans">
          Plataforma de inteligência de dados em tempo real. Identifique o que importa antes de todo mundo.
        </p>
      </div>

      {/* Clay Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">

        {/* Card 1: Google Trends */}
        <div className="group relative transition-all duration-300 hover:-translate-y-2">
          <Card className="h-full border-none bg-background rounded-[2.5rem] shadow-[20px_20px_60px_#E2E8F0,-20px_-20px_60px_#ffffff] dark:shadow-[16px_16px_32px_#0A0E17,-16px_-16px_32px_#232F42]">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 mb-4 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <CardTitle className="font-heading text-2xl font-bold text-foreground">Google Trends</CardTitle>
              <CardDescription className="text-muted-foreground font-sans">Buscas em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-5xl font-black text-primary drop-shadow-sm">+120%</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-2 font-sans">Crescimento médio</p>
            </CardContent>
          </Card>
        </div>

        {/* Card 2: Viral Score */}
        <div className="group relative transition-all duration-300 hover:-translate-y-2 delay-100">
          <Card className="h-full border-none bg-background rounded-[2.5rem] shadow-[20px_20px_60px_#E2E8F0,-20px_-20px_60px_#ffffff] dark:shadow-[16px_16px_32px_#0A0E17,-16px_-16px_32px_#232F42]">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 8.5v.01"></path><path d="M12 16.5v.01"></path><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
              </div>
              <CardTitle className="font-heading text-2xl font-bold text-foreground">Viral Score</CardTitle>
              <CardDescription className="text-muted-foreground font-sans">Inteligência Artificial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-5xl font-black text-blue-500 drop-shadow-sm">85.4</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-2 font-sans">Score de oportunidade</p>
            </CardContent>
          </Card>
        </div>

        {/* Card 3: Active Sources */}
        <div className="group relative transition-all duration-300 hover:-translate-y-2 delay-200">
          <Card className="h-full border-none bg-background rounded-[2.5rem] shadow-[20px_20px_60px_#E2E8F0,-20px_-20px_60px_#ffffff] dark:shadow-[16px_16px_32px_#0A0E17,-16px_-16px_32px_#232F42]">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 mb-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M2 12h20"></path><path d="m4.93 4.93 14.14 14.14"></path><path d="m4.93 19.07 14.14-14.14"></path></svg>
              </div>
              <CardTitle className="font-heading text-2xl font-bold text-foreground">Fontes Ativas</CardTitle>
              <CardDescription className="text-muted-foreground font-sans">Monitoramento 24/7</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-5xl font-black text-emerald-500 drop-shadow-sm">12</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mt-2 font-sans">Canais conectados</p>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Floating Action Buttons */}
      <div className="flex gap-8 mt-8">
        <Link href="/dashboard">
          <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-full bg-primary text-primary-foreground shadow-[8px_8px_16px_#E2E8F0,-8px_-8px_16px_#ffffff] dark:shadow-[6px_6px_12px_#0A0E17,-6px_-6px_12px_#232F42] hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)] transition-all transform hover:scale-95 border-none font-heading">
            Acessar Dashboard
          </Button>
        </Link>
        <Link href="/docs">
          <Button size="lg" variant="ghost" className="h-16 px-10 text-lg font-bold rounded-full bg-transparent hover:bg-secondary text-muted-foreground transition-colors font-heading">
            Documentação
          </Button>
        </Link>
      </div>
    </div>
  );
}
