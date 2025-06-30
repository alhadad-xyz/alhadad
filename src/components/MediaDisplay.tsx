import React from 'react'
import { getMediaDisplayName, getResponsiveImageUrls } from '@/utils/media'
import styles from './MediaDisplay.module.css'

interface MediaDisplayProps {
  media: {
    id: number
    url: string
    alt: string
    filename: string
    caption?: string
  } | null
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
  showCaption?: boolean
  showFilename?: boolean
  className?: string
  loading?: 'lazy' | 'eager'
}

export default function MediaDisplay({ 
  media, 
  size = 'medium', 
  showCaption = false, 
  showFilename = false,
  className = '',
  loading = 'lazy'
}: MediaDisplayProps) {
  if (!media) {
    return (
      <div className={`${styles.placeholder} ${className}`}>
        <div className={styles.placeholderContent}>
          <span>No image available</span>
        </div>
      </div>
    )
  }

  const displayName = getMediaDisplayName(media)
  const responsiveUrls = getResponsiveImageUrls(media.url)
  const imageUrl = responsiveUrls[size]

  return (
    <div className={`${styles.mediaContainer} ${className}`}>
      <div className={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={media.alt}
          loading={loading}
          className={styles.image}
        />
      </div>
      
      {showCaption && media.caption && (
        <div className={styles.caption}>
          {media.caption}
        </div>
      )}
      
      {showFilename && (
        <div className={styles.filename}>
          <span className={styles.displayName}>{displayName}</span>
          <span className={styles.technicalName}>{media.filename}</span>
        </div>
      )}
    </div>
  )
}

// Gallery component for multiple images
interface MediaGalleryProps {
  images: MediaDisplayProps['media'][]
  columns?: 2 | 3 | 4
  size?: MediaDisplayProps['size']
  showCaptions?: boolean
  className?: string
}

export function MediaGallery({ 
  images, 
  columns = 3, 
  size = 'medium', 
  showCaptions = false,
  className = ''
}: MediaGalleryProps) {
  return (
    <div className={`${styles.gallery} ${styles[`columns${columns}`]} ${className}`}>
      {images.map((image, index) => (
        <MediaDisplay
          key={image?.id || index}
          media={image}
          size={size}
          showCaption={showCaptions}
          className={styles.galleryItem}
        />
      ))}
    </div>
  )
} 