import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'iso27001_audit',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

async function runMigrations() {
    console.log('🚀 Starting database migrations...\n');

    try {
        // Get all SQL files in migrations folder
        const files = fs.readdirSync(__dirname)
            .filter(f => f.endsWith('.sql'))
            .sort();

        for (const file of files) {
            console.log(`📄 Running migration: ${file}`);
            const filePath = path.join(__dirname, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            await pool.query(sql);
            console.log(`   ✅ Complete\n`);
        }

        console.log('🎉 All migrations completed successfully!');

        // Show summary
        const tables = await pool.query(`
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename
        `);

        console.log('\n📊 Created tables:');
        tables.rows.forEach(row => {
            console.log(`   - ${row.tablename}`);
        });

        const controlCount = await pool.query('SELECT COUNT(*) FROM controls');
        console.log(`\n📋 Loaded ${controlCount.rows[0].count} ISO 27001 controls`);

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

runMigrations();
