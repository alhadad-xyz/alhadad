import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.SUPABASE_DATABASE_URL,
      hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    // Check if all required env vars are present
    const allEnvVarsPresent = Object.values(envCheck).every(Boolean)

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      environmentVariables: envCheck,
      allEnvironmentVariablesPresent: allEnvVarsPresent,
      message: allEnvVarsPresent 
        ? 'All environment variables are configured' 
        : 'Some environment variables are missing'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 