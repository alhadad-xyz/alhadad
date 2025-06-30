'use client'

import React, { useState, useEffect } from "react"
import PageTransition from "@/components/transition/PageTransition"
import Link from "next/link"
import MagneticButton from "@/components/magneticbutton/MagneticButton"
import { LoadingSpinner } from "@/components/LoadingStates"
import styles from "./page.module.css"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt: string
  categories?: { category: string; id?: string }[]
  tags?: { tag: string; id?: string }[]
  featuredImage?: {
    id: number
    url: string
    alt: string
  }
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog?status=published&limit=20')
        const result = await response.json()
        
        if (result.success) {
          setBlogPosts(result.data.docs)
        } else {
          setError('Failed to load blog posts')
        }
      } catch (err) {
        setError('Failed to load blog posts')
        console.error('Error fetching blog posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Image URL helper (currently unused but available for future implementation)
  // const getImageUrl = (featuredImage?: BlogPost['featuredImage']) => {
  //   if (featuredImage && typeof featuredImage === 'object') {
  //     return featuredImage.url
  //   }
  //   return '/images/projects/project-1.jpg' // Fallback image
  // }

  if (loading) {
    return (
      <PageTransition>
        <div className={`${styles.blog} ${styles.page}`}>
          <div className="container">
                         <LoadingSpinner size="large" />
          </div>
        </div>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition>
        <div className={`${styles.blog} ${styles.page}`}>
          <div className="container">
            <div className={styles.blogHero}>
              <h1>
                Journal <span>on design.</span>
              </h1>
            </div>
            <div className={styles.errorState}>
              <p>{error}</p>
              <p>Please check back later or contact support if the issue persists.</p>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className={`${styles.blog} ${styles.page}`}>
        <div className="container">
          <div className={styles.blogHero}>
            <h1>
              Journal <span>on design.</span>
            </h1>
            {blogPosts.length > 0 && (
              <p className={styles.blogSubtitle}>
                Thoughts on design, development, and creativity — {blogPosts.length} articles
              </p>
            )}
          </div>

          <section className={styles.blogs}>
            {blogPosts.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No blog posts yet</h3>
                <p>Stay tuned for upcoming articles on design and development.</p>
              </div>
            ) : (
              <div className={styles.blogGrid}>
                {blogPosts.map((post) => (
                  <div key={post.id} className={styles.blogCol}>
                    <div className={styles.blogItem}>
                      <div className={styles.blogDivider}>
                        <div className={styles.bDiv1}></div>
                        <div className={styles.bDiv2}></div>
                      </div>

                      <div className={styles.blogTitleWrapper}>
                        <div className={styles.blogTitle}>
                          <h3>
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <div className={styles.blogMeta}>
                            {post.categories && post.categories.length > 0 && (
                              <span className={styles.blogCategory}>
                                {post.categories[0].category}
                              </span>
                            )}
                            <span className={styles.blogDate}>
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>
                          {post.excerpt && (
                            <p className={styles.blogExcerpt}>
                              {post.excerpt}
                            </p>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className={styles.blogTags}>
                              {post.tags.slice(0, 3).map(tag => (
                                <span key={tag.id} className={styles.blogTag}>
                                  {tag.tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className={styles.blogArrow}>
                          <svg width="32" height="32" viewBox="0 0 256 256" fill="none">
                            <path d="M200 128H56m144 0l-48-48m48 48l-48 48" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <MagneticButton />
        </div>
      </div>
    </PageTransition>
  )
} 