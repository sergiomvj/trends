import axios from 'axios';
import { db } from '@/db';
import { trends } from '@/db/schema';
import { eq, gte } from 'drizzle-orm';

export type NotificationChannel = 'telegram' | 'whatsapp' | 'email';

export class NotificationService {
    /**
     * Dispatches an alert to the selected channel
     */
    async sendAlert(trendId: number, channel: NotificationChannel) {
        const [trend] = await db.select().from(trends).where(eq(trends.id, trendId)).limit(1);
        if (!trend) return;

        const message = `🚀 *NOVA TREND VIRAL!*\n\n🔥 *${trend.title}*\n⭐ Viral Score: ${trend.score}\n📊 Volume: ${trend.volume}\n\nConfira no FBR Trends: ${process.env.APP_URL}/trend/${trend.slug}`;

        console.log(`📡 Sending ${channel} alert for: ${trend.title}`);

        try {
            if (channel === 'telegram') {
                await this.sendTelegram(message);
            } else if (channel === 'whatsapp') {
                await this.sendWhatsApp(message);
            }
        } catch (error) {
            console.error(`Failed to send ${channel} alert:`, error);
        }
    }

    private async sendTelegram(message: string) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.warn('⚠️ Telegram config missing (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID)');
            return;
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
    }

    private async sendWhatsApp(message: string) {
        const n8nUrl = process.env.N8N_WHATSAPP_WEBHOOK;
        if (!n8nUrl) {
            console.warn('⚠️ WhatsApp n8n webhook missing (N8N_WHATSAPP_WEBHOOK)');
            return;
        }

        await axios.post(n8nUrl, { message });
    }

    /**
     * Scans for high-viral trends and triggers alerts
     */
    async checkAndTriggerAlerts(minScore = 85) {
        const highViralTrends = await db.select().from(trends).where(gte(trends.score, minScore));

        for (const trend of highViralTrends) {
            // Logic to prevent duplicate alerts (e.g. check a 'last_notified_at' column)
            // For now, we just log
            console.log(`⭐ Trend ${trend.title} hit score ${trend.score}! Triggering alerts...`);
            await this.sendAlert(trend.id, 'telegram');
        }
    }
}
