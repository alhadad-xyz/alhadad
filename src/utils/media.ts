/**
 * Media Upload and Naming Utilities
 * Handles proper image naming, slugification, and display across the portfolio
 */

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Generates a clean filename from a custom name and original filename
 */
export function generateFilename(customName: string, originalFilename: string): string {
  const extension = getFileExtension(originalFilename)
  const timestamp = Date.now()
  
  if (customName && customName.trim()) {
    const cleanName = slugify(customName)
    return `${cleanName}-${timestamp}.${extension}`
  }
  
  // Fallback to slugified original filename
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '')
  const cleanName = slugify(nameWithoutExt)
  return `${cleanName}-${timestamp}.${extension}`
}

/**
 * Extracts file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'jpg'
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Gets display name for media (uses alt text or filename)
 */
export function getMediaDisplayName(media: any): string {
  if (media?.alt && media.alt !== 'Uploaded image') {
    return media.alt
  }
  
  if (media?.filename) {
    // Remove timestamp and extension for display
    return media.filename
      .replace(/-\d+\.(jpg|jpeg|png|gif|webp)$/i, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase())
  }
  
  return 'Untitled Image'
}

/**
 * Validates image file type
 */
export function isValidImageType(filename: string): boolean {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const extension = getFileExtension(filename)
  return validExtensions.includes(extension)
}

/**
 * Generates responsive image URLs with different sizes
 */
export function getResponsiveImageUrls(baseUrl: string) {
  return {
    thumbnail: `${baseUrl}?w=200&h=150&fit=crop`,
    small: `${baseUrl}?w=600&fit=crop`,
    medium: `${baseUrl}?w=1200&fit=crop`,
    large: `${baseUrl}?w=1920&fit=crop`,
    original: baseUrl
  }
}

/**
 * Media upload helper with proper naming
 */
export async function uploadMediaFile(
  file: File, 
  customName?: string,
  altText?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!isValidImageType(file.name)) {
      return { success: false, error: 'Invalid file type. Please upload an image.' }
    }

    const formData = new FormData()
    formData.append('file', file)
    
    if (customName) {
      formData.append('customName', customName)
    }
    
    if (altText) {
      formData.append('altText', altText)
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    
    if (result.success) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.error || 'Upload failed' }
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Upload failed. Please try again.' }
  }
} 