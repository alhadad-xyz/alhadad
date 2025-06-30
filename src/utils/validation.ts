import type { Project, BlogPost, Media } from '../../payload-types'

// Content validation utilities
export const validation = {
  // Validate required fields for projects
  project: {
    isValid(project: Partial<Project>): boolean {
      return !!(
        project.title &&
        project.year &&
        project.category &&
        project.featuredImage
      )
    },

    validate(project: Partial<Project>): ValidationResult {
      const errors: string[] = []

      if (!project.title) errors.push('Title is required')
      if (!project.year) errors.push('Year is required')
      if (!project.category) errors.push('Category is required')
      if (!project.featuredImage) errors.push('Featured image is required')

      // Validate year format
      if (project.year && !/^\d{4}$/.test(project.year)) {
        errors.push('Year must be a 4-digit number')
      }

      // Validate URLs if provided
      if (project.liveUrl && !this.isValidUrl(project.liveUrl)) {
        errors.push('Live URL must be a valid URL')
      }
      
      if (project.githubUrl && !this.isValidUrl(project.githubUrl)) {
        errors.push('GitHub URL must be a valid URL')
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings: this.getProjectWarnings(project),
      }
    },

    getProjectWarnings(project: Partial<Project>): string[] {
      const warnings: string[] = []

      if (!project.description) {
        warnings.push('Description is recommended for better SEO')
      }

      if (!project.previewImage) {
        warnings.push('Preview image is recommended for hover effects')
      }

      if (!project.technologies || project.technologies.length === 0) {
        warnings.push('Technologies list helps visitors understand your skills')
      }

      if (!project.seoData?.description) {
        warnings.push('SEO description is recommended for search engines')
      }

      return warnings
    },

    isValidUrl(url: string): boolean {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    },
  },

  // Validate blog posts
  blogPost: {
    isValid(post: Partial<BlogPost>): boolean {
      return !!(
        post.title &&
        post.content
      )
    },

    validate(post: Partial<BlogPost>): ValidationResult {
      const errors: string[] = []

      if (!post.title) errors.push('Title is required')
      if (!post.content) errors.push('Content is required')

      // Validate slug format if provided
      if (post.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
        errors.push('Slug must be lowercase letters, numbers, and hyphens only')
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings: this.getBlogPostWarnings(post),
      }
    },

    getBlogPostWarnings(post: Partial<BlogPost>): string[] {
      const warnings: string[] = []

      if (!post.excerpt) {
        warnings.push('Excerpt is recommended for blog listing pages')
      }

      if (!post.featuredImage) {
        warnings.push('Featured image is recommended for social sharing')
      }

      if (!post.categories || post.categories.length === 0) {
        warnings.push('Categories help organize your content')
      }

      if (!post.tags || post.tags.length === 0) {
        warnings.push('Tags improve content discoverability')
      }

      if (!post.seoData?.description) {
        warnings.push('SEO description is recommended for search engines')
      }

      return warnings
    },
  },

  // Validate media files
  media: {
    isValid(media: Partial<Media>): boolean {
      return !!(media.alt)
    },

    validate(media: Partial<Media>): ValidationResult {
      const errors: string[] = []

      if (!media.alt) {
        errors.push('Alt text is required for accessibility')
      }

      // Validate alt text quality
      if (media.alt) {
        if (media.alt.length < 10) {
          errors.push('Alt text should be at least 10 characters for better accessibility')
        }
        
        if (media.alt.length > 125) {
          errors.push('Alt text should be under 125 characters for optimal screen reader experience')
        }

        // Check for poor alt text patterns
        const poorAltPatterns = [
          /^image$/i,
          /^picture$/i,
          /^photo$/i,
          /^img$/i,
          /^screenshot$/i,
        ]

        if (poorAltPatterns.some(pattern => pattern.test(media.alt!))) {
          errors.push('Alt text should describe the content of the image, not just that it is an image')
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings: this.getMediaWarnings(media),
      }
    },

    getMediaWarnings(media: Partial<Media>): string[] {
      const warnings: string[] = []

      if (!media.caption) {
        warnings.push('Caption helps provide additional context for images')
      }

      if (!media.tags || media.tags.length === 0) {
        warnings.push('Tags help organize and find images in the media library')
      }

      // File size warnings (if filesize is available)
      if (media.filesize) {
        const sizeMB = media.filesize / (1024 * 1024)
        
        if (sizeMB > 2) {
          warnings.push(`Image is ${sizeMB.toFixed(1)}MB - consider optimizing for better performance`)
        }
        
        if (sizeMB > 5) {
          warnings.push('Image is very large and may significantly impact page load times')
        }
      }

      // Dimension warnings
      if (media.width && media.height) {
        if (media.width > 2400 || media.height > 2400) {
          warnings.push('Image dimensions are very large - consider resizing for web use')
        }
      }

      return warnings
    },

    // Validate image file types
    isValidImageType(filename: string): boolean {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg']
      const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
      return validExtensions.includes(extension)
    },

    // Get recommended image sizes for different use cases
    getRecommendedSize(useCase: 'featured' | 'preview' | 'gallery' | 'profile' | 'hero'): ImageSizeRecommendation {
      const recommendations = {
        featured: { width: 800, height: 600, aspectRatio: '4:3', description: 'Main project showcase image' },
        preview: { width: 800, height: 600, aspectRatio: '4:3', description: 'Hover preview image (same as featured)' },
        gallery: { width: 1200, height: 800, aspectRatio: '3:2', description: 'High-quality gallery image' },
        profile: { width: 400, height: 400, aspectRatio: '1:1', description: 'Square profile photo' },
        hero: { width: 1920, height: 1080, aspectRatio: '16:9', description: 'Hero section background' },
      }

      return recommendations[useCase]
    },
  },

  // Content structure validation
  content: {
    // Validate rich text content has actual content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasContent(richText: any): boolean {
      if (!richText) return false
      
      // Check if it's a string with content
      if (typeof richText === 'string') {
        return richText.trim().length > 0
      }

      // Check if it's a rich text object with content
      if (richText.root && richText.root.children) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return richText.root.children.some((child: any) => 
          child.text && child.text.trim().length > 0
        )
      }

      return false
    },

    // Extract plain text length from rich text
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTextLength(richText: any): number {
      if (!richText) return 0
      
      if (typeof richText === 'string') {
        return richText.trim().length
      }

      if (richText.root && richText.root.children) {
        return richText.root.children
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((child: any) => child.text || '')
          .join('')
          .trim()
          .length
      }

      return 0
    },

    // Validate content meets minimum length requirements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateLength(richText: any, minLength: number = 50): ValidationResult {
      const length = this.getTextLength(richText)
      
      return {
        isValid: length >= minLength,
        errors: length < minLength ? [`Content must be at least ${minLength} characters`] : [],
        warnings: [],
      }
    },
  },

  // SEO validation utilities
  seo: {
    validateTitle(title: string): ValidationResult {
      const errors: string[] = []
      const warnings: string[] = []

      if (!title) {
        errors.push('SEO title is required')
      } else {
        if (title.length < 30) {
          warnings.push('SEO title is quite short - consider expanding for better search visibility')
        }
        
        if (title.length > 60) {
          errors.push('SEO title is too long - may be truncated in search results')
        }
      }

      return { isValid: errors.length === 0, errors, warnings }
    },

    validateDescription(description: string): ValidationResult {
      const errors: string[] = []
      const warnings: string[] = []

      if (!description) {
        errors.push('SEO description is required')
      } else {
        if (description.length < 120) {
          warnings.push('SEO description is quite short - consider expanding for better search visibility')
        }
        
        if (description.length > 160) {
          errors.push('SEO description is too long - may be truncated in search results')
        }
      }

      return { isValid: errors.length === 0, errors, warnings }
    },

    validateKeywords(keywords: string[]): ValidationResult {
      const warnings: string[] = []

      if (keywords.length === 0) {
        warnings.push('Consider adding keywords for better content organization')
      }

      if (keywords.length > 10) {
        warnings.push('Consider reducing keywords - quality over quantity')
      }

      return { isValid: true, errors: [], warnings }
    },
  },
}

// Type definitions
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ImageSizeRecommendation {
  width: number
  height: number
  aspectRatio: string
  description: string
}

// Form validation helpers
export const formValidation = {
  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate required fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validateRequired(fields: Record<string, any>): ValidationResult {
    const errors = Object.entries(fields)
      .filter(([, value]) => !value || (typeof value === 'string' && !value.trim()))
      .map(([field]) => `${field} is required`)

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    }
  },

  // Sanitize text input
  sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[<>]/g, '') // Remove potential HTML tags
  },

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  },
}

// Content transformation utilities
export const contentTransform = {
  // Transform rich text to plain text preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  richTextToPreview(richText: any, maxLength: number = 150): string {
    if (!richText) return ''
    
    let text = ''
    
    if (typeof richText === 'string') {
      text = richText
    } else if (richText.root && richText.root.children) {
      text = richText.root.children
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((child: any) => child.text || '')
        .join(' ')
    }

    text = text.trim()
    
    if (text.length > maxLength) {
      text = text.substring(0, maxLength).trim() + '...'
    }
    
    return text
  },

  // Extract first image from rich text content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  extractFirstImage(_richText: any): string | null {
    // This would need to be implemented based on the rich text structure
    // For now, return null as we'd need to parse the Lexical editor format
    return null
  },

  // Count words in rich text
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countWords(richText: any): number {
    const text = this.richTextToPreview(richText, Infinity)
    return text.split(/\s+/).filter(word => word.length > 0).length
  },

  // Estimate reading time
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  estimateReadingTime(richText: any): number {
    const wordCount = this.countWords(richText)
    const wordsPerMinute = 200 // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute)
  },
} 