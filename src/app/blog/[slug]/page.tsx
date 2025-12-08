'use client'

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import PageTransition from "@/components/transition/PageTransition"
import Link from "next/link"
import MagneticButton from "@/components/magneticbutton/MagneticButton"
import { LoadingSpinner } from "@/components/LoadingStates"
import RichTextRenderer from "@/components/RichTextRenderer"
import styles from "./page.module.css"
import type { LexicalContent } from '@/types';

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: LexicalContent | string
  publishedAt: string
  categories?: { category: string; id?: string }[]
  tags?: { tag: string; id?: string }[]
  featuredImage?: {
    id: number
    url: string
    alt: string
  }
  seoData?: {
    title?: string
    description?: string
    keywords?: { keyword: string }[]
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) return

      try {
        const response = await fetch(`/api/blog/${params.slug}`)
        const result = await response.json()

        if (result.success) {
          setPost(result.data)
        } else {
          setError(result.message || 'Blog post not found')
        }
      } catch (err) {
        setError('Failed to load blog post')
        console.error('Error fetching blog post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImageUrl = (featuredImage?: BlogPost['featuredImage']) => {
    if (featuredImage && typeof featuredImage === 'object') {
      return featuredImage.url
    }
    return '/images/projects/project-1.jpg' // Fallback image
  }

  if (loading) {
    return (
      <PageTransition>
        <div className={`${styles.blogPost} ${styles.page}`}>
          <div className="container">
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="large" />
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (error || !post) {
    return (
      <PageTransition>
        <div className={`${styles.blogPost} ${styles.page}`}>
          <div className="container">
            <div className={styles.errorContainer}>
              <h1>Post Not Found</h1>
              <p>{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
              <Link href="/blog" className={styles.backLink}>
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className={`${styles.blogPost} ${styles.page}`}>
        <div className="container">
          {/* Hero Section */}
          <div className={styles.blogHero}>
            <h2>{post.title}</h2>
          </div>

          {/* Blog Content - Two Column Layout */}
          <div className={styles.blogContent}>
            {/* Left Column - Content */}
            <div className={`${styles.blogCol} ${styles.scroll}`}>
              {/* Meta Information */}
              <p>
                <span>
                  {post.categories && post.categories.length > 0
                    ? post.categories[0].category
                    : 'Blog'} • {formatDate(post.publishedAt)}
                </span>
              </p>

              <br />

              {/* Excerpt */}
              {post.excerpt && (
                <>
                  <h4>{post.excerpt}</h4>
                  <br />
                  <br />
                </>
              )}

              {/* Rich Text Content */}
              <div className={styles.richContent}>
                <RichTextRenderer content={post.content as any} />
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className={`${styles.blogCol} ${styles.sticky}`}>
              {/* Share Section */}
              <div className={styles.blogShare}>
                <span>Share</span>
                <div className={styles.shareIcon}>
                  <svg width="18" height="18" viewBox="0 0 256 256" fill="none">
                    <path d="M100 108c4.3-2.5 8.7-5 13-7.5l84-48c10.9-6.2 24.5 1.5 24.5 14v110c0 12.5-13.6 20.2-24.5 14l-84-48c-4.3-2.5-8.7-5-13-7.5zM28 40v176c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V40c0-8.8-7.2-16-16-16H44c-8.8 0-16 7.2-16 16z" fill="#fff" />
                  </svg>
                </div>
                <div className={styles.shareIcon}>
                  <svg width="18" height="18" viewBox="0 0 256 256" fill="none">
                    <path d="M214.75 211.71l-62.6-98.38 61.77-67.95a8 8 0 0 0-11.84-10.76L143.24 99.34 102.75 35.71A8 8 0 0 0 96 32H48a8 8 0 0 0-6.75 12.3l62.6 98.37-61.77 67.95a8 8 0 0 0 11.84 10.76l58.84-64.72 40.49 63.63A8 8 0 0 0 160 224h48a8 8 0 0 0 6.75-12.29z" fill="#fff" />
                  </svg>
                </div>
              </div>

              {/* Featured Image */}
              <div className={styles.blogContentImg}>
                <Image
                  src={getImageUrl(post.featuredImage)}
                  alt={post.featuredImage?.alt || post.title}
                  width={600}
                  height={400}
                  sizes="(max-width: 768px) 100vw, 600px"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className={styles.blogTags}>
                  <span>Tags:</span>
                  <div className={styles.tagsList}>
                    {post.tags.map(tag => (
                      <span key={tag.id} className={styles.tag}>
                        #{tag.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <MagneticButton />
        </div>
      </div>
    </PageTransition>
  )
} 