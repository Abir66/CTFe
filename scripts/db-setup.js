// Prepares an empty database for the app by running db/*.sql in order.
// Usage: npm run db:setup   (reads DATABASE_URL from the environment / .env)
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('DATABASE_URL is not set');
	process.exit(1);
}

const host = new URL(url).hostname;
const ssl = process.env.DATABASE_SSL
	? process.env.DATABASE_SSL === 'true'
	: !['localhost', '127.0.0.1', '::1'].includes(host);

const dir = path.resolve('db');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

const client = new pg.Client({ connectionString: url, ssl: ssl ? { rejectUnauthorized: false } : false });
await client.connect();
try {
	await client.query('BEGIN');
	for (const file of files) {
		console.log(`running ${file}`);
		await client.query(fs.readFileSync(path.join(dir, file), 'utf8'));
	}
	await client.query('COMMIT');
	console.log('database ready');
} catch (err) {
	await client.query('ROLLBACK');
	console.error(err.message);
	process.exitCode = 1;
} finally {
	await client.end();
}
