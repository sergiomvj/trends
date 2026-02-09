import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const connectionString = process.env.CONEXAO_SUPABASE || process.env.DATABASE_URL!;

if (!connectionString) {
    console.log('🔴 Cannot find database url');
}

export default {
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: connectionString,
    },
} satisfies Config;
