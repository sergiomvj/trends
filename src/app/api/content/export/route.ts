import { NextResponse } from 'next/server';
import { ExportService } from '@/services/export-service';

export async function GET(request: Request) {
    try {
        const exportService = new ExportService();
        const csv = await exportService.generateCSV();

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="trends-export-${new Date().toISOString().split('T')[0]}.csv"`
            }
        });
    } catch (error: any) {
        console.error('Export API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
