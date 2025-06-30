import { getPayload } from 'payload'
import type { Media, Project, BlogPost, Homepage, About, Contact, SiteSetting } from '../../payload-types'
import config from '../../payload.config'

// Initialize Payload client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let payload: any = null

async function getPayloadClient() {
  if (!payload) {
    payload = await getPayload({
      config,
    })
  }
  return payload
}

// Type-safe data fetching utilities
export const payloadAPI = {
  // Projects Collection
  projects: {
    // Get all published projects ordered by displayOrder
    async getAll(): Promise<Project[]> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'projects',
          where: {
            status: {
              equals: 'published',
            },
          },
          sort: 'displayOrder',
          limit: 100,
          populate: {
            featuredImage: true,
            previewImage: true,
            gallery: true,
          },
        })
        return result.docs
      } catch (error) {
        console.error('Error fetching projects:', error)
        return []
      }
    },

    // Get featured projects for homepage
    async getFeatured(limit: number = 4): Promise<Project[]> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'projects',
          where: {
            status: {
              equals: 'published',
            },
          },
          sort: 'displayOrder',
          limit,
          populate: {
            featuredImage: true,
            previewImage: true,
          },
        })
        return result.docs
      } catch (error) {
        console.error('Error fetching featured projects:', error)
        return []
      }
    },

    // Get single project by slug
    async getBySlug(slug: string): Promise<Project | null> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'projects',
          where: {
            slug: {
              equals: slug,
            },
            status: {
              equals: 'published',
            },
          },
          limit: 1,
          populate: {
            featuredImage: true,
            previewImage: true,
            gallery: true,
          },
        })
        return result.docs[0] || null
      } catch (error) {
        console.error(`Error fetching project with slug ${slug}:`, error)
        return null
      }
    },

    // Get projects by category
    async getByCategory(category: string): Promise<Project[]> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'projects',
          where: {
            category: {
              equals: category,
            },
            status: {
              equals: 'published',
            },
          },
          sort: 'displayOrder',
          limit: 100,
          populate: {
            featuredImage: true,
            previewImage: true,
          },
        })
        return result.docs
      } catch (error) {
        console.error(`Error fetching projects by category ${category}:`, error)
        return []
      }
    },
  },

  // Blog Posts Collection
  blog: {
    // Get all published blog posts
    async getAll(limit: number = 20): Promise<BlogPost[]> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'blog-posts',
          where: {
            status: {
              equals: 'published',
            },
          },
          sort: '-publishedAt',
          limit,
          populate: {
            featuredImage: true,
          },
        })
        return result.docs
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        return []
      }
    },

    // Get single blog post by slug
    async getBySlug(slug: string): Promise<BlogPost | null> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'blog-posts',
          where: {
            slug: {
              equals: slug,
            },
            status: {
              equals: 'published',
            },
          },
          limit: 1,
          populate: {
            featuredImage: true,
          },
        })
        return result.docs[0] || null
      } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error)
        return null
      }
    },

    // Get recent blog posts for homepage
    async getRecent(limit: number = 3): Promise<BlogPost[]> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'blog-posts',
          where: {
            status: {
              equals: 'published',
            },
          },
          sort: '-publishedAt',
          limit,
          populate: {
            featuredImage: true,
          },
        })
        return result.docs
      } catch (error) {
        console.error('Error fetching recent blog posts:', error)
        return []
      }
    },
  },

  // Media Collection
  media: {
    // Get media by ID with optimized sizes
    async getById(id: string): Promise<Media | null> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.findByID({
          collection: 'media',
          id,
        })
        return result
      } catch (error) {
        console.error(`Error fetching media with ID ${id}:`, error)
        return null
      }
    },

    // Get media by tag
    async getByTag(tag: string): Promise<Media[]> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'media',
          where: {
            'tags.tag': {
              contains: tag,
            },
          },
          limit: 100,
        })
        return result.docs
      } catch (error) {
        console.error(`Error fetching media by tag ${tag}:`, error)
        return []
      }
    },
  },

  // Global Content
  globals: {
    // Get homepage content
    async getHomepage(): Promise<Homepage | null> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.findGlobal({
          slug: 'homepage',
          populate: {
            heroImage: true,
            featuredProjects: {
              populate: {
                featuredImage: true,
                previewImage: true,
              },
            },
          },
        })
        return result
      } catch (error) {
        console.error('Error fetching homepage content:', error)
        return null
      }
    },

    // Get about content
    async getAbout(): Promise<About | null> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.findGlobal({
          slug: 'about',
          populate: {
            profileImage: true,
          },
        })
        return result
      } catch (error) {
        console.error('Error fetching about content:', error)
        return null
      }
    },

    // Get contact content
    async getContact(): Promise<Contact | null> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.findGlobal({
          slug: 'contact',
        })
        return result
      } catch (error) {
        console.error('Error fetching contact content:', error)
        return null
      }
    },

    // Get site settings
    async getSiteSettings(): Promise<SiteSetting | null> {
      try {
        const payload = await getPayloadClient()
        const result = await payload.findGlobal({
          slug: 'site-settings',
          populate: {
            defaultOgImage: true,
          },
        })
        return result
      } catch (error) {
        console.error('Error fetching site settings:', error)
        return null
      }
    },
  },
}

// Utility functions for common operations
export const payloadUtils = {
  // Extract media URL with size optimization
  getMediaUrl(media: Media | string | null, size?: 'thumbnail' | 'small' | 'medium' | 'large'): string {
    if (!media) return '/images/placeholder.jpg'
    
    if (typeof media === 'string') {
      return media
    }

    // Use optimized size if available
    if (size && media.sizes && media.sizes[size]) {
      return media.sizes[size].url || media.url || '/images/placeholder.jpg'
    }

    return media.url || '/images/placeholder.jpg'
  },

  // Extract alt text from media
  getMediaAlt(media: Media | string | null): string {
    if (!media || typeof media === 'string') return 'Image'
    return media.alt || 'Image'
  },

  // Format date for display
  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  },

  // Extract rich text content as plain text
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractTextFromRichText(richText: any): string {
    if (!richText) return ''
    
    // This is a simplified extraction - in a real app you'd want a proper rich text parser
    if (typeof richText === 'string') return richText
    if (richText.html) return richText.html.replace(/<[^>]*>/g, '')
    if (richText.text) return richText.text
    
    return ''
  },

  // Generate SEO metadata from content
  generateSEOMetadata(item: Project | BlogPost | Homepage | About | Contact, fallbackDescription?: string) {
    // Only Project and BlogPost have seoData
    const seoData = 'seoData' in item ? item.seoData : null
    const title = seoData?.title || ('title' in item ? item.title : 'Portfolio')
    const description = seoData?.description || 
      ('excerpt' in item ? item.excerpt : '') || 
      ('description' in item ? item.description : '') ||
      fallbackDescription ||
      'Creative portfolio and blog'

    const ogImage = (seoData && 'ogImage' in seoData && seoData.ogImage) ? 
      this.getMediaUrl(seoData.ogImage as Media, 'large') : 
      '/images/og-default.jpg'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImage }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  },
}

// Error handling wrapper for data fetching
export async function safeDataFetch<T>(
  fetchFunction: () => Promise<T>,
  fallback: T,
  errorMessage: string = 'Data fetch failed'
): Promise<T> {
  try {
    return await fetchFunction()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return fallback
  }
}

// Cache utilities for static generation and ISR
export const cacheUtils = {
  // Cache tags for different content types
  tags: {
    projects: 'projects',
    blogPosts: 'blog-posts',
    homepage: 'homepage',
    about: 'about',
    contact: 'contact',
    siteSettings: 'site-settings',
    media: 'media',
  },

  // Revalidation periods (in seconds)
  revalidate: {
    static: false, // Never revalidate static content
    hourly: 3600, // 1 hour
    daily: 86400, // 24 hours
    weekly: 604800, // 7 days
  },
} 