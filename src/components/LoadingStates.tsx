import React from 'react'
import Image from 'next/image'
import styles from './LoadingStates.module.css'

// Loading spinner component
export const LoadingSpinner: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({
  size = 'medium'
}) => {
  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.spinnerRing}></div>
    </div>
  )
}

// Skeleton loader for project cards
export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className={styles.projectSkeleton}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonText}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonYear}></div>
      </div>
    </div>
  )
}

// Skeleton loader for blog posts
export const BlogPostSkeleton: React.FC = () => {
  return (
    <div className={styles.blogSkeleton}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonExcerpt}></div>
        <div className={styles.skeletonMeta}></div>
      </div>
    </div>
  )
}

// Skeleton loader for hero section
export const HeroSkeleton: React.FC = () => {
  return (
    <div className={styles.heroSkeleton}>
      <div className={styles.skeletonHeroText}>
        <div className={styles.skeletonHeroTitle}></div>
        <div className={styles.skeletonHeroSubtitle}></div>
      </div>
      <div className={styles.skeletonHeroImage}></div>
    </div>
  )
}

// Alias for backward compatibility
export const HeroLoadingState = HeroSkeleton

// Project Grid Loading State
export const ProjectGridLoadingState: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className={styles.projectGrid}>
      {Array.from({ length: count }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Loading overlay for full page loads
export const LoadingOverlay: React.FC<{ message?: string }> = ({
  message = 'Loading...'
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <LoadingSpinner size="large" />
        <p className={styles.overlayMessage}>{message}</p>
      </div>
    </div>
  )
}

// Error state component
export const ErrorState: React.FC<{
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}> = ({
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry,
  showRetry = true
}) => {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>{title}</h3>
        <p className={styles.errorMessage}>{message}</p>
        {showRetry && onRetry && (
          <button
            className={styles.retryButton}
            onClick={onRetry}
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

// Empty state component
export const EmptyState: React.FC<{
  title?: string
  message?: string
  icon?: string
  action?: {
    label: string
    onClick: () => void
  }
}> = ({
  title = 'No content found',
  message = 'There\'s nothing to display here yet',
  icon = '📝',
  action
}) => {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>{icon}</div>
        <h3 className={styles.emptyTitle}>{title}</h3>
        <p className={styles.emptyMessage}>{message}</p>
        {action && (
          <button
            className={styles.actionButton}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
    )
  }

// Progressive loading wrapper
export const ProgressiveLoader: React.FC<{
  isLoading: boolean
  error?: Error | null
  isEmpty?: boolean
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
  onRetry?: () => void
}> = ({
  isLoading,
  error,
  isEmpty = false,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  onRetry
}) => {
    if (isLoading) {
      return <>{loadingComponent || <LoadingSpinner />}</>
    }

    if (error) {
      return (
        <>
          {errorComponent || (
            <ErrorState
              title="Failed to load content"
              message={error.message}
              onRetry={onRetry}
            />
          )}
        </>
      )
    }

    if (isEmpty) {
      return (
        <>
          {emptyComponent || (
            <EmptyState
              title="No content available"
              message="Content will appear here once it's added"
            />
          )}
        </>
      )
    }

    return <>{children}</>
  }

// Content fade in wrapper for smooth animations
export const ContentFadeIn: React.FC<{
  children: React.ReactNode
  delay?: number
  className?: string
}> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`${styles.fadeIn} ${isVisible ? styles.visible : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Staggered animation for lists
export const StaggeredList: React.FC<{
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}> = ({ children, staggerDelay = 100, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ContentFadeIn key={index} delay={index * staggerDelay}>
          {child}
        </ContentFadeIn>
      ))}
    </div>
  )
}

// Image loading with placeholder
export const ProgressiveImage: React.FC<{
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}> = ({
  src,
  alt,
  className = '',
  placeholder = '/images/placeholder.jpg',
  onLoad,
  onError
}) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [hasError, setHasError] = React.useState(false)
    const [imageSrc, setImageSrc] = React.useState(placeholder)

    React.useEffect(() => {
      const img = new window.Image() // Use window.Image to avoid conflict with Next.js Image
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
        onLoad?.()
      }
      img.onerror = () => {
        setHasError(true)
        onError?.()
      }
      img.src = src
    }, [src, onLoad, onError])

    return (
      <div className={`${styles.progressiveImage} ${className}`}>
        <Image
          src={imageSrc}
          alt={alt}
          width={800}
          height={600}
          className={`${styles.image} ${isLoaded ? styles.loaded : ''} ${hasError ? styles.error : ''}`}
          onLoad={() => {
            setIsLoaded(true)
            onLoad?.()
          }}
          onError={() => {
            setHasError(true)
            onError?.()
          }}
          sizes="(max-width: 768px) 100vw, 800px"
        />
        {!isLoaded && !hasError && (
          <div className={styles.imageOverlay}>
            <LoadingSpinner size="small" />
          </div>
        )}
        {hasError && (
          <div className={styles.imageError}>
            <span>Failed to load image</span>
          </div>
        )}
      </div>
    )
  }

// Utility hook for loading states
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState)
  const [error, setError] = React.useState<Error | null>(null)

  const startLoading = React.useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const stopLoading = React.useCallback(() => {
    setIsLoading(false)
  }, [])

  const setLoadingError = React.useCallback((error: Error) => {
    setIsLoading(false)
    setError(error)
  }, [])

  const reset = React.useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
  }
} 