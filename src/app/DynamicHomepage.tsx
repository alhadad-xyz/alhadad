'use client'

import React, { useEffect, useRef, useLayoutEffect } from "react"
import PageTransition from "@/components/transition/PageTransition"
import styles from "./page.module.css"
import { gsap } from "gsap"

interface HomepageData {
  heroTitle?: string
  heroTitleTop?: string
  heroTitleBottom?: string
  heroSubtitle?: string
  heroTagline?: string
  heroImage?: {
    url: string
    alt: string
  }
}

interface Project {
  id: string
  title: string
  slug: string
  featuredImage?: {
    url: string
    alt: string
  }
  year: string
  category: string
}

interface DynamicHomepageProps {
  homepageData: HomepageData | null
  featuredProjects: Project[]
}

export default function DynamicHomepage({ homepageData }: DynamicHomepageProps) {
  // Note: featuredProjects parameter available but not used in current implementation
  const heroCopyReveal = useRef<gsap.core.Timeline | null>(null)
  const heroImageReveal = useRef<gsap.core.Timeline | null>(null)
  const heroTaglineReveal = useRef<gsap.core.Timeline | null>(null)
  const isAnimationPlayed = useRef(false)

  // Preload hero image for better LCP
  useEffect(() => {
    if (homepageData?.heroImage?.url) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = homepageData.heroImage.url
      link.fetchPriority = 'high'
      document.head.appendChild(link)
      
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [homepageData?.heroImage?.url])

  // Extract hero content with fallbacks
  const heroTitleTop = typeof homepageData?.heroTitleTop === 'string' ? homepageData.heroTitleTop : 'MOHAMMAD KHALID I'
  const heroTitleBottom = typeof homepageData?.heroTitleBottom === 'string' ? homepageData.heroTitleBottom : 'ALHADAD'
  const heroSubtitle = typeof homepageData?.heroSubtitle === 'string' ? homepageData.heroSubtitle : 'Software Engineer'
  const heroTagline = typeof homepageData?.heroTagline === 'string' ? homepageData.heroTagline : 'Pasuruan'
  const heroImage = homepageData?.heroImage || {
    url: '/images/home/portrait.jpg',
    alt: 'Portrait'
  }

  // Create full tagline combining subtitle and location
  const fullTagline = `${heroSubtitle} based in ${heroTagline}.`

  // Create title words array from top and bottom parts - ensure they are strings
  const titleWords = [
    typeof heroTitleTop === 'string' ? heroTitleTop : 'MOHAMMAD KHALID I',
    typeof heroTitleBottom === 'string' ? heroTitleBottom : 'ALHADAD'
  ]

  // Use useLayoutEffect to ensure DOM is ready before animations
  useLayoutEffect(() => {
    try {
      // Reset animation flag
      isAnimationPlayed.current = false

      // Kill any existing timelines first
      heroCopyReveal.current?.kill()
      heroImageReveal.current?.kill()
      heroTaglineReveal.current?.kill()

      // Check if we're on mobile
      const isMobile = window.innerWidth <= 900

      if (isMobile) {
        // Mobile animations - simpler, no complex positioning
        gsap.set(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
          opacity: 0,
          y: 30,
          clearProps: "top"
        })
        
        gsap.set(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
          opacity: 0,
          y: 50,
          clearProps: "top"
        })
        
        gsap.set(`.${styles.heroImg}`, {
          opacity: 0,
          y: 100,
          rotation: 0,
          transformOrigin: "center center"
        })
        
        gsap.set(`.${styles.heroTagline}`, {
          opacity: 0,
          y: 30,
          clearProps: "bottom"
        })

        // Mobile animations
        heroCopyReveal.current = gsap.timeline({ paused: true })
          .to(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.35,
          })
          .to(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          }, 0.55)

        heroImageReveal.current = gsap
          .timeline({ paused: true })
          .to(`.${styles.heroImg}`, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
            force3D: true
          })

        heroTaglineReveal.current = gsap
          .timeline({ paused: true })
          .to(`.${styles.heroTagline}`, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 1,
          })
      } else {
        // Desktop animations - original complex positioning
        gsap.set(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
          top: "100px",
          clearProps: "transform"
        })
        
        gsap.set(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
          top: "300px",
          clearProps: "transform"
        })
        
        gsap.set(`.${styles.heroImg}`, {
          y: "1000",
          rotation: -10,
          transformOrigin: "center center"
        })
        
        gsap.set(`.${styles.heroTagline}`, {
          opacity: 0,
          bottom: "-5%",
          clearProps: "opacity"
        })

        // Desktop animations
        heroCopyReveal.current = gsap.timeline({ paused: true })
          .to(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
            top: "0",
            duration: 1,
            ease: "power3.out",
            delay: 0.35,
          })
          .to(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
            top: "0",
            duration: 1,
            ease: "power3.out",
          }, 0.55)

        heroImageReveal.current = gsap
          .timeline({ paused: true })
          .to(`.${styles.heroImg}`, {
            y: "0",
            rotation: 5,
            duration: 1,
            ease: "power3.out",
            delay: 0.75,
            force3D: true
          })

        heroTaglineReveal.current = gsap
          .timeline({ paused: true })
          .to(`.${styles.heroTagline}`, {
            opacity: 1,
            bottom: "10%",
            duration: 1,
            ease: "power3.out",
            delay: 1,
          })
      }

      return () => {
        // Clean up timelines on unmount
        heroCopyReveal.current?.kill()
        heroImageReveal.current?.kill()
        heroTaglineReveal.current?.kill()
      }
    } catch (error) {
      console.error('Error initializing hero animations:', error)
    }
  }, [homepageData]) // Re-run when homepage data changes

  // Separate effect to play animations after a short delay
  useEffect(() => {
    if (!isAnimationPlayed.current) {
      const timer = setTimeout(() => {
        // Play all animations
        heroCopyReveal.current?.play()
        heroImageReveal.current?.play()
        heroTaglineReveal.current?.play()
        isAnimationPlayed.current = true
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [])

  // Handle resize events for responsive animations
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout
    let isResizing = false

    const handleResize = () => {
      if (isResizing) return
      
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        isResizing = true
        
        // Reset animation flag to allow re-initialization
        isAnimationPlayed.current = false
        
        // Kill current animations
        heroCopyReveal.current?.kill()
        heroImageReveal.current?.kill()
        heroTaglineReveal.current?.kill()
        
        // Properly clear all GSAP inline styles
        const elementsToReset = [
          `.${styles.heroCopyWrapper}:nth-child(1) h1`,
          `.${styles.heroCopyWrapper}:nth-child(2) h1`,
          `.${styles.heroImg}`,
          `.${styles.heroTagline}`
        ]
        
        elementsToReset.forEach(selector => {
          const elements = document.querySelectorAll(selector)
          elements.forEach(el => {
            // Remove all GSAP-applied inline styles
            const element = el as HTMLElement
            element.style.removeProperty('transform')
            element.style.removeProperty('top')
            element.style.removeProperty('bottom')
            element.style.removeProperty('opacity')
            element.style.removeProperty('rotation')
            element.style.removeProperty('y')
            element.style.removeProperty('x')
            element.style.removeProperty('scale')
            element.style.removeProperty('will-change')
            element.style.removeProperty('transform-origin')
            // Clear any remaining transform-related properties
            if (element.style.transform) element.style.transform = ''
          })
        })
        
        // Use GSAP clearProps as backup
        gsap.set(elementsToReset, { clearProps: "all" })
        
        // Re-initialize animations after clearing
        setTimeout(() => {
          // Check if we're on mobile
          const isMobile = window.innerWidth <= 900

          if (isMobile) {
            // Mobile setup
            gsap.set(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
              opacity: 0,
              y: 30,
              clearProps: "top"
            })
            
            gsap.set(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
              opacity: 0,
              y: 50,
              clearProps: "top"
            })
            
            gsap.set(`.${styles.heroImg}`, {
              opacity: 0,
              y: 100,
              rotation: 0,
              transformOrigin: "center center"
            })
            
            gsap.set(`.${styles.heroTagline}`, {
              opacity: 0,
              y: 30,
              clearProps: "bottom"
            })

            // Mobile animations
            heroCopyReveal.current = gsap.timeline({ paused: false })
              .to(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              })
              .to(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              }, 0.2)

            heroImageReveal.current = gsap
              .timeline({ paused: false })
              .to(`.${styles.heroImg}`, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                force3D: true
              })

            heroTaglineReveal.current = gsap
              .timeline({ paused: false })
              .to(`.${styles.heroTagline}`, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.4,
              })
          } else {
            // Desktop setup
            gsap.set(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
              top: "100px",
              clearProps: "transform"
            })
            
            gsap.set(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
              top: "300px",
              clearProps: "transform"
            })
            
            gsap.set(`.${styles.heroImg}`, {
              y: "1000",
              rotation: -10,
              transformOrigin: "center center"
            })
            
            gsap.set(`.${styles.heroTagline}`, {
              opacity: 0,
              bottom: "-5%",
              clearProps: "opacity"
            })

            // Desktop animations
            heroCopyReveal.current = gsap.timeline({ paused: false })
              .to(`.${styles.heroCopyWrapper}:nth-child(1) h1`, {
                top: "0",
                duration: 0.8,
                ease: "power3.out",
              })
              .to(`.${styles.heroCopyWrapper}:nth-child(2) h1`, {
                top: "0",
                duration: 0.8,
                ease: "power3.out",
              }, 0.2)

            heroImageReveal.current = gsap
              .timeline({ paused: false })
              .to(`.${styles.heroImg}`, {
                y: "0",
                rotation: 5,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.4,
                force3D: true
              })

            heroTaglineReveal.current = gsap
              .timeline({ paused: false })
              .to(`.${styles.heroTagline}`, {
                opacity: 1,
                bottom: "10%",
                duration: 0.8,
                ease: "power3.out",
                delay: 0.6,
              })
          }
          
          isAnimationPlayed.current = true
          isResizing = false
        }, 50)
      }, 300)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <PageTransition key="home-page">
      <section className={styles.heroSection}>
        <div className={`${styles.heroImg} hero-image-lcp`}>
          <img
            src={heroImage.url}
            alt={heroImage.alt}
            width={350}
            height={500}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            style={{
              // Inline critical styles for faster rendering
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              aspectRatio: '7/10'
            }}
          />
        </div>
        <div className={styles.heroCopy}>
          {titleWords.map((word, index) => (
            <div key={index} className={styles.heroCopyWrapper}>
              <h1>{word}</h1>
            </div>
          ))}
        </div>
        <div className={styles.heroTagline}>
          <p>{fullTagline}</p>
        </div>
      </section>
    </PageTransition>
  )
} 