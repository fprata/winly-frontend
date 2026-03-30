import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 2000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, message } = body as Record<string, unknown>;

    if (typeof name !== 'string' || !name.trim() || name.length > NAME_MAX) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (typeof email !== 'string' || !isValidEmail(email) || email.length > EMAIL_MAX) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (typeof message !== 'string' || !message.trim() || message.length > MESSAGE_MAX) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const internalTo = process.env.CONTACT_FORM_TO_EMAIL || 'support.winly@winly.me';
    const fromAddress = process.env.NOTIFY_FROM_EMAIL || 'Winly <onboarding@resend.dev>';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: fromAddress,
      to: internalTo,
      replyTo: email.trim(),
      subject: `Contact form: message from ${name.trim()}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
        <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message.trim()).replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[ContactAPI] Failed to send contact email:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
