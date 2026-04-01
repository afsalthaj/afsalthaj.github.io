import type { APIRoute } from 'astro';
import { addSubscriber } from '../../lib/subscribers';

export const prerender = false;

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const POST: APIRoute = async ({ request }) => {
	const ct = request.headers.get('content-type') ?? '';
	let email = '';
	let mentorshipInterest = false;

	try {
		if (ct.includes('application/json')) {
			const body = (await request.json()) as Record<string, unknown>;
			email = String(body.email ?? '');
			mentorshipInterest = Boolean(body.mentorshipInterest);
		} else {
			const fd = await request.formData();
			email = String(fd.get('email') ?? '');
			mentorshipInterest =
				fd.get('mentorship') === 'on' ||
				fd.get('mentorshipInterest') === 'true' ||
				fd.get('mentorshipInterest') === 'on';
		}
	} catch {
		return json({ ok: false, error: 'bad_request' }, 400);
	}

	const result = await addSubscriber(email, mentorshipInterest);
	if (!result.ok) {
		if (result.reason === 'invalid_email') {
			return json({ ok: false, error: 'invalid_email' }, 400);
		}
		return json({ ok: false, error: 'duplicate' }, 409);
	}

	return json({ ok: true });
};
