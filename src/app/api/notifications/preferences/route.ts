import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/notifications/preferences — fetch current user's notification prefs
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!client) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('email_digest_enabled, min_score_threshold')
    .eq('client_id', client.id)
    .single()

  // Return defaults if no row yet
  return NextResponse.json(prefs ?? { email_digest_enabled: true, min_score_threshold: 60 })
}

// PATCH /api/notifications/preferences — update notification prefs
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { email_digest_enabled, min_score_threshold } = body

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!client) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { error } = await supabase
    .from('notification_preferences')
    .upsert({
      client_id: client.id,
      email_digest_enabled,
      min_score_threshold,
    }, { onConflict: 'client_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
