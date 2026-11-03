import crypto from 'crypto';
import { promisify } from 'util';
import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { run_query } from '$lib/server/database/database';

const scrypt = promisify(crypto.scrypt) as (
	password: crypto.BinaryLike,
	salt: crypto.BinaryLike,
	keylen: number
) => Promise<Buffer>;

export const SESSION_COOKIE = 'session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_REFRESH_MS = 15 * 24 * 60 * 60 * 1000; // extend when less than 15 days remain
const KEY_LEN = 64;

// ---------- passwords ----------

// Stored format: scrypt$<salt hex>$<hash hex>
export async function hash_password(password: string): Promise<string> {
	const salt = crypto.randomBytes(16);
	const hash = await scrypt(password, salt, KEY_LEN);
	return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verify_password(password: string, stored: string): Promise<boolean> {
	const [algo, salt_hex, hash_hex] = stored.split('$');
	if (algo !== 'scrypt' || !salt_hex || !hash_hex) return false;
	const expected = Buffer.from(hash_hex, 'hex');
	const actual = await scrypt(password, Buffer.from(salt_hex, 'hex'), expected.length);
	return crypto.timingSafeEqual(actual, expected);
}

// ---------- sessions ----------

// Only the SHA-256 of the token is stored, so a DB leak does not expose usable sessions.
const hash_token = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

function set_session_cookie(cookies: Cookies, token: string, expires_at: Date) {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		expires: expires_at
	});
}

export async function create_session(cookies: Cookies, user_id: number) {
	const token = crypto.randomBytes(32).toString('base64url');
	const expires_at = new Date(Date.now() + SESSION_TTL_MS);
	const result = await run_query(
		'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
		[hash_token(token), user_id, expires_at]
	);
	if (!result.success) return result;
	set_session_cookie(cookies, token, expires_at);
	return result;
}

// Returns the logged-in user (without password_hash) or null. One query per request.
export async function get_session_user(cookies: Cookies) {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return null;

	const session_id = hash_token(token);
	const result = await run_query(
		`SELECT s.expires_at, u.id, u.created_at, u.username, u.email
		 FROM sessions s JOIN users u ON u.id = s.user_id
		 WHERE s.id = $1 AND s.expires_at > now()`,
		[session_id]
	);
	if (!result.success || result.data.length === 0) {
		cookies.delete(SESSION_COOKIE, { path: '/' });
		return null;
	}

	const { expires_at, ...user } = result.data[0];

	// sliding expiry
	if (new Date(expires_at).getTime() - Date.now() < SESSION_REFRESH_MS) {
		const new_expires_at = new Date(Date.now() + SESSION_TTL_MS);
		await run_query('UPDATE sessions SET expires_at = $2 WHERE id = $1', [session_id, new_expires_at]);
		set_session_cookie(cookies, token, new_expires_at);
	}

	return user;
}

export async function delete_session(cookies: Cookies) {
	const token = cookies.get(SESSION_COOKIE);
	if (token) {
		await run_query('DELETE FROM sessions WHERE id = $1 OR expires_at < now()', [hash_token(token)]);
	}
	cookies.delete(SESSION_COOKIE, { path: '/' });
}
