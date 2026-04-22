#!/usr/bin/env node
/**
 * Called from GitHub Actions after deploy when blog content changed.
 * Fetches emails from Supabase (service role) and sends one email per subscriber via Resend.
 *
 * Required env:
 *   SUPABASE_URL          — project URL (no /rest/v1)
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESEND_API_KEY
 *   SITE_URL              — e.g. https://afsalthaj.github.io
 *
 * Optional:
 *   NOTIFY_FROM           — default: "Afsal Thaj <onboarding@resend.dev>" (Resend trial; verify domain for production)
 *   CHANGED_BLOG_FILES    — newline-separated paths (set by workflow). If unset, tries git diff from BEFORE_SHA/AFTER_SHA.
 *   NOTIFY_DRY_RUN        — if "1", log only, no Resend calls
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';

const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const resendKey = process.env.RESEND_API_KEY || '';
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');
const notifyFrom =
	process.env.NOTIFY_FROM || 'Afsal Thaj <onboarding@resend.dev>';
const dryRun = process.env.NOTIFY_DRY_RUN === '1';

function log(...a) {
	console.log('[notify-subscribers]', ...a);
}

function parseTitleFromFile(filePath) {
	const raw = fs.readFileSync(filePath, 'utf8');
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return { title: 'New post', slug: slugFromPath(filePath) };
	const fm = m[1];
	const q = fm.match(/title:\s*['"]([^'"]*)['"]/);
	const plain = fm.match(/title:\s*([^\n]+)/);
	const title = (q?.[1] ?? plain?.[1] ?? 'New post').trim();
	return { title, slug: slugFromPath(filePath) };
}

function slugFromPath(filePath) {
	const base = filePath.split('/').pop() || '';
	return base.replace(/\.(md|mdx)$/i, '');
}

/** 40-char hex SHA or HEAD only — avoids shell injection from env. */
function safeGitRef(ref, fallback = 'HEAD') {
	const t = String(ref || '').trim();
	if (t === 'HEAD') return 'HEAD';
	return /^[0-9a-f]{40}$/i.test(t) ? t : fallback;
}

function listChangedBlogFiles() {
	const explicit = process.env.CHANGED_BLOG_FILES;
	if (explicit && explicit.trim()) {
		return explicit
			.split('\n')
			.map((s) => s.trim())
			.filter(Boolean)
			.filter((p) => /^src\/content\/blog\/.+\.(md|mdx)$/i.test(p));
	}
	const beforeRaw = (process.env.BEFORE_SHA || '').trim();
	const after = safeGitRef(process.env.AFTER_SHA, 'HEAD');
	if (!beforeRaw || /^0{40}$/i.test(beforeRaw)) {
		try {
			const out = execSync(`git diff-tree --no-commit-id --name-only -r ${after}`, {
				encoding: 'utf8',
			});
			return out
				.split('\n')
				.map((s) => s.trim())
				.filter((p) => /^src\/content\/blog\/.+\.(md|mdx)$/i.test(p));
		} catch {
			return [];
		}
	}
	if (!/^[0-9a-f]{40}$/i.test(beforeRaw)) {
		return [];
	}
	try {
		const out = execSync(
			`git diff --diff-filter=AM --name-only ${beforeRaw} ${after}`,
			{ encoding: 'utf8' }
		);
		return out
			.split('\n')
			.map((s) => s.trim())
			.filter((p) => /^src\/content\/blog\/.+\.(md|mdx)$/i.test(p));
	} catch {
		return [];
	}
}

async function fetchSubscribers() {
	const res = await fetch(`${supabaseUrl}/rest/v1/subscribers?select=email`, {
		headers: {
			apikey: serviceKey,
			Authorization: `Bearer ${serviceKey}`,
		},
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Supabase subscribers fetch ${res.status}: ${t}`);
	}
	const rows = await res.json();
	return rows.map((r) => r.email).filter(Boolean);
}

async function sendOne(to, subject, html) {
	if (dryRun) {
		log('DRY RUN would send to', to, subject);
		return;
	}
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${resendKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: notifyFrom,
			to: [to],
			subject,
			html,
		}),
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Resend ${res.status} for ${to}: ${t}`);
	}
}

async function main() {
	const changed = listChangedBlogFiles();
	if (changed.length === 0) {
		log('No added/modified blog posts in this push — skipping.');
		return;
	}

	const first = changed.find((p) => fs.existsSync(p));
	if (!first) {
		log('Changed paths not found on disk — skipping.');
		return;
	}

	if (!supabaseUrl || !serviceKey) {
		log('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — skipping notify.');
		process.exit(0);
	}
	if (!resendKey && !dryRun) {
		log('Missing RESEND_API_KEY — skipping notify.');
		process.exit(0);
	}
	if (!siteUrl) {
		log('Missing SITE_URL — skipping notify.');
		process.exit(0);
	}

	const { title, slug } = parseTitleFromFile(first);
	const postUrl = `${siteUrl}/blog/${encodeURIComponent(slug)}/`;
	const subject = `New post: ${title}`;
	const html = `
<p>There is a new post on the blog.</p>
<p><strong>${escapeHtml(title)}</strong></p>
<p><a href="${postUrl}">Read it here</a></p>
<p style="color:#666;font-size:12px;">You subscribed at ${escapeHtml(siteUrl)}. To stop receiving these, reply and we will remove you, or contact the site owner.</p>
`.trim();

	const emails = await fetchSubscribers();
	if (emails.length === 0) {
		log('No subscribers in database — nothing to send.');
		return;
	}

	log(`Sending "${subject}" to ${emails.length} subscriber(s)…`);
	for (const to of emails) {
		await sendOne(to, subject, html);
		await new Promise((r) => setTimeout(r, 550));
	}
	log('Done.');
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
