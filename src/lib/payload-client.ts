import { getPayload } from 'payload'
import config from '../../payload.config'
import type { Payload } from 'payload'

// Initialize Payload client for server-side data fetching
let cachedPayload: Payload | null = null
let connectionError: boolean = false
let lastConnectionAttempt: number = 0
const CONNECTION_RETRY_DELAY = 30000 // 30 seconds

export async function getPayloadClient() {
  const now = Date.now()

  // If we had a connection error recently, don't retry immediately
  if (connectionError && (now - lastConnectionAttempt) < CONNECTION_RETRY_DELAY) {
    throw new Error('Database connection failed - retry later')
  }

  if (cachedPayload) {
    return cachedPayload
  }

  try {
    lastConnectionAttempt = now
    connectionError = false

    // Check if required environment variables are present
    if (!process.env.SUPABASE_DATABASE_URL) {
      console.error('SUPABASE_DATABASE_URL environment variable is not set')
      connectionError = true
      throw new Error('Database configuration missing')
    }

    cachedPayload = await getPayload({ config })
    return cachedPayload
  } catch (error) {
    console.error('Failed to initialize Payload client:', error)
    connectionError = true
    throw error
  }
}

// Content fetching functions for different collections
export async function getHomepageContent() {
  try {
    const payload = await getPayloadClient()
    const homepage = await payload.findGlobal({
      slug: 'homepage',
    })
    return homepage
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return null
  }
}

export async function getFeaturedProjects(limit = 4) {
  try {
    const payload = await getPayloadClient()
    const projects = await payload.find({
      collection: 'projects',
      where: {
        status: {
          equals: 'published'
        }
      },
      sort: '-year',
      limit,
      depth: 2, // Include related media
    })
    return projects.docs
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
}

export async function getAllProjects() {
  try {
    const payload = await getPayloadClient()
    const projects = await payload.find({
      collection: 'projects',
      where: {
        status: {
          equals: 'published'
        }
      },
      sort: '-year',
      depth: 2,
    })
    return projects.docs
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return []
  }
}

export async function getAllProjectsForDashboard() {
  try {
    const payload = await getPayloadClient()
    const projects = await payload.find({
      collection: 'projects',
      // No status filter - show all projects (published, draft, archived)
      sort: ['-updatedAt', '-year'], // Sort by last updated first, then by year
      depth: 2,
    })
    return projects.docs
  } catch (error) {
    console.error('Error fetching all projects for dashboard:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const projects = await payload.find({
      collection: 'projects',
      where: {
        slug: {
          equals: slug
        }
      },
      limit: 1,
      depth: 2,
    })
    return projects.docs[0] || null
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
}

export async function getBlogPosts(limit?: number) {
  try {
    const payload = await getPayloadClient()
    const posts = await payload.find({
      collection: 'blog-posts',
      where: {
        status: {
          equals: 'published'
        }
      },
      sort: '-publishedDate',
      limit,
      depth: 2,
    })
    return posts.docs
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const posts = await payload.find({
      collection: 'blog-posts',
      where: {
        slug: {
          equals: slug
        }
      },
      limit: 1,
      depth: 2,
    })
    return posts.docs[0] || null
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    return null
  }
}

export async function getAboutContent() {
  try {
    const payload = await getPayloadClient()
    const about = await payload.findGlobal({
      slug: 'about',
    })
    return about
  } catch (error) {
    console.error('Error fetching about content:', error)
    return null
  }
}

export async function getContactContent() {
  try {
    const payload = await getPayloadClient()
    const contact = await payload.findGlobal({
      slug: 'contact',
    })
    return contact
  } catch (error) {
    console.error('Error fetching contact content:', error)
    return null
  }
}

export async function getSiteSettings() {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({
      slug: 'site-settings',
    })
    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
} 