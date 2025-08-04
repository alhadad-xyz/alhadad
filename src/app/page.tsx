'use client'

import React, { useEffect, useState } from 'react'
import { HeroLoadingState } from '@/components/LoadingStates'
import DynamicHomepage from './DynamicHomepage'

interface HomepageData {
  heroTitle?: string
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

// Client Component for now - we'll convert back to server component once we debug the data fetching
export default function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setError(null)
        
        // Fetch data from CMS APIs with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const [homepageResponse, projectsResponse] = await Promise.all([
          fetch('/api/settings', { signal: controller.signal }),
          fetch('/api/projects/featured', { signal: controller.signal })
        ])

        clearTimeout(timeoutId)

        // Check if responses are ok
        if (!homepageResponse.ok) {
          throw new Error(`Settings API error: ${homepageResponse.status}`)
        }
        if (!projectsResponse.ok) {
          throw new Error(`Projects API error: ${projectsResponse.status}`)
        }

        const [homepageData, projectsData] = await Promise.all([
          homepageResponse.json(),
          projectsResponse.json()
        ])

        // Transform the settings data to match homepage interface
        const transformedData: HomepageData = {
          heroTitle: homepageData.heroTitle || 'Alhadad.',
          heroSubtitle: homepageData.heroSubtitle || 'Software Engineer',
          heroTagline: homepageData.heroTagline || 'Based in Pasuruan',
          heroImage: homepageData.heroImage || {
            url: '/images/home/portrait.png',
            alt: 'Portrait'
          }
        }

        setHomepageData(transformedData)
        setFeaturedProjects(projectsData || [])
      } catch (error) {
        console.error('Error fetching homepage data:', error)
        
        // Set error message for debugging
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setError(errorMessage)
        
        // Fallback data if API fails
        const fallbackData: HomepageData = {
          heroTitle: 'Alhadad.',
          heroSubtitle: 'Software Engineer',
          heroTagline: 'Based in Pasuruan',
          heroImage: {
            url: '/images/home/portrait.png',
            alt: 'Portrait'
          }
        }
        
        setHomepageData(fallbackData)
        setFeaturedProjects([
          {
            id: 'fallback-1',
            title: 'Sample Project 1',
            slug: 'sample-project-1',
            year: '2024',
            category: 'web',
            featuredImage: {
              url: '/images/projects/project-1.jpg',
              alt: 'Sample Project 1'
            }
          },
          {
            id: 'fallback-2',
            title: 'Sample Project 2',
            slug: 'sample-project-2',
            year: '2023',
            category: 'mobile',
            featuredImage: {
              url: '/images/projects/project-2.jpg',
              alt: 'Sample Project 2'
            }
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomepageData()
  }, [])

  if (isLoading) {
    return <HeroLoadingState />
  }

  // Show error message in development
  if (error && process.env.NODE_ENV === 'development') {
    console.warn('Homepage API Error:', error)
  }

  return (
    <DynamicHomepage 
      homepageData={homepageData}
      featuredProjects={featuredProjects}
    />
  )
} 