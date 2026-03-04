import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase.from('market_overview').select('count').limit(1).single()
    
    if (error) throw error
    
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 503 }
    )
  }
}
