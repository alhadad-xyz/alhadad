import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    
    // Fetch counts for all collections
    const [projects, blogPosts, media] = await Promise.all([
      payload.find({
        collection: 'projects',
        limit: 0, // Only get count
      }),
      payload.find({
        collection: 'blog-posts',
        limit: 0,
      }),
      payload.find({
        collection: 'media',
        limit: 0,
      })
    ])

    // Get published/draft counts for projects
    const publishedProjects = await payload.find({
      collection: 'projects',
      where: {
        status: {
          equals: 'published'
        }
      },
      limit: 0,
    })

    const draftProjects = await payload.find({
      collection: 'projects',
      where: {
        status: {
          equals: 'draft'
        }
      },
      limit: 0,
    })

    const stats = {
      projects: projects.totalDocs,
      blogPosts: blogPosts.totalDocs,
      media: media.totalDocs,
      publishedProjects: publishedProjects.totalDocs,
      draftProjects: draftProjects.totalDocs,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    // Return mock stats if CMS is not available
    return NextResponse.json({
      projects: 2,
      blogPosts: 1,
      media: 12,
      publishedProjects: 1,
      draftProjects: 1,
    })
  }
} 