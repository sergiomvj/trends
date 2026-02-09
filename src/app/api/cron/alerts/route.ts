import { NextResponse } from 'next/server';
import { NotificationService } from '@/services/notification-service';

export async function POST(request: Request) {
    try {
        const { trendId, channel } = await request.json();

        const notificationService = new NotificationService();
        await notificationService.sendAlert(Number(trendId), channel || 'telegram');

        return NextResponse.json({ success: true, message: `Alert sent to ${channel || 'telegram'}` });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Cron/Trigger endpoint to scan for hot trends
 */
export async function GET() {
    try {
        const notificationService = new NotificationService();
        await notificationService.checkAndTriggerAlerts(85);
        return NextResponse.json({ success: true, message: 'Scan completed' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
