/**
 * Browser-only: calls Supabase PostgREST with the anon key.
 * No @supabase/supabase-js dependency (keeps the bundle small).
 */
export function getEngagementConfig(): { url: string; key: string } | null {
	const raw = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
	const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();
	if (!raw || !key) return null;
	// One canonical base: no trailing slash (avoids //rest in URLs)
	const url = raw.replace(/\/+$/, '');
	return { url, key };
}

const headers = (key: string) => ({
	apikey: key,
	Authorization: `Bearer ${key}`,
	'Content-Type': 'application/json',
});

export async function fetchPostLikeCount(
	baseUrl: string,
	anonKey: string,
	slug: string
): Promise<number> {
	try {
		const res = await fetch(
			`${baseUrl}/rest/v1/post_likes?slug=eq.${encodeURIComponent(slug)}&select=count`,
			{ headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
		);
		if (!res.ok) return 0;
		const rows: { count: number }[] = await res.json();
		return rows[0]?.count ?? 0;
	} catch {
		return 0;
	}
}

export async function incrementPostLike(
	baseUrl: string,
	anonKey: string,
	slug: string
): Promise<boolean> {
	try {
		const res = await fetch(`${baseUrl}/rest/v1/rpc/increment_post_like`, {
			method: 'POST',
			headers: { ...headers(anonKey), Prefer: 'return=minimal' },
			body: JSON.stringify({ p_slug: slug }),
		});
		return res.ok;
	} catch {
		return false;
	}
}

export async function insertSubscriber(
	baseUrl: string,
	anonKey: string,
	email: string
): Promise<'ok' | 'duplicate' | 'error'> {
	try {
		const res = await fetch(`${baseUrl}/rest/v1/subscribers`, {
			method: 'POST',
			headers: {
				...headers(anonKey),
				Prefer: 'return=minimal',
				Accept: 'application/json',
			},
			body: JSON.stringify({ email: email.trim().toLowerCase() }),
		});
		if (res.ok) return 'ok';
		const t = await res.text();
		// PostgREST: unique_violation often comes as 409 or 400 with 23505 in body
		if (
			res.status === 409 ||
			/23505|duplicate|unique/i.test(t)
		) {
			return 'duplicate';
		}
		return 'error';
	} catch {
		return 'error';
	}
}
