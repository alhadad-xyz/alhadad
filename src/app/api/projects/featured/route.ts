import { NextResponse } from 'next/server'
import { getFeaturedProjects } from '@/lib/payload-client'

export async function GET() {
  try {
    const featuredProjects = await getFeaturedProjects(4)
    return NextResponse.json(featuredProjects)
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    
    // Return empty array on error with 200 status
    return NextResponse.json([], { status: 200 })
  }
} 