'use client'

import React, { useEffect, useState } from 'react'
import { ProjectGridLoadingState } from '@/components/LoadingStates'
import DynamicWorks from './DynamicWorks'

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

export default function WorksPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        const projectsData = await response.json()
        setProjects(projectsData)
    } catch (error) {
        console.error('Error fetching projects:', error)
        // Keep empty array as fallback
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return <ProjectGridLoadingState count={5} />
  }

  return <DynamicWorks projects={projects} />
} 