import { NextResponse } from 'next/server'
import { getFeaturedProjects } from '@/lib/payload-client'

export async function GET() {
  try {
    // Check if database is available
    if (!process.env.SUPABASE_DATABASE_URL) {
      console.warn('SUPABASE_DATABASE_URL not configured, returning fallback projects')
      return NextResponse.json([
        {
          id: 'fallback-1',
          title: 'Sample Project 1',
          slug: 'sample-project-1',
          description: 'A sample project to demonstrate the portfolio',
          year: '2024',
          category: 'web',
          status: 'published',
          featuredImage: {
            url: '/images/projects/project-1.jpg',
            alt: 'Sample Project 1'
          }
        },
        {
          id: 'fallback-2',
          title: 'Sample Project 2',
          slug: 'sample-project-2',
          description: 'Another sample project for demonstration',
          year: '2023',
          category: 'mobile',
          status: 'published',
          featuredImage: {
            url: '/images/projects/project-2.jpg',
            alt: 'Sample Project 2'
          }
        }
      ], { status: 200 })
    }

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 10000)
    )
    
    const projectsPromise = getFeaturedProjects(4)
    const featuredProjects = await Promise.race([projectsPromise, timeoutPromise]) as any[]

    return NextResponse.json(featuredProjects)
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    
    // Return fallback projects on error
    return NextResponse.json([
      {
        id: 'fallback-1',
        title: 'Sample Project 1',
        slug: 'sample-project-1',
        description: 'A sample project to demonstrate the portfolio',
        year: '2024',
        category: 'web',
        status: 'published',
        featuredImage: {
          url: '/images/projects/project-1.jpg',
          alt: 'Sample Project 1'
        }
      },
      {
        id: 'fallback-2',
        title: 'Sample Project 2',
        slug: 'sample-project-2',
        description: 'Another sample project for demonstration',
        year: '2023',
        category: 'mobile',
        status: 'published',
        featuredImage: {
          url: '/images/projects/project-2.jpg',
          alt: 'Sample Project 2'
        }
      }
    ], { status: 200 }) // Ensure we return 200 even on error
  }
} 