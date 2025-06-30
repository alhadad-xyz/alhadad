'use client'

import React, { useRef, useEffect } from "react"
import PageTransition from "@/components/transition/PageTransition"
import Link from "next/link"
import MagneticButton from "@/components/magneticbutton/MagneticButton"
import Marquee from "react-fast-marquee"
import styles from "./page.module.css"
import { gsap } from "gsap"
import { useDynamicColor } from "@/components/DynamicColorProvider"

interface Project {
  id: string
  title: string
  slug: string
  year: string
  category: string
  featuredImage?: {
    url: string
    alt: string
  }
  previewImage?: {
    url: string
    alt: string
  }
}

interface DynamicWorksProps {
  projects: Project[]
}

// Utility function to analyze image brightness
const analyzeImageBrightness = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    
    // Try without CORS first, then with if needed
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          resolve(false) // Default to dark text if can't analyze
          return
        }
        
        // Use smaller canvas for performance
        const maxSize = 100
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        let totalBrightness = 0
        let pixelCount = 0
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          // Calculate perceived brightness using luminance formula
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b)
          totalBrightness += brightness
          pixelCount++
        }
        
        const averageBrightness = totalBrightness / pixelCount
        
        // If average brightness > 140, image is considered light (adjusted threshold)
        resolve(averageBrightness > 140)
      } catch (error) {
        console.error('Error analyzing image brightness:', error)
        // Fallback: try to determine from URL or filename
        const isLikelyLight = imageUrl.toLowerCase().includes('light') || 
                             imageUrl.toLowerCase().includes('white') ||
                             imageUrl.toLowerCase().includes('bright')
        resolve(isLikelyLight)
      }
    }
    
    img.onerror = () => {
      // Fallback: assume dark background for better default readability
      resolve(false)
    }
    
    // Set source after event listeners
    img.src = imageUrl
  })
}

export default function DynamicWorks({ projects }: DynamicWorksProps) {
  const workCopyReveal = useRef<gsap.core.Timeline | null>(null)
  const { isLightBackground, hoveredProject, isWorksPage, setIsLightBackground, setHoveredProject } = useDynamicColor()

  useEffect(() => {
    try {
      workCopyReveal.current = gsap.timeline({ paused: true }).to("h1", {
        top: "0",
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.35,
      })

      workCopyReveal.current.play()

      return () => {
        // Cleanup timeline and remove any dynamically created images
        workCopyReveal.current?.kill()
        const projectPreviewContainer = document.querySelector(`.${styles.projectPreview}`)
        if (projectPreviewContainer) {
          projectPreviewContainer.innerHTML = ''
        }
      }
    } catch (error) {
      console.error('Error initializing works animations:', error)
    }
  }, [])

  // Create preview images array from projects data
  const projectPreviewImages = projects.map(project => 
    project.previewImage?.url || project.featuredImage?.url || '/images/projects/project-1.jpg'
  )

  let lastHoveredIndex: number | null = null

  const handleResetPreview = () => {
    try {
      setHoveredProject(null)
      setIsLightBackground(false)
      
      gsap.to(`.${styles.projectPreview} img`, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          lastHoveredIndex = -1
        },
      })
    } catch (error) {
      console.error('Error resetting preview:', error)
    }
  }

  const handleMouseOver = async (index: number) => {
    try {
      const projectPreviewContainer = document.querySelector(`.${styles.projectPreview}`)

      if (index !== lastHoveredIndex && projectPreviewContainer) {
        console.log(`Hovered ${index}`)
        
        setHoveredProject(index)
        
        const imageUrl = projectPreviewImages[index - 1]
        
        // Analyze image brightness for text color adjustment
        const isLight = await analyzeImageBrightness(imageUrl)
        setIsLightBackground(isLight)

        const img = document.createElement("img")
        img.src = imageUrl
        img.alt = projects[index - 1]?.previewImage?.alt || projects[index - 1]?.title || ''
        projectPreviewContainer.appendChild(img)

        gsap.to(img, {
          opacity: 1,
          duration: 0.3,
          onComplete: () => {
            try {
              const allPrevImages = projectPreviewContainer.querySelectorAll("img")

              if (allPrevImages.length > 1) {
                Array.from(allPrevImages)
                  .slice(0, -1)
                  .forEach((img) => {
                    setTimeout(() => {
                      try {
                        if (img && img.parentNode && img.parentNode.contains(img)) {
                          img.remove()
                        }
                      } catch (removeError) {
                        console.error('Error removing image:', removeError)
                      }
                    }, 1000)
                  })
              }
            } catch (cleanupError) {
              console.error('Error cleaning up preview images:', cleanupError)
            }
          },
        })

        lastHoveredIndex = index
      }
    } catch (error) {
      console.error('Error handling mouse over:', error)
    }
  }

  // Calculate year range for header
  const years = projects.map(p => parseInt(p.year)).filter(year => !isNaN(year))
  const minYear = years.length > 0 ? Math.min(...years) : 2018
  const maxYear = years.length > 0 ? Math.max(...years) : 2024
  const yearRange = minYear === maxYear ? `${maxYear}` : `${minYear} • ${maxYear}`

  // Dynamic text color based on background (only when on works page)
  const dynamicTextStyle = {
    color: isWorksPage && hoveredProject && isLightBackground 
      ? '#1a1a1a' 
      : isWorksPage && hoveredProject && !isLightBackground
      ? '#f5f5f5'
      : undefined
  }

  return (
    <PageTransition>
      <div className={`${styles.works} ${styles.page}`}>
        <div className={styles.projectPreview}></div>
        <div className="container">
          <section
            className={styles.worksHero}
            onMouseOver={() => {
              handleResetPreview()
            }}
          >
            <div className={styles.workCopyWrapper}>
              <h1 style={dynamicTextStyle}>CASES</h1>
            </div>
            <div className={styles.workCopyWrapper}>
              <h1 style={dynamicTextStyle}>{yearRange}</h1>
            </div>
          </section>

          <section className={styles.projectList}>
            {projects.map((project, index) => {
              const isEven = index % 2 === 0
              return (
                <div key={project.id} className={styles.projectListRow}>
                  {!isEven && (
                    <div className={`${styles.projectListCol} ${styles.whitespaceCol}`}></div>
                  )}
                  <div className={styles.projectListCol}>
                    <div
                      className={styles.projectItem}
                      onMouseOver={() => handleMouseOver(index + 1)}
                    >
                      <div className={styles.projectImg}>
                        <Link href={`/projects/${project.slug}`}>
                          <img 
                            src={project.featuredImage?.url || '/images/projects/project-1.jpg'} 
                            alt={project.featuredImage?.alt || project.title} 
                          />
                        </Link>
                      </div>
                      <div className={`${styles.projectCopy} ${isEven ? styles.copyPosRight : styles.copyPosLeft}`}>
                        <h2 style={dynamicTextStyle}>
                          {project.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                  {isEven && (
                    <div className={`${styles.projectListCol} ${styles.whitespaceCol}`}></div>
                  )}
                </div>
              )
            })}
          </section>

          <div
            className={styles.worksMarquee}
            onMouseOver={() => {
              handleResetPreview()
            }}
          >
            <Marquee>
              <h1 style={dynamicTextStyle}>
                {projects.length > 0 
                  ? `${projects.length} projects • Interactive design • Creative development • User experience`
                  : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae, odit?'
                }
              </h1>
            </Marquee>
          </div>

          <div
            className={styles.magneticBtn}
            onMouseOver={() => {
              handleResetPreview()
            }}
          >
            <MagneticButton />
          </div>
        </div>
      </div>
    </PageTransition>
  )
} 