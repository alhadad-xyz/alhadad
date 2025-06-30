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

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        // Fetch data from CMS APIs
        const [homepageResponse, projectsResponse] = await Promise.all([
          fetch('/api/settings'), // Get hero content from settings
          fetch('/api/projects/featured')
        ])

        const [homepageData, projectsData] = await Promise.all([
          homepageResponse.json(),
          projectsResponse.json()
        ])

        // Transform the settings data to match homepage interface
        const transformedData: HomepageData = {
          heroTitle: homepageData.heroTitle || 'Alhadad.',
          heroSubtitle: homepageData.heroSubtitle || 'Full Stack Developer',
          heroTagline: homepageData.heroTagline || 'Based in Pasuruan',
          heroImage: homepageData.heroImage || {
            url: '/images/home/portrait.jpg',
            alt: 'Portrait'
          }
        }

        setHomepageData(transformedData)
        setFeaturedProjects(projectsData || [])
      } catch (error) {
        console.error('Error fetching homepage data:', error)
        
        // Fallback data if API fails
        const fallbackData: HomepageData = {
          heroTitle: 'Alhadad.',
          heroSubtitle: 'Full Stack Developer',
          heroTagline: 'Based in Pasuruan',
          heroImage: {
            url: '/images/home/portrait.jpg',
            alt: 'Portrait'
          }
        }
        
        setHomepageData(fallbackData)
        setFeaturedProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomepageData()
  }, [])

  if (isLoading) {
    return <HeroLoadingState />
  }

  return (
    <DynamicHomepage 
      homepageData={homepageData}
      featuredProjects={featuredProjects}
    />
  )
} 