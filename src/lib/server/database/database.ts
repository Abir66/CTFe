import pg from 'pg'
import { env } from '$env/dynamic/private';

// Hosted Postgres (Supabase, Neon, Render, ...) requires SSL; local does not.
// Override with DATABASE_SSL=true|false if needed.
function use_ssl(url: string) {
  if (env.DATABASE_SSL) return env.DATABASE_SSL === 'true';
  const host = new URL(url).hostname;
  return !['localhost', '127.0.0.1', '::1'].includes(host);
}

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: use_ssl(env.DATABASE_URL) ? { rejectUnauthorized: false } : false,
});


export const run_query = async function(query, params) {
    try {
        const data = await pool.query(query, params);
        return {
            success: true,
            data: data.rows
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

export default{
    run_query
}
