import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { renderMatchDigestEmail } from '@/lib/email/match-digest'

// Use Vercel cron or call manually: GET /api/cron/notify-matches
// Protected by CRON_SECRET env variable.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = new Resend(process.env.RESEND_API_KEY)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://winly-six.vercel.app'

  // Fetch users due for notification:
  // - digest enabled
  // - not notified in the last 20 hours (handles timezone drift for daily sends)
  const cutoff = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  const { data: prefs, error: prefsError } = await supabase
    .from('notification_preferences')
    .select('client_id, min_score_threshold, clients(name, email)')
    .eq('email_digest_enabled', true)
    .or(`last_notified_at.is.null,last_notified_at.lt.${cutoff}`)

  if (prefsError) {
    console.error('Failed to fetch notification preferences:', prefsError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  let totalSent = 0
  const errors: string[] = []

  for (const pref of prefs ?? []) {
    const clientData = pref.clients
    const client = (Array.isArray(clientData) ? clientData[0] : clientData) as { name: string; email: string } | null
    if (!client?.email) continue

    // Fetch top matches for this user (active, not dismissed, above threshold)
    const { data: matches } = await supabase
      .from('tender_matches')
      .select(`
        match_score,
        win_probability,
        tender_id,
        tender_uuid,
        tenders (
          title,
          buyer_name,
          estimated_value,
          currency,
          submission_deadline
        )
      `)
      .eq('client_id', pref.client_id)
      .eq('is_dismissed', false)
      .gte('match_score', pref.min_score_threshold)
      .order('match_score', { ascending: false })
      .limit(5)

    if (!matches || matches.length === 0) continue

    const formattedMatches = matches.map((m) => {
      const tenderData = m.tenders
      const t = (Array.isArray(tenderData) ? tenderData[0] : tenderData) as {
        title: string
        buyer_name: string
        estimated_value: number | null
        currency: string | null
        submission_deadline: string | null
      } | null

      const value = t?.estimated_value
        ? new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: t.currency ?? 'EUR',
            maximumFractionDigits: 0,
          }).format(t.estimated_value)
        : 'Value TBD'

      const deadline = t?.submission_deadline
        ? new Date(t.submission_deadline).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'TBD'

      return {
        title: t?.title ?? 'Untitled tender',
        buyer: t?.buyer_name ?? 'Unknown buyer',
        value,
        deadline,
        score: Math.round(m.match_score ?? 0),
        tenderUuid: m.tender_uuid,
      }
    })

    try {
      await resend.emails.send({
        // TODO: switch to 'Winly <notifications@winly.ai>' once DNS is verified
        from: 'Winly <onboarding@resend.dev>',
        to: client.email,
        subject: `${formattedMatches.length} new procurement ${formattedMatches.length === 1 ? 'match' : 'matches'} found`,
        html: renderMatchDigestEmail({
          userName: client.name,
          matches: formattedMatches,
          dashboardUrl: appUrl,
        }),
      })

      // Update last_notified_at
      await supabase
        .from('notification_preferences')
        .update({ last_notified_at: new Date().toISOString() })
        .eq('client_id', pref.client_id)

      // Log the send
      await supabase.from('notification_log').insert({
        client_id: pref.client_id,
        email: client.email,
        matches_count: formattedMatches.length,
      })

      totalSent++
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`Failed to send email to ${client.email}:`, message)
      errors.push(`${client.email}: ${message}`)
    }
  }

  return NextResponse.json({
    sent: totalSent,
    errors: errors.length > 0 ? errors : undefined,
  })
}
