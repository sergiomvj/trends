import 'dotenv/config';
import postgres from 'postgres';

async function main() {
    const connectionString = process.env.CONEXAO_SUPABASE || process.env.DATABASE_URL!;
    console.log('Testing connection to:', connectionString ? connectionString.replace(/:[^:]*@/, ':***@') : 'undefined');

    if (!connectionString) {
        console.error('No connection string found');
        process.exit(1);
    }

    try {
        const sql = postgres(connectionString, { prepare: false }); // prepare: false for pgbouncer
        const result = await sql`SELECT 1 as result`;
        console.log('✅ Connection successful:', result);
        await sql.end();
    } catch (e) {
        console.error('❌ Connection failed:', e);
    }
}

main();
