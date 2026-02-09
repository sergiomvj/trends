import { TrendCard } from "./trend-card"

// Mock Data for fallback
const mockTrends = [
    {
        id: 1,
        title: "AI Agents",
        category: "Technology",
        score: 92,
        volume: "1.2M",
        growth: 125,
        data: [{ value: 10 }, { value: 25 }, { value: 45 }, { value: 80 }, { value: 95 }, { value: 100 }],
    },
    {
        id: 2,
        title: "Bitcoin ETF",
        category: "Finance",
  { id: 1, title: 'Big Brother Brasil 24', slug: 'big-brother-brasil-24', category: 'Entertainment', score: 95, volume: '2M+', growth: 25, data: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 100) })) },
    { id: 2, title: 'OpenAI GPT-5 Leak', slug: 'openai-gpt-5-leak', category: 'Technology', score: 88, volume: '500K+', growth: 120, data: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 100) })) },
    { id: 3, title: 'Carnaval 2026 Rio', slug: 'carnaval-2026-rio', category: 'Events', score: 72, volume: '1M+', growth: 15, data: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 100) })) },
    { id: 4, title: 'Nvidia Stock Surge', slug: 'nvidia-stock-surge', category: 'Finance', score: 91, volume: '300K+', growth: 45, data: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 100) })) },
    { id: 5, title: 'Resumo BBB 24 Festa', slug: 'resumo-bbb-24-festa', category: 'YouTube', score: 82, volume: '1.2M', growth: 10, data: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 100) })) },
    { id: 6, title: 'Universal Kidney Match', slug: 'universal-kidney-match', category: 'reddit', score: 78, volume: 'N/A', growth: 50, data: Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 100) })) },
]

interface TrendListProps {
    data?: any[]
}

export function TrendList({ data }: TrendListProps) {
    // Use provided data or fallback to mock
    const trendsToDisplay = data || mockTrends;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendsToDisplay.map((trend: any) => (
                <TrendCard
                    key={trend.id}
                    title={trend.title}
                    slug={trend.slug || 'detail'}
                    category={trend.category}
                    score={trend.score}
                    volume={trend.volume}
                    growth={trend.growth || 0}
                    data={trend.data || []}
                />
            ))}
        </div>
    )
}
