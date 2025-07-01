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
      tablesExist: false,
      error: null as string | null
    },
    services: {
      payload: false,
      supabase: false
    },
    recommendations: [] as string[]
  }

  try {
    // Check if database URL is configured
    if (!process.env.SUPABASE_DATABASE_URL) {
      healthStatus.status = 'degraded'
      healthStatus.database.error = 'SUPABASE_DATABASE_URL not configured'
      healthStatus.recommendations.push('Add SUPABASE_DATABASE_URL to environment variables')
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
      
      // Test if tables exist by trying to query them
      try {
        await payload.findGlobal({ slug: 'site-settings' })
        healthStatus.database.tablesExist = true
        healthStatus.database.connected = true
        healthStatus.services.payload = true
        healthStatus.services.supabase = true
      } catch (tableError) {
        const errorMessage = tableError instanceof Error ? tableError.message : 'Unknown error'
        
        if (errorMessage.includes('relation "site_settings" does not exist') || 
            errorMessage.includes('table "site_settings" does not exist')) {
          healthStatus.status = 'degraded'
          healthStatus.database.connected = true // Connection works, but tables don't exist
          healthStatus.database.tablesExist = false
          healthStatus.database.error = 'Database tables not initialized'
          healthStatus.services.payload = false
          healthStatus.services.supabase = true
          healthStatus.recommendations.push('Run Payload migrations to create database tables')
          healthStatus.recommendations.push('Use: npx payload migrate:create')
          healthStatus.recommendations.push('Then: npx payload migrate')
        } else {
          healthStatus.status = 'unhealthy'
          healthStatus.database.error = errorMessage
          healthStatus.services.payload = false
          healthStatus.services.supabase = false
        }
      }
      
    } catch (dbError) {
      healthStatus.status = 'unhealthy'
      healthStatus.database.error = dbError instanceof Error ? dbError.message : 'Unknown database error'
      healthStatus.services.payload = false
      healthStatus.services.supabase = false
      
      if (dbError instanceof Error && dbError.message.includes('connection')) {
        healthStatus.recommendations.push('Check Supabase project status')
        healthStatus.recommendations.push('Verify database connection string')
        healthStatus.recommendations.push('Check network connectivity')
      }
    }

  } catch (error) {
    healthStatus.status = 'unhealthy'
    healthStatus.database.error = error instanceof Error ? error.message : 'Unknown error'
  }

  const statusCode = healthStatus.status === 'healthy' ? 200 : 
                    healthStatus.status === 'degraded' ? 200 : 503

  return NextResponse.json(healthStatus, { status: statusCode })
} 