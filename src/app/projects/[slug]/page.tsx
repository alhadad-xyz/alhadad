'use client'

import React, { useEffect, useRef, useState } from "react"
import PageTransition from "@/components/transition/PageTransition"
import Link from "next/link"
import styles from "./page.module.css"
import { gsap } from "gsap"
import { notFound } from "next/navigation"
import MediaDisplay from "@/components/MediaDisplay"

interface ProjectMedia {
  id: string
  url: string
  alt: string
  filename: string
  mimeType: string
  width?: number
  height?: number
}

interface ProjectGalleryItem {
  image: ProjectMedia | string // Can be populated object or just ID
  caption?: string
}

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  year: string
  category: string
  featuredImage?: ProjectMedia
  previewImage?: ProjectMedia
  gallery?: ProjectGalleryItem[]
  technologies?: { technology: string }[]
  liveUrl?: string
  githubUrl?: string
  richContent?: any
  status: string
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [nextProject, setNextProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const nextProjectPreview = useRef<gsap.core.Timeline | null>(null)
  const nextProjectPreviewBg = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        setIsLoading(true)
        
        // Await params for Next.js 15 compatibility
        const resolvedParams = await params
        
        // Fetch current project
        const response = await fetch(`/api/projects?slug=${resolvedParams.slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch project')
        }
        
        const projects = await response.json()
        if (!projects || projects.length === 0) {
          notFound()
        }
        
        const currentProject = projects[0]
        setProject(currentProject)
        
        // Fetch next project for navigation
        const allProjectsResponse = await fetch('/api/projects')
        if (allProjectsResponse.ok) {
          const allProjects = await allProjectsResponse.json()
          const currentIndex = allProjects.findIndex((p: Project) => p.id === currentProject.id)
          const nextIndex = (currentIndex + 1) % allProjects.length
          setNextProject(allProjects[nextIndex])
        }
        
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params])

  const handleNextProjectHover = () => {
    nextProjectPreview.current?.play()
    nextProjectPreviewBg.current?.play()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    try {
      const { clientX, clientY } = e
      const nextProjectContainer = document.querySelector(`.${styles.nextProjectPreview}`)

      if (nextProjectContainer) {
        gsap.to(`.${styles.nextProjectPreview}`, {
          x: clientX - nextProjectContainer.getBoundingClientRect().width / 2,
          y: clientY - nextProjectContainer.getBoundingClientRect().height / 2,
          duration: 0.5,
          ease: "power3.out",
        })
      }
    } catch (error) {
      console.error('Error handling mouse move:', error)
    }
  }

  const handleNextProjectHoverOut = () => {
    nextProjectPreview.current?.reverse()
    nextProjectPreviewBg.current?.reverse()
  }

  useEffect(() => {
    try {
      nextProjectPreview.current = gsap
        .timeline({ paused: true })
        .to(`.${styles.nextProjectPreview}`, {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        })

      nextProjectPreviewBg.current = gsap
        .timeline({ paused: true })
        .to(`.${styles.nextProjectPreviewBg}`, {
          opacity: 1,
          duration: 0.3,
        })
    } catch (error) {
      console.error('Error initializing project animations:', error)
    }
  }, [])

  // Helper function to convert project media to MediaDisplay format
  const convertToMediaDisplayFormat = (media: ProjectMedia | undefined) => {
    if (!media) return null
    
    // Handle cases where media might be just an ID string
    if (typeof media === 'string') {
      console.warn('Media is a string ID, not populated object:', media)
      return null
    }
    
    // Ensure we have the required fields
    if (!media.url) {
      console.warn('Media object missing URL:', media)
      return null
    }
    
    return {
      id: parseInt(media.id) || 0,
      url: media.url,
      alt: media.alt || media.filename || 'Image',
      filename: media.filename || '',
      caption: undefined
    }
  }

  // Helper function specifically for gallery items from CMS
  const convertGalleryItemToMediaFormat = (galleryItem: ProjectGalleryItem) => {
    if (!galleryItem || !galleryItem.image) {
      console.warn('Gallery item missing image:', galleryItem)
      return null
    }
    
    const media = galleryItem.image
    
    // Handle cases where media might be just an ID string (should not happen with depth: 2)
    if (typeof media === 'string') {
      console.warn('Gallery image is a string ID, not populated object. Check API depth parameter:', media)
      return null
    }
    
    // Ensure we have the required fields
    if (!media.url) {
      console.warn('Gallery media object missing URL:', media)
      return null
    }
    
    return {
      id: parseInt(media.id) || 0,
      url: media.url,
      alt: media.alt || media.filename || galleryItem.caption || 'Gallery Image',
      filename: media.filename || '',
      caption: galleryItem.caption
    }
  }



  if (isLoading) {
    return (
      <PageTransition>
        <div className={`${styles.project} ${styles.page}`}>
          <div className="container">
            <div className={styles.loading}>
              <h1>Loading project...</h1>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (error || !project) {
    return (
      <PageTransition>
        <div className={`${styles.project} ${styles.page}`}>
          <div className="container">
            <div className={styles.error}>
              <h1>Project not found</h1>
              <Link href="/works">← Back to works</Link>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className={`${styles.project} ${styles.page}`}>
        {/* Hero Section */}
        <section className={styles.projectHero}>
          <MediaDisplay 
            media={convertToMediaDisplayFormat(project.featuredImage)} 
            loading="eager"
          />
        </section>

        {/* Next Project Background */}
        {nextProject && (
          <div className={styles.nextProjectPreviewBg}>
            <MediaDisplay 
              media={convertToMediaDisplayFormat(nextProject.featuredImage)}
            />
          </div>
        )}

        <div className="container">
          {/* Project Title */}
          <section className={styles.projectTitle}>
            <h1>{project.title}</h1>
            <p>{project.category} • {project.year}</p>
          </section>

          {/* Project Brief */}
          {project.description && (
            <section className={styles.projectBrief}>
              <h2>{project.description}</h2>
            </section>
          )}

          {/* Project Details */}
          <section className={styles.projectDescription}>
            <div className={styles.projectRow}>
              <div className={styles.projectCol}>
                <div className={styles.projectSubCol}>
                  <p><span>Year</span></p>
                  <p>{project.year}</p>
                </div>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className={styles.projectSubCol}>
                    <p><span>Technologies</span></p>
                    {project.technologies.map((tech, index) => (
                      <p key={index}>{tech.technology}</p>
                    ))}
                  </div>
                )}

                {(project.liveUrl || project.githubUrl) && (
                  <div className={styles.projectSubCol}>
                    <p><span>Links</span></p>
                    {project.liveUrl && (
                      <p><a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Project</a></p>
                    )}
                    {project.githubUrl && (
                      <p><a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>
                    )}
                  </div>
                )}
              </div>
              
              <div className={styles.projectCol}>
                {project.richContent && (
                  <div className={styles.projectContent}>
                    <div dangerouslySetInnerHTML={{ 
                      __html: project.richContent
                        .replace(/\\n/g, '<br/>') // Handle escaped \n
                        .replace(/\n/g, '<br/>') // Handle actual newlines
                    }} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Project Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <section className={styles.projectImages}>
              <div className={styles.galleryGrid}>
                {project.gallery.map((item, index) => (
                  <div key={index} className={styles.projectImg}>
                    <MediaDisplay 
                      media={convertGalleryItemToMediaFormat(item)}
                    />
                    {item.caption && (
                      <p className={styles.imageCaption}>{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next Project Navigation */}
          {nextProject && (
            <section className={styles.nextProject}>
              <div className={styles.nextProjectPreview}>
                <MediaDisplay 
                  media={convertToMediaDisplayFormat(nextProject.featuredImage)}
                />
              </div>
              <div className={styles.nextProjectCopy}>
                <p><span>Next Project</span></p>
                <h1
                  onMouseOver={handleNextProjectHover}
                  onMouseMove={handleMouseMove}
                  onMouseOut={handleNextProjectHoverOut}
                >
                  <Link href={`/projects/${nextProject.slug}`}>
                    {nextProject.title}
                  </Link>
                </h1>
              </div>
            </section>
          )}
        </div>
      </div>
    </PageTransition>
  )
} 