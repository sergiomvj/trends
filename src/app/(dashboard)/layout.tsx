import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <aside className="hidden w-64 flex-col md:flex fixed inset-y-0 z-50">
                <Sidebar className="h-full" />
            </aside>
            <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 space-y-4 p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
