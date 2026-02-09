import { db } from "@/db";
import { trends } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getTrends() {
    try {
        const data = await db.select().from(trends).orderBy(desc(trends.updatedAt)).limit(20);
        return data;
    } catch (error) {
        console.error("Error fetching trends:", error);
        return [];
    }
}
