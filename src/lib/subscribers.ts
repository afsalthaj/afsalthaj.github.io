import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

export type SubscriberRecord = {
	email: string;
	mentorshipInterest: boolean;
	subscribedAt: string;
};

function isValidEmail(s: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

async function ensureDataDir() {
	await mkdir(DATA_DIR, { recursive: true });
}

export async function readSubscribers(): Promise<SubscriberRecord[]> {
	try {
		const raw = await readFile(SUBSCRIBERS_FILE, 'utf-8');
		const data = JSON.parse(raw) as unknown;
		return Array.isArray(data) ? (data as SubscriberRecord[]) : [];
	} catch (e: unknown) {
		const code =
			e && typeof e === 'object' && 'code' in e ? (e as NodeJS.ErrnoException).code : '';
		if (code === 'ENOENT') return [];
		throw e;
	}
}

export async function addSubscriber(
	emailRaw: string,
	mentorshipInterest: boolean,
): Promise<{ ok: true } | { ok: false; reason: 'invalid_email' | 'duplicate' }> {
	const email = emailRaw.trim().toLowerCase();
	if (!isValidEmail(email)) return { ok: false, reason: 'invalid_email' };

	await ensureDataDir();
	const list = await readSubscribers();
	if (list.some((s) => s.email === email)) {
		return { ok: false, reason: 'duplicate' };
	}

	list.push({
		email,
		mentorshipInterest,
		subscribedAt: new Date().toISOString(),
	});

	await writeFile(SUBSCRIBERS_FILE, JSON.stringify(list, null, '\t'), 'utf-8');
	return { ok: true };
}
