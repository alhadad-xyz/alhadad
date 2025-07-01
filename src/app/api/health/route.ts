import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET() {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      configured: !!process.env.SUPABASE_DATABASE_URL,
      connected: false,
      error: null as string | null
    },
    services: {
      payload: false,
      supabase: false
    }
  }

  try {
    // Check if database URL is configured
    if (!process.env.SUPABASE_DATABASE_URL) {
      healthStatus.status = 'degraded'
      healthStatus.database.error = 'SUPABASE_DATABASE_URL not configured'
      return NextResponse.json(healthStatus, { status: 200 })
    }

    healthStatus.database.configured = true

    // Test database connection with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 5000)
    )

    const connectionPromise = getPayloadClient()
    
    try {
      const payload = await Promise.race([connectionPromise, timeoutPromise])
      
      // Test a simple query
      await payload.findGlobal({ slug: 'site-settings' })
      
      healthStatus.database.connected = true
      healthStatus.services.payload = true
      healthStatus.services.supabase = true
      
    } catch (dbError) {
      healthStatus.status = 'unhealthy'
      healthStatus.database.error = dbError instanceof Error ? dbError.message : 'Unknown database error'
      healthStatus.services.payload = false
      healthStatus.services.supabase = false
    }

  } catch (error) {
    healthStatus.status = 'unhealthy'
    healthStatus.database.error = error instanceof Error ? error.message : 'Unknown error'
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 
                    healthStatus.status === 'degraded' ? 200 : 503

  return NextResponse.json(healthStatus, { status: statusCode })
} 