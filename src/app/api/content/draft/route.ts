import { NextResponse } from 'next/server';
import { ContentService, DraftType } from '@/services/content-service';

export async function POST(request: Request) {
    try {
        const { trendId, type } = await request.json();

        if (!trendId || !type) {
            return NextResponse.json({ error: 'Missing trendId or type' }, { status: 400 });
        }

        const contentService = new ContentService();
        const draft = await contentService.generateDraft(Number(trendId), type as DraftType);

        return NextResponse.json({ success: true, draft });
    } catch (error: any) {
        console.error('Content Generation API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const trendId = searchParams.get('trendId');

    if (!trendId) {
        return NextResponse.json({ error: 'Missing trendId' }, { status: 400 });
    }

    try {
        const contentService = new ContentService();
        const drafts = await contentService.getDraftsByTrend(Number(trendId));
        return NextResponse.json({ success: true, drafts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
