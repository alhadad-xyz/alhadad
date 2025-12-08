'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './CMSDashboard.module.css'
import CreateProjectModal from './CreateProjectModal'
import EditProjectModal from './EditProjectModal'
import UserMenu from '../../components/auth/UserMenu'
import type { LexicalContent, LexicalNode, ProjectData, SettingsValue } from '@/types'

interface Project {
  id: string
  title: string
  slug: string
  year: string
  category: string
  status: string
  featuredImage?: {
    id: number
    url: string
    alt: string
  } | number
}

interface BlogPost {
  id: string
  title: string
  slug: string
  status: string
  publishedAt: string
  excerpt?: string
  content?: LexicalContent | string
  featuredImage?: {
    id: number
    url: string
    alt: string
  } | number
  categories?: { category: string; id?: string }[]
  tags?: { tag: string; id?: string }[]
  createdAt: string
  updatedAt: string
  seoData?: {
    title?: string
    description?: string
    keywords?: { keyword: string }[]
  }
}

interface MediaItem {
  id: string
  filename: string
  alt: string
  caption?: string
  url: string
  thumbnailURL?: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  tags?: { tag: string; id?: string }[]
  createdAt: string
  updatedAt: string
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    small?: { url: string; width: number; height: number }
    medium?: { url: string; width: number; height: number }
    large?: { url: string; width: number; height: number }
  }
}

interface DashboardStats {
  projects: number
  blogPosts: number
  media: number
  publishedProjects: number
  draftProjects: number
}

export default function CMSDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'blog' | 'media' | 'about' | 'settings'>('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    blogPosts: 0,
    media: 0,
    publishedProjects: 0,
    draftProjects: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [settings, setSettings] = useState({
    siteName: 'Cura Futuri',
    siteDescription: 'Portfolio of Cura Futuri, an interaction designer based in Toronto specializing in digital experiences and creative development.',
    footerText: '© 2024 Cura Futuri. All rights reserved.',
    customMenuItems: [],
    // Site branding
    logoTitle: 'CURA FUTURI',
    siteTitle: 'Cura Futuri - Interaction Designer',
    siteIcon: null as string | { url: string; alt: string } | null,
    menuPreviewImages: {
      about: null as string | { url: string; alt: string } | null,
      work: null as string | { url: string; alt: string } | null,
      blog: null as string | { url: string; alt: string } | null,
      contact: null as string | { url: string; alt: string } | null,
    },
    // Hero section content
    heroTitleTop: 'MOHAMMAD',
    heroTitleBottom: 'KHALID',
    heroSubtitle: 'Interaction Designer',
    heroTagline: 'Based in Toronto',
    heroImage: null as string | { url: string; alt: string } | null
  })

  const [aboutContent, setAboutContent] = useState({
    profileImage: null as { url: string; alt: string } | null,
    bio: 'Full Stack Developer based in Pasuruan, specializing in creating meaningful digital experiences that bridge the gap between technology and human needs.',
    skills: [
      { skill: 'UI/UX Design', proficiency: 'expert' },
      { skill: 'Frontend Development', proficiency: 'expert' },
      { skill: 'Backend Development', proficiency: 'advanced' },
      { skill: 'Animation & Motion', proficiency: 'advanced' },
      { skill: 'Database Design', proficiency: 'advanced' }
    ],
    experience: [
      {
        company: 'Freelance',
        role: 'Full Stack Developer',
        period: '2022 - Present',
        description: 'Developing web applications and digital experiences for various clients.'
      }
    ],
    // Contact Information
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    // Technical Skills
    technicalSkills: [
      { category: 'Frontend', primarySkills: 'JavaScript, TypeScript', secondarySkills: 'React, Next.js, Vue.js' },
      { category: 'Animation', primarySkills: 'GSAP, Framer Motion', secondarySkills: 'Three.js, WebGL' },
      { category: 'Backend', primarySkills: 'Node.js, Express', secondarySkills: 'Python, PHP' },
      { category: 'Tools', primarySkills: 'Git, Docker, Webpack', secondarySkills: 'Figma, VS Code' }
    ],
    // Content Sections
    marqueeText: '',
    introTitle: '',
    establishedYear: '',
    aboutParagraphs: [
      { paragraph: 'Mohammad Khalid partners with a broad spectrum of clients in Tech, Education, Entertainment, and eCommerce, crafting immersive web applications and interactive designs for brands of all shapes and sizes. With a focus on Frontend Development, User Interface (UI) Design, and Animation, Mohammad brings a unique blend of creativity and technical precision to every project.' },
      { paragraph: 'Renowned for pioneering in the field of web development and animation, Mohammad has been working on innovative projects that push the boundaries of what\'s possible on the web.' }
    ],
    callToActionTitle: '',
    callToActionText: '',
    // FAQ
    faqs: [
      { question: 'What type of works do you take on?', answer: 'I specialize in full stack web development and animation design, focusing on creating engaging and dynamic user experiences for websites and web applications.' },
      { question: 'How do you charge for projects?', answer: 'My project pricing is tailored to the specific needs and scope of each project. I typically offer a project-based fee after a thorough discussion about the project\'s requirements, timelines, and expected deliverables.' },
      { question: 'What is your hourly rate?', answer: 'While I primarily work with project-based pricing, I understand that some projects may require an hourly rate. My hourly rate varies depending on the complexity and scope of the work.' }
    ]
  })

  const [isSavingAbout, setIsSavingAbout] = useState(false)
  const [aboutMessage, setAboutMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [aboutImageUploading, setAboutImageUploading] = useState(false)

  // Media management state
  const [mediaPage, setMediaPage] = useState(1)
  const [mediaLimit] = useState(20)
  const [mediaSearch, setMediaSearch] = useState('')
  const [mediaFilter] = useState('') // setMediaFilter removed as it's not currently used
  // const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [mediaUploading, setMediaUploading] = useState(false)
  const [showMediaUpload, setShowMediaUpload] = useState(false)
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null)
  const [mediaViewMode, setMediaViewMode] = useState<'grid' | 'list'>('grid')
  const [mediaTotalPages, setMediaTotalPages] = useState(1)

  // Blog management state
  const [blogPage, setBlogPage] = useState(1)
  const [blogLimit] = useState(10)
  const [blogSearch, setBlogSearch] = useState('')
  const [blogStatus, setBlogStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [showCreateBlog, setShowCreateBlog] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [blogTotalPages, setBlogTotalPages] = useState(1)

  // Project import/export state
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Helper function to convert category values to display labels
  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'web': 'Web Development',
      'mobile': 'Mobile App',
      'branding': 'Branding',
      'other': 'Other'
    }
    return categoryMap[category] || category
  }

  // Fix hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      fetchDashboardData()
      fetchSettings()
      fetchAboutContent()
    }
  }, [isMounted])

  // Fetch media when media tab is selected or media-related states change
  useEffect(() => {
    if (isMounted && activeTab === 'media') {
      fetchMediaData()
    }
  }, [activeTab, mediaPage, mediaSearch, mediaFilter, isMounted])

  // Fetch blog when blog tab is selected or blog-related states change
  useEffect(() => {
    if (isMounted && activeTab === 'blog') {
      fetchBlogData()
    }
  }, [activeTab, blogPage, blogSearch, blogStatus, isMounted])

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from APIs
      const [statsResponse, projectsResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/projects?dashboard=true') // Add dashboard parameter to show all projects
      ])

      const [statsData, projectsData] = await Promise.all([
        statsResponse.json(),
        projectsResponse.json()
      ])

      setStats(statsData)
      setProjects(projectsData)

      // Fetch media data
      await fetchMediaData()

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)

      // Fallback to mock data
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Blisscove \'24',
          slug: 'blisscove-24',
          year: '2024',
          category: 'Web Design',
          status: 'published',
          featuredImage: {
            id: 1,
            url: '/images/projects/project-1.jpg',
            alt: 'Blisscove \'24'
          }
        },
        {
          id: '2',
          title: 'Quantleaf',
          slug: 'quantleaf',
          year: '2023',
          category: 'App Design',
          status: 'draft',
          featuredImage: {
            id: 2,
            url: '/images/projects/project-2.jpg',
            alt: 'Quantleaf'
          }
        }
      ]

      const mockStats: DashboardStats = {
        projects: mockProjects.length,
        blogPosts: 1,
        media: 12,
        publishedProjects: mockProjects.filter(p => p.status === 'published').length,
        draftProjects: mockProjects.filter(p => p.status === 'draft').length
      }

      setProjects(mockProjects)
      setStats(mockStats)
      setIsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const settingsData = await response.json()
      setSettings(settingsData)
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Keep default settings if fetch fails
    }
  }

  const fetchMediaData = async () => {
    try {
      const searchParams = new URLSearchParams({
        page: mediaPage.toString(),
        limit: mediaLimit.toString(),
        ...(mediaSearch && { search: mediaSearch }),
        ...(mediaFilter && { tag: mediaFilter }),
      })

      const response = await fetch(`/api/media?${searchParams}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMedia(result.data.docs)
          setMediaTotalPages(result.data.totalPages)
        }
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    }
  }

  const fetchBlogData = async () => {
    try {
      const searchParams = new URLSearchParams({
        page: blogPage.toString(),
        limit: blogLimit.toString(),
        status: blogStatus,
        ...(blogSearch && { search: blogSearch }),
      })

      const response = await fetch(`/api/blog?${searchParams}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setBlogPosts(result.data.docs)
          setBlogTotalPages(result.data.totalPages)
        }
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    }
  }

  const handleSaveSettings = async () => {
    setIsSavingSettings(true)
    setSettingsMessage(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const result = await response.json()

      if (result.success) {
        setSettingsMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        setSettingsMessage({ type: 'error', text: result.message || 'Failed to save settings' })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSettingsMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setIsSavingSettings(false)

      // Clear message after 3 seconds
      setTimeout(() => setSettingsMessage(null), 3000)
    }
  }

  const handleSettingChange = (field: string, value: SettingsValue) => {
    if (field.includes('.')) {
      // Handle nested properties like 'menuPreviewImages.about'
      const [parentField, childField] = field.split('.')
      setSettings(prev => ({
        ...prev,
        [parentField]: {
          ...(prev[parentField as keyof typeof prev] as any),
          [childField]: value
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show loading state
    setSettingsMessage({
      type: 'success',
      text: `Uploading "${file.name}"...`
    })

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', 'Hero image')

      // Upload file to media collection
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.success) {
        // Save the full media object to settings for proper URL handling
        handleSettingChange('heroImage', {
          id: uploadResult.data.id,
          url: uploadResult.data.url,
          alt: uploadResult.data.alt,
          filename: uploadResult.data.filename
        })

        setSettingsMessage({
          type: 'success',
          text: `Image "${file.name}" uploaded successfully!`
        })
      } else {
        throw new Error(uploadResult.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setSettingsMessage({
        type: 'error',
        text: `Failed to upload "${file.name}". Please try again.`
      })
    }

    // Clear message after 3 seconds
    setTimeout(() => setSettingsMessage(null), 3000)
  }

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show loading state
    setSettingsMessage({
      type: 'success',
      text: `Uploading "${file.name}"...`
    })

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', 'Site icon')

      // Upload file to media collection
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.success) {
        // Save the full media object to settings for proper URL handling
        handleSettingChange('siteIcon', {
          id: uploadResult.data.id,
          url: uploadResult.data.url,
          alt: uploadResult.data.alt,
          filename: uploadResult.data.filename
        })

        setSettingsMessage({
          type: 'success',
          text: `Icon "${file.name}" uploaded successfully!`
        })
      } else {
        throw new Error(uploadResult.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading icon:', error)
      setSettingsMessage({
        type: 'error',
        text: `Failed to upload "${file.name}". Please try again.`
      })
    }

    // Clear message after 3 seconds
    setTimeout(() => setSettingsMessage(null), 3000)
  }

  const handleMenuImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, menuItem: string) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show loading state
    setSettingsMessage({
      type: 'success',
      text: `Uploading "${file.name}" for ${menuItem}...`
    })

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', `${menuItem} menu preview image`)

      // Upload file to media collection
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.success) {
        // Save the full media object to settings for proper URL handling
        handleSettingChange(`menuPreviewImages.${menuItem}`, {
          id: uploadResult.data.id,
          url: uploadResult.data.url,
          alt: uploadResult.data.alt,
          filename: uploadResult.data.filename
        })

        setSettingsMessage({
          type: 'success',
          text: `${menuItem} menu image "${file.name}" uploaded successfully!`
        })
      } else {
        throw new Error(uploadResult.message || 'Upload failed')
      }
    } catch (error) {
      console.error(`Error uploading ${menuItem} menu image:`, error)
      setSettingsMessage({
        type: 'error',
        text: `Failed to upload "${file.name}" for ${menuItem}. Please try again.`
      })
    }

    // Clear message after 3 seconds
    setTimeout(() => setSettingsMessage(null), 3000)
  }

  const handleAboutImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setAboutImageUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // Update the about content with the new profile image
        // Store the media ID for Payload CMS, but keep URL for preview
        setAboutContent(prev => ({
          ...prev,
          profileImage: {
            id: result.data.id,
            url: result.data.url,
            alt: result.data.alt || 'Profile image'
          }
        }))

        setAboutMessage({
          type: 'success',
          text: 'Profile image uploaded successfully!'
        })
      } else {
        setAboutMessage({ type: 'error', text: result.message || 'Failed to upload image' })
      }
    } catch (error) {
      console.error('Error uploading profile image:', error)
      setAboutMessage({ type: 'error', text: 'Failed to upload image. Please try again.' })
    } finally {
      setAboutImageUploading(false)

      // Clear message after 3 seconds
      setTimeout(() => setAboutMessage(null), 3000)
    }
  }

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/about')
      const aboutData = await response.json()

      // Convert null values to empty strings to prevent React warnings
      const cleanedData = {
        ...aboutData,
        contactEmail: aboutData.contactEmail || '',
        contactPhone: aboutData.contactPhone || '',
        contactAddress: aboutData.contactAddress || '',
        marqueeText: aboutData.marqueeText || '',
        introTitle: aboutData.introTitle || '',
        establishedYear: aboutData.establishedYear || '',
        callToActionTitle: aboutData.callToActionTitle || '',
        callToActionText: aboutData.callToActionText || '',
        bio: aboutData.bio || '',
        skills: aboutData.skills || [],
        experience: aboutData.experience || [],
        technicalSkills: aboutData.technicalSkills || [],
        aboutParagraphs: aboutData.aboutParagraphs || [],
        faqs: aboutData.faqs || []
      }

      setAboutContent(cleanedData)
    } catch (error) {
      console.error('Error fetching about content:', error)
      // Keep default content if fetch fails
    }
  }

  const handleSaveAbout = async () => {
    setIsSavingAbout(true)
    setAboutMessage(null)

    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutContent),
      })

      const result = await response.json()

      if (result.success) {
        setAboutMessage({ type: 'success', text: 'About page content saved successfully!' })
      } else {
        setAboutMessage({ type: 'error', text: result.message || 'Failed to save about content' })
      }
    } catch (error) {
      console.error('Error saving about content:', error)
      setAboutMessage({ type: 'error', text: 'Failed to save about content. Please try again.' })
    } finally {
      setIsSavingAbout(false)

      // Clear message after 3 seconds
      setTimeout(() => setAboutMessage(null), 3000)
    }
  }

  const handleAboutChange = (field: string, value: SettingsValue) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSkillChange = (index: number, field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const addSkill = () => {
    setAboutContent(prev => ({
      ...prev,
      skills: [...prev.skills, { skill: '', proficiency: 'intermediate' }]
    }))
  }

  const removeSkill = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addExperience = () => {
    setAboutContent(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', period: '', description: '' }]
    }))
  }

  const removeExperience = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  // Technical Skills helpers
  const handleTechnicalSkillChange = (index: number, field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const addTechnicalSkill = () => {
    setAboutContent(prev => ({
      ...prev,
      technicalSkills: [...prev.technicalSkills, { category: '', primarySkills: '', secondarySkills: '' }]
    }))
  }

  const removeTechnicalSkill = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
    }))
  }

  // About Paragraphs helpers
  const handleAboutParagraphChange = (index: number, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      aboutParagraphs: prev.aboutParagraphs.map((item, i) =>
        i === index ? { ...item, paragraph: value } : item
      )
    }))
  }

  const addAboutParagraph = () => {
    setAboutContent(prev => ({
      ...prev,
      aboutParagraphs: [...prev.aboutParagraphs, { paragraph: '' }]
    }))
  }

  const removeAboutParagraph = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      aboutParagraphs: prev.aboutParagraphs.filter((_, i) => i !== index)
    }))
  }

  // FAQ helpers
  const handleFaqChange = (index: number, field: string, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    }))
  }

  const addFaq = () => {
    setAboutContent(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }))
  }

  const removeFaq = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }))
  }

  // Project Import/Export Functions
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/projects/template')

      if (!response.ok) {
        throw new Error('Failed to download template')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'project-import-template.json'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Template download error:', error)
      setImportMessage({
        type: 'error',
        text: 'Failed to download template. Please try again.'
      })
      setTimeout(() => setImportMessage(null), 5000)
    }
  }

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset the input value
    event.target.value = ''

    if (file.type !== 'application/json') {
      setImportMessage({
        type: 'error',
        text: 'Please select a valid JSON file.'
      })
      setTimeout(() => setImportMessage(null), 5000)
      return
    }

    setIsImporting(true)
    setImportMessage(null)

    try {
      const fileText = await file.text()
      const jsonData = JSON.parse(fileText)

      const response = await fetch('/api/projects/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }

      setImportMessage({
        type: 'success',
        text: result.message
      })

      // Show detailed results if there were errors
      if (result.results.errors.length > 0) {
        console.warn('Import errors:', result.results.errors)
        const errorDetails = result.results.errors.slice(0, 3).join('\n')
        const moreErrors = result.results.errors.length > 3 ? `\n...and ${result.results.errors.length - 3} more errors` : ''

        setImportMessage({
          type: result.results.success > 0 ? 'success' : 'error',
          text: `${result.message}\n\nFirst few errors:\n${errorDetails}${moreErrors}`
        })
      }

      // Refresh projects data
      if (result.results.success > 0) {
        fetchDashboardData()
      }

    } catch (error) {
      console.error('Import error:', error)
      setImportMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to import projects. Please check your JSON format.'
      })
    } finally {
      setIsImporting(false)
      setTimeout(() => setImportMessage(null), 10000) // Show longer for import results
    }
  }

  const handleCreateProject = async (projectData: ProjectData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the projects list to show the new project
        fetchDashboardData()
        console.log('Project created successfully:', result.data)
      } else {
        throw new Error(result.message || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowEditModal(true)
  }

  const handleUpdateProject = async (projectData: ProjectData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the projects list
        fetchDashboardData()
        setShowEditModal(false)
        setEditingProject(null)
      } else {
        throw new Error(result.message || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the projects list
        fetchDashboardData()
        setShowEditModal(false)
        setEditingProject(null)
      } else {
        throw new Error(result.message || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    img.src = '/images/projects/project-1.jpg' // Fallback to existing image
  }

  // Media management functions
  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setMediaUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', file.name.split('.')[0])

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      const successful = results.filter(r => r.success)

      if (successful.length > 0) {
        await fetchMediaData() // Refresh media list
        setShowMediaUpload(false)
      }
    } catch (error) {
      console.error('Error uploading media:', error)
    } finally {
      setMediaUploading(false)
    }
  }

  const handleMediaSearch = async (searchTerm: string) => {
    setMediaSearch(searchTerm)
    setMediaPage(1) // Reset to first page
    await fetchMediaData()
  }

  // Filter function (available for future implementation)
  // const handleMediaFilter = async (tag: string) => {
  //   setMediaFilter(tag)
  //   setMediaPage(1) // Reset to first page
  //   await fetchMediaData()
  // }

  const handleMediaPageChange = async (page: number) => {
    setMediaPage(page)
    await fetchMediaData()
  }

  const handleMediaDelete = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return

    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.success) {
        await fetchMediaData() // Refresh media list
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const handleMediaEdit = (media: MediaItem) => {
    setEditingMedia(media)
  }

  const handleMediaUpdate = async (mediaData: Partial<MediaItem>) => {
    if (!editingMedia) return

    try {
      const response = await fetch(`/api/media?id=${editingMedia.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData),
      })

      const result = await response.json()
      if (result.success) {
        await fetchMediaData() // Refresh media list
        setEditingMedia(null)
      }
    } catch (error) {
      console.error('Error updating media:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getImageUrl = (media: MediaItem): string => {
    // Check for valid thumbnail URLs first
    if (media.sizes?.thumbnail?.url && media.sizes.thumbnail.url !== 'null') {
      return media.sizes.thumbnail.url
    }

    if (media.thumbnailURL && media.thumbnailURL !== 'null' && !media.thumbnailURL.includes('null?')) {
      return media.thumbnailURL
    }

    // Fallback to main URL - handle both direct media URLs and API URLs
    if (media.url) {
      // If it's an API URL, convert it to direct media URL for thumbnail
      if (media.url.startsWith('/api/media/file/')) {
        const filename = media.url.split('/').pop()
        return `/media/${filename}?w=200&h=150&fit=crop`
      }

      // If it's already a direct media URL, add thumbnail parameters
      if (media.url.startsWith('/media/')) {
        return `${media.url}?w=200&h=150&fit=crop`
      }

      // Fallback to original URL
      return media.url
    }

    // Last resort fallback
    return '/images/projects/project-1.jpg'
  }

  // Blog management functions
  const handleBlogSearch = async (searchTerm: string) => {
    setBlogSearch(searchTerm)
    setBlogPage(1) // Reset to first page
    await fetchBlogData()
  }

  const handleBlogStatusFilter = async (status: 'all' | 'published' | 'draft') => {
    setBlogStatus(status)
    setBlogPage(1) // Reset to first page
    await fetchBlogData()
  }

  const handleBlogPageChange = async (page: number) => {
    setBlogPage(page)
    await fetchBlogData()
  }

  const handleCreateBlog = () => {
    setEditingBlog(null)
    setShowCreateBlog(true)
  }

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog)
    setShowCreateBlog(true)
  }

  const handleBlogSave = async (blogData: Partial<BlogPost>) => {
    try {
      const url = editingBlog ? `/api/blog?id=${editingBlog.id}` : '/api/blog'
      const method = editingBlog ? 'PUT' : 'POST'

      // Include featured image from editingBlog state if available
      const dataToSend = {
        ...blogData,
        featuredImage: editingBlog?.featuredImage || blogData.featuredImage
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()
      if (result.success) {
        await fetchBlogData() // Refresh blog list
        setShowCreateBlog(false)
        setEditingBlog(null)
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  const handleBlogDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blog?id=${blogId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.success) {
        await fetchBlogData() // Refresh blog list
      }
    } catch (error) {
      console.error('Error deleting blog post:', error)
    }
  }

  const getBlogImageUrl = (blog: BlogPost): string => {
    if (typeof blog.featuredImage === 'object' && blog.featuredImage?.url) {
      return blog.featuredImage.url
    }
    return '/images/projects/project-1.jpg' // Fallback
  }

  const handleBlogImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show loading state
    setSettingsMessage({
      type: 'success',
      text: `Uploading "${file.name}"...`
    })

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', 'Featured image')

      // Upload file to media collection
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.success) {
        // Update the blog post with the new featured image
        setEditingBlog(prev => prev ? {
          ...prev,
          featuredImage: {
            id: uploadResult.data.id,
            url: uploadResult.data.url,
            alt: uploadResult.data.alt,
            filename: uploadResult.data.filename
          }
        } : null)

        setSettingsMessage({
          type: 'success',
          text: `Featured image "${file.name}" uploaded successfully!`
        })
      } else {
        throw new Error(uploadResult.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading featured image:', error)
      setSettingsMessage({
        type: 'error',
        text: `Failed to upload "${file.name}". Please try again.`
      })
    }

    // Clear message after 3 seconds
    setTimeout(() => setSettingsMessage(null), 3000)
  }

  const renderOverview = () => (
    <div className={styles.overview}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📁</div>
          <div className={styles.statContent}>
            <h3>{stats.projects}</h3>
            <p>Total Projects</p>
            <span className={styles.statDetail}>
              {stats.publishedProjects} published, {stats.draftProjects} drafts
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3>{stats.blogPosts}</h3>
            <p>Blog Posts</p>
            <span className={styles.statDetail}>Published articles</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🖼️</div>
          <div className={styles.statContent}>
            <h3>{stats.media}</h3>
            <p>Media Files</p>
            <span className={styles.statDetail}>Images and assets</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🌐</div>
          <div className={styles.statContent}>
            <h3>Live</h3>
            <p>Site Status</p>
            <span className={styles.statDetail}>All systems operational</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <button
            className={styles.actionButton}
            onClick={() => setShowCreateModal(true)}
          >
            <span className={styles.actionIcon}>➕</span>
            <span>Add New Project</span>
          </button>
          <button className={styles.actionButton} onClick={() => setActiveTab('blog')}>
            <span className={styles.actionIcon}>✍️</span>
            <span>Write Blog Post</span>
          </button>
          <button className={styles.actionButton} onClick={() => setActiveTab('media')}>
            <span className={styles.actionIcon}>📤</span>
            <span>Upload Media</span>
          </button>
          <button className={styles.actionButton} onClick={() => setActiveTab('settings')}>
            <span className={styles.actionIcon}>⚙️</span>
            <span>Site Settings</span>
          </button>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h2>Recent Projects</h2>
        <div className={styles.projectPreview}>
          {projects.slice(0, 3).map(project => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectImage}>
                <Image
                  src={typeof project.featuredImage === 'object' ? project.featuredImage?.url : '/images/projects/project-1.jpg'}
                  alt={typeof project.featuredImage === 'object' ? project.featuredImage?.alt : project.title}
                  onError={handleImageError}
                />
                <div className={styles.projectTypeIndicator}>
                  {getCategoryLabel(project.category)}
                </div>
              </div>
              <div className={styles.projectInfo}>
                <h3>{project.title}</h3>
                <p>{getCategoryLabel(project.category)} • {project.year}</p>
                <span className={`${styles.status} ${styles[project.status]}`}>
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderProjects = () => (
    <div className={styles.projectsSection}>
      <div className={styles.sectionHeader}>
        <h2>Projects Management</h2>
        <div className={styles.projectActions}>
          <button
            className={styles.secondaryButton}
            onClick={handleDownloadTemplate}
            title="Download JSON template for bulk import"
          >
            📄 Download Template
          </button>
          <label className={styles.secondaryButton}>
            📁 Import JSON
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportJSON}
              style={{ display: 'none' }}
              disabled={isImporting}
            />
          </label>
          <button
            className={styles.primaryButton}
            onClick={() => setShowCreateModal(true)}
          >
            Add New Project
          </button>
        </div>
      </div>

      {/* Import Status Message */}
      {importMessage && (
        <div className={`${styles.importMessage} ${styles[importMessage.type]}`}>
          <pre>{importMessage.text}</pre>
        </div>
      )}

      {/* Loading indicator for import */}
      {isImporting && (
        <div className={styles.importingIndicator}>
          <div className={styles.spinner}></div>
          <span>Importing projects...</span>
        </div>
      )}

      <div className={styles.projectsList}>
        {projects.map(project => (
          <div key={project.id} className={styles.projectItem}>
            <div className={styles.projectThumbnail}>
              <Image
                src={typeof project.featuredImage === 'object' ? project.featuredImage?.url : '/images/projects/project-1.jpg'}
                alt={typeof project.featuredImage === 'object' ? project.featuredImage?.alt : project.title}
                onError={handleImageError}
              />
            </div>
            <div className={styles.projectDetails}>
              <h3>{project.title}</h3>
              <p>{getCategoryLabel(project.category)} • {project.year}</p>
              <span className={`${styles.status} ${styles[project.status]}`}>
                {project.status}
              </span>
            </div>
            <div className={styles.projectActions}>
              <button
                className={styles.editButton}
                onClick={() => handleEditProject(project)}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
                    handleDeleteProject(project.id)
                  }
                }}
              >
                Delete
              </button>
              <button
                className={styles.viewButton}
                onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderBlog = () => (
    <div className={styles.blogSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Blog Management</h2>
          <p>{blogPosts.length} posts • Page {blogPage} of {blogTotalPages}</p>
        </div>
        <div className={styles.blogControls}>
          <input
            type="search"
            placeholder="Search blog posts..."
            value={blogSearch}
            onChange={(e) => handleBlogSearch(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={blogStatus}
            onChange={(e) => handleBlogStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className={styles.statusFilter}
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <button
            className={styles.primaryButton}
            onClick={handleCreateBlog}
          >
            New Blog Post
          </button>
        </div>
      </div>

      <div className={styles.blogList}>
        {blogPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No blog posts found</p>
            <button
              className={styles.primaryButton}
              onClick={handleCreateBlog}
            >
              Create your first blog post
            </button>
          </div>
        ) : (
          blogPosts.map(post => (
            <div key={post.id} className={styles.blogItem}>
              <div className={styles.blogThumbnail}>
                <Image
                  src={getBlogImageUrl(post)}
                  alt={post.title}
                  onError={handleImageError}
                />
              </div>
              <div className={styles.blogDetails}>
                <h3>{post.title}</h3>
                <p>{post.excerpt || 'No excerpt available'}</p>
                <div className={styles.blogMeta}>
                  <span className={`${styles.status} ${styles[post.status]}`}>
                    {post.status}
                  </span>
                  <span>
                    {post.publishedAt
                      ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                      : `Updated ${new Date(post.updatedAt).toLocaleDateString()}`
                    }
                  </span>
                  {post.categories && post.categories.length > 0 && (
                    <div className={styles.blogCategories}>
                      {post.categories.slice(0, 2).map(cat => (
                        <span key={cat.id} className={styles.categoryTag}>
                          {cat.category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.blogActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditBlog(post)}
                >
                  Edit
                </button>
                <button
                  className={styles.viewButton}
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                >
                  View
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleBlogDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {blogTotalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={blogPage === 1}
            onClick={() => handleBlogPageChange(blogPage - 1)}
            className={styles.pageButton}
          >
            Previous
          </button>

          {[...Array(blogTotalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handleBlogPageChange(index + 1)}
              className={`${styles.pageButton} ${blogPage === index + 1 ? styles.active : ''}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={blogPage === blogTotalPages}
            onClick={() => handleBlogPageChange(blogPage + 1)}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {showCreateBlog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleBlogSave({
                title: formData.get('title') as string,
                slug: formData.get('slug') as string,
                excerpt: formData.get('excerpt') as string,
                content: formData.get('content') as string,
                status: formData.get('status') as string,
                categories: (formData.get('categories') as string).split(',').map(cat => ({ category: cat.trim() })),
                tags: (formData.get('tags') as string).split(',').map(tag => ({ tag: tag.trim() })),
              })
            }}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  name="title"
                  defaultValue={editingBlog?.title || ''}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Slug</label>
                <input
                  name="slug"
                  defaultValue={editingBlog?.slug || ''}
                  placeholder="auto-generated from title"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Excerpt</label>
                <textarea
                  name="excerpt"
                  defaultValue={editingBlog?.excerpt || ''}
                  rows={3}
                  placeholder="Brief summary for blog listing"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Featured Image</label>
                <div className={styles.imageUploadSection}>
                  {editingBlog?.featuredImage && (
                    <div className={styles.currentImage}>
                      <Image
                        src={getBlogImageUrl(editingBlog)}
                        alt="Current featured image"
                        onError={handleImageError}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const form = document.querySelector('form') as HTMLFormElement;
                          if (form) {
                            const featuredImageInput = form.querySelector('input[name="featuredImage"]') as HTMLInputElement;
                            if (featuredImageInput) featuredImageInput.value = '';
                          }
                        }}
                        className={styles.removeImage}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    name="featuredImage"
                    accept="image/*"
                    onChange={handleBlogImageUpload}
                    className={styles.fileInput}
                    id="blogImageUpload"
                  />
                  <label htmlFor="blogImageUpload" className={styles.uploadLabel}>
                    {editingBlog?.featuredImage ? '📁 Change Image' : '📁 Upload Featured Image'}
                  </label>
                  <p className={styles.uploadHint}>Recommended: 1200×630px for optimal display</p>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Content</label>
                <textarea
                  name="content"
                  defaultValue={editingBlog?.content
                    ? typeof editingBlog.content === 'object' && 'root' in editingBlog.content
                      ? (editingBlog.content as LexicalContent).root.children?.map((node: LexicalNode) =>
                        node.children?.map((child: LexicalNode) => child.text || '').join('') || ''
                      ).join('\n') || ''
                      : Array.isArray(editingBlog.content)
                        ? (editingBlog.content as LexicalNode[]).map((node: LexicalNode) =>
                          node.children?.map((child: LexicalNode) => child.text || '').join('') || ''
                        ).join('\n')
                        : typeof editingBlog.content === 'string'
                          ? editingBlog.content
                          : ''
                    : ''}
                  rows={10}
                  required
                  placeholder="Blog post content..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select name="status" defaultValue={editingBlog?.status || 'draft'}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Categories (comma-separated)</label>
                <input
                  name="categories"
                  defaultValue={editingBlog?.categories?.map(c => c.category).join(', ') || ''}
                  placeholder="Design, Development, Tips"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tags (comma-separated)</label>
                <input
                  name="tags"
                  defaultValue={editingBlog?.tags?.map(t => t.tag).join(', ') || ''}
                  placeholder="ui, ux, coding, tutorial"
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowCreateBlog(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )

  const renderMedia = () => (
    <div className={styles.mediaSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Media Library</h2>
          <p>{media.length} files • Page {mediaPage} of {mediaTotalPages}</p>
        </div>
        <div className={styles.mediaControls}>
          <input
            type="search"
            placeholder="Search media..."
            value={mediaSearch}
            onChange={(e) => handleMediaSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button
            className={`${styles.viewToggle} ${mediaViewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setMediaViewMode('grid')}
          >
            ⊞
          </button>
          <button
            className={`${styles.viewToggle} ${mediaViewMode === 'list' ? styles.active : ''}`}
            onClick={() => setMediaViewMode('list')}
          >
            ☰
          </button>
          <button
            className={styles.primaryButton}
            onClick={() => setShowMediaUpload(true)}
          >
            Upload Files
          </button>
        </div>
      </div>

      {showMediaUpload && (
        <div className={styles.uploadSection}>
          <div className={styles.uploadArea}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleMediaUpload}
              className={styles.fileInput}
              id="mediaUpload"
              disabled={mediaUploading}
            />
            <label htmlFor="mediaUpload" className={styles.uploadLabel}>
              {mediaUploading ? '📤 Uploading...' : '📁 Select Files to Upload'}
            </label>
            <p>Drop files here or click to browse</p>
            <button
              className={styles.secondaryButton}
              onClick={() => setShowMediaUpload(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`${styles.mediaGrid} ${mediaViewMode === 'list' ? styles.mediaList : ''}`}>
        {media.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No media files found</p>
            <button
              className={styles.primaryButton}
              onClick={() => setShowMediaUpload(true)}
            >
              Upload your first file
            </button>
          </div>
        ) : (
          media.map(item => (
            <div key={item.id} className={styles.mediaItem}>
              <div className={styles.mediaPreview}>
                <Image
                  src={getImageUrl(item)}
                  alt={item.alt}
                  onError={handleImageError}
                />
                <div className={styles.mediaOverlay}>
                  <button
                    onClick={() => handleMediaEdit(item)}
                    className={styles.mediaAction}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleMediaDelete(item.id)}
                    className={styles.mediaAction}
                    title="Delete"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.url)}
                    className={styles.mediaAction}
                    title="Copy URL"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className={styles.mediaInfo}>
                <p title={item.filename}>{item.filename}</p>
                <span>{formatFileSize(item.filesize)}</span>
                {item.width && item.height && (
                  <span>{item.width}×{item.height}</span>
                )}
                <div className={styles.mediaMeta}>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.tags && item.tags.length > 0 && (
                    <div className={styles.mediaTags}>
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag.id} className={styles.mediaTag}>
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {mediaTotalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={mediaPage === 1}
            onClick={() => handleMediaPageChange(mediaPage - 1)}
            className={styles.pageButton}
          >
            Previous
          </button>

          {[...Array(mediaTotalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handleMediaPageChange(index + 1)}
              className={`${styles.pageButton} ${mediaPage === index + 1 ? styles.active : ''}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={mediaPage === mediaTotalPages}
            onClick={() => handleMediaPageChange(mediaPage + 1)}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {editingMedia && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Media</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleMediaUpdate({
                alt: formData.get('alt') as string,
                caption: formData.get('caption') as string,
                tags: (formData.get('tags') as string).split(',').map(tag => ({ tag: tag.trim() }))
              })
            }}>
              <div className={styles.formGroup}>
                <label>Alt Text</label>
                <input
                  name="alt"
                  defaultValue={editingMedia.alt}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Caption</label>
                <input
                  name="caption"
                  defaultValue={editingMedia.caption || ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tags (comma-separated)</label>
                <input
                  name="tags"
                  defaultValue={editingMedia.tags?.map(t => t.tag).join(', ') || ''}
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setEditingMedia(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )

  const renderAbout = () => (
    <div className={styles.aboutSection}>
      <div className={styles.settingsHeader}>
        <h2>About Page Content</h2>
        {aboutMessage && (
          <div className={`${styles.message} ${styles[aboutMessage.type]}`}>
            {aboutMessage.text}
          </div>
        )}
      </div>

      <div className={styles.settingsGrid}>
        {/* Contact Information */}
        <div className={styles.settingGroup}>
          <h3>Contact Information</h3>
          <div className={styles.settingItem}>
            <label>Email</label>
            <input
              type="email"
              value={aboutContent.contactEmail || ''}
              onChange={(e) => handleAboutChange('contactEmail', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Phone</label>
            <input
              type="text"
              value={aboutContent.contactPhone || ''}
              onChange={(e) => handleAboutChange('contactPhone', e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Address</label>
            <textarea
              value={aboutContent.contactAddress || ''}
              onChange={(e) => handleAboutChange('contactAddress', e.target.value)}
              rows={2}
              placeholder="Your address or location"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className={styles.settingGroup}>
          <h3>Page Content</h3>
          <div className={styles.settingItem}>
            <label>Marquee Text</label>
            <input
              type="text"
              value={aboutContent.marqueeText || ''}
              onChange={(e) => handleAboutChange('marqueeText', e.target.value)}
              placeholder="Scrolling text at the top"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Introduction Title</label>
            <textarea
              value={aboutContent.introTitle || ''}
              onChange={(e) => handleAboutChange('introTitle', e.target.value)}
              rows={3}
              placeholder="Main introduction paragraph"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Established Year</label>
            <input
              type="text"
              value={aboutContent.establishedYear || ''}
              onChange={(e) => handleAboutChange('establishedYear', e.target.value)}
              placeholder="Est. 1997"
            />
          </div>
        </div>

        {/* About Paragraphs */}
        <div className={styles.settingGroup}>
          <h3>About Paragraphs</h3>
          {aboutContent.aboutParagraphs.map((item, index) => (
            <div key={index} className={styles.paragraphItem}>
              <div className={styles.paragraphHeader}>
                <label>Paragraph {index + 1}</label>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeAboutParagraph(index)}
                >
                  ✕
                </button>
              </div>
              <textarea
                value={item.paragraph || ''}
                onChange={(e) => handleAboutParagraphChange(index, e.target.value)}
                rows={4}
                placeholder="Write about your work and experience..."
              />
            </div>
          ))}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={addAboutParagraph}
          >
            + Add Paragraph
          </button>
        </div>

        {/* Profile Information */}
        <div className={styles.settingGroup}>
          <h3>Profile Information</h3>
          <div className={styles.settingItem}>
            <label>Profile Image</label>
            <div className={styles.imageUpload}>
              {aboutContent.profileImage?.url ? (
                <div className={styles.imagePreview}>
                  <Image
                    src={aboutContent.profileImage.url}
                    alt="Profile preview"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/home/portrait.png'
                    }}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleAboutChange('profileImage', null)}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAboutImageUpload}
                    className={styles.fileInput}
                    id="profileImageUpload"
                  />
                  <label htmlFor="profileImageUpload" className={styles.uploadLabel}>
                    👤 Upload Profile Image
                  </label>
                  <p>Recommended: 400x400px square image</p>
                  {aboutImageUploading && <p style={{ color: '#888', fontSize: '14px' }}>Uploading image...</p>}
                </div>
              )}
            </div>
          </div>
          <div className={styles.settingItem}>
            <label>Biography</label>
            <textarea
              value={aboutContent.bio || ''}
              onChange={(e) => handleAboutChange('bio', e.target.value)}
              rows={4}
              placeholder="Write your professional biography..."
            />
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className={styles.settingGroup}>
          <h3>Skills & Expertise</h3>
          {aboutContent.skills.map((skill, index) => (
            <div key={index} className={styles.skillItem}>
              <div className={styles.skillInputs}>
                <input
                  type="text"
                  value={skill.skill || ''}
                  onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
                  placeholder="Skill name"
                />
                <select
                  value={skill.proficiency}
                  onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeSkill(index)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={addSkill}
          >
            + Add Skill
          </button>
        </div>

        {/* Technical Skills & Tools */}
        <div className={styles.settingGroup}>
          <h3>Technical Skills & Tools</h3>
          {aboutContent.technicalSkills.map((skill, index) => (
            <div key={index} className={styles.technicalSkillItem}>
              <div className={styles.technicalSkillHeader}>
                <label>Category {index + 1}</label>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeTechnicalSkill(index)}
                >
                  ✕
                </button>
              </div>
              <div className={styles.technicalSkillInputs}>
                <input
                  type="text"
                  value={skill.category || ''}
                  onChange={(e) => handleTechnicalSkillChange(index, 'category', e.target.value)}
                  placeholder="Category (e.g., Frontend, Backend)"
                />
                <textarea
                  value={skill.primarySkills || ''}
                  onChange={(e) => handleTechnicalSkillChange(index, 'primarySkills', e.target.value)}
                  rows={2}
                  placeholder="Primary skills (left column)"
                />
                <textarea
                  value={skill.secondarySkills || ''}
                  onChange={(e) => handleTechnicalSkillChange(index, 'secondarySkills', e.target.value)}
                  rows={2}
                  placeholder="Secondary skills (right column)"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={addTechnicalSkill}
          >
            + Add Technical Category
          </button>
        </div>

        {/* Work Experience */}
        <div className={styles.settingGroup}>
          <h3>Work Experience</h3>
          {aboutContent.experience.map((exp, index) => (
            <div key={index} className={styles.experienceItem}>
              <div className={styles.experienceHeader}>
                <h4>Experience {index + 1}</h4>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeExperience(index)}
                >
                  ✕
                </button>
              </div>
              <div className={styles.experienceInputs}>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  placeholder="Company name"
                />
                <input
                  type="text"
                  value={exp.role || ''}
                  onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  placeholder="Job title/role"
                />
                <input
                  type="text"
                  value={exp.period || ''}
                  onChange={(e) => handleExperienceChange(index, 'period', e.target.value)}
                  placeholder="e.g., 2020 - Present"
                />
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  placeholder="Brief description of responsibilities and achievements"
                  rows={2}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={addExperience}
          >
            + Add Experience
          </button>
        </div>

        {/* Call to Action */}
        <div className={styles.settingGroup}>
          <h3>Call to Action Section</h3>
          <div className={styles.settingItem}>
            <label>Call to Action Title</label>
            <input
              type="text"
              value={aboutContent.callToActionTitle || ''}
              onChange={(e) => handleAboutChange('callToActionTitle', e.target.value)}
              placeholder="Let's work together"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Call to Action Text</label>
            <textarea
              value={aboutContent.callToActionText || ''}
              onChange={(e) => handleAboutChange('callToActionText', e.target.value)}
              rows={3}
              placeholder="Description text for the call to action"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.settingGroup}>
          <h3>FAQ Section</h3>
          {aboutContent.faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <div className={styles.faqHeader}>
                <label>FAQ {index + 1}</label>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeFaq(index)}
                >
                  ✕
                </button>
              </div>
              <div className={styles.faqInputs}>
                <input
                  type="text"
                  value={faq.question || ''}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  placeholder="FAQ question"
                />
                <textarea
                  value={faq.answer || ''}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  rows={4}
                  placeholder="FAQ answer"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={addFaq}
          >
            + Add FAQ
          </button>
        </div>
      </div>

      <div className={styles.settingsActions}>
        <button
          className={styles.primaryButton}
          onClick={handleSaveAbout}
          disabled={isSavingAbout}
        >
          {isSavingAbout ? 'Saving...' : 'Save About Content'}
        </button>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className={styles.settingsSection}>
      <div className={styles.settingsHeader}>
        <h2>Site Settings</h2>
        {settingsMessage && (
          <div className={`${styles.message} ${styles[settingsMessage.type]}`}>
            {settingsMessage.text}
          </div>
        )}
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingGroup}>
          <h3>Site Information</h3>
          <div className={styles.settingItem}>
            <label>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
            />
          </div>
          <div className={styles.settingItem}>
            <label>Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3>Site Branding</h3>
          <div className={styles.settingItem}>
            <label>Logo Title</label>
            <input
              type="text"
              value={settings.logoTitle}
              onChange={(e) => handleSettingChange('logoTitle', e.target.value)}
              placeholder="e.g., CURA FUTURI"
            />
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
              This appears in the top-left corner of your site
            </p>
          </div>
          <div className={styles.settingItem}>
            <label>Site Title (Browser Tab)</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => handleSettingChange('siteTitle', e.target.value)}
              placeholder="e.g., Cura Futuri - Interaction Designer"
            />
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
              This appears in browser tabs and search results
            </p>
          </div>
          <div className={styles.settingItem}>
            <label>Site Icon (Favicon)</label>
            <div className={styles.imageUpload}>
              {settings.siteIcon ? (
                <div className={styles.imagePreview}>
                  <Image
                    src={typeof settings.siteIcon === 'string'
                      ? (settings.siteIcon.startsWith('blob:')
                        ? settings.siteIcon
                        : `/media/${settings.siteIcon}`)
                      : settings.siteIcon.url}
                    alt="Site icon preview"
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/favicon.ico' // Fallback icon
                    }}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleSettingChange('siteIcon', null)}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleIconUpload(e)}
                    className={styles.fileInput}
                    id="siteIconUpload"
                  />
                  <label htmlFor="siteIconUpload" className={styles.uploadLabel}>
                    🔗 Upload Site Icon
                  </label>
                  <p>Recommended: 32x32px or 64x64px square image</p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.settingItem}>
            <label>Menu Preview Images</label>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 8px 0' }}>
              These images appear when hovering over menu items
            </p>

            {['about', 'work', 'blog', 'contact'].map((menuItem) => (
              <div key={menuItem} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', textTransform: 'capitalize', marginBottom: '8px', display: 'block' }}>
                  {menuItem} Page Image
                </label>
                <div className={styles.imageUpload}>
                  {settings.menuPreviewImages[menuItem as keyof typeof settings.menuPreviewImages] ? (
                    <div className={styles.imagePreview}>
                      <Image
                        src={typeof settings.menuPreviewImages[menuItem as keyof typeof settings.menuPreviewImages] === 'string'
                          ? (settings.menuPreviewImages[menuItem as keyof typeof settings.menuPreviewImages] as string).startsWith('blob:')
                            ? settings.menuPreviewImages[menuItem as keyof typeof settings.menuPreviewImages] as string
                            : `/media/${settings.menuPreviewImages[menuItem as keyof typeof settings.menuPreviewImages]}`
                          : ((settings.menuPreviewImages[menuItem as keyof typeof settings.menuPreviewImages] as any)?.url || '/images/home/portrait.png')}
                        alt={`${menuItem} preview image`}
                        style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/home/portrait.png'
                        }}
                      />
                      <button
                        type="button"
                        className={styles.removeImageButton}
                        onClick={() => handleSettingChange(`menuPreviewImages.${menuItem}`, null)}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleMenuImageUpload(e, menuItem)}
                        className={styles.fileInput}
                        id={`menuPreviewImage${menuItem}Upload`}
                      />
                      <label htmlFor={`menuPreviewImage${menuItem}Upload`} className={styles.uploadLabel}>
                        🖼️ Upload {menuItem} Image
                      </label>
                      <p>400x300px landscape</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3>Homepage Hero Section</h3>
          <div className={styles.settingItem}>
            <label>Hero Title (Top Line)</label>
            <input
              type="text"
              value={settings.heroTitleTop}
              onChange={(e) => handleSettingChange('heroTitleTop', e.target.value)}
              placeholder="e.g., MOHAMMAD"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Hero Title (Bottom Line)</label>
            <input
              type="text"
              value={settings.heroTitleBottom}
              onChange={(e) => handleSettingChange('heroTitleBottom', e.target.value)}
              placeholder="e.g., KHALID"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Hero Subtitle</label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => handleSettingChange('heroSubtitle', e.target.value)}
              placeholder="e.g., Interaction Designer"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Hero Tagline</label>
            <input
              type="text"
              value={settings.heroTagline}
              onChange={(e) => handleSettingChange('heroTagline', e.target.value)}
              placeholder="e.g., Based in Toronto"
            />
          </div>
          <div className={styles.settingItem}>
            <label>Hero Image</label>
            <div className={styles.imageUpload}>
              {settings.heroImage ? (
                <div className={styles.imagePreview}>
                  <Image
                    src={typeof settings.heroImage === 'string'
                      ? (settings.heroImage.startsWith('blob:')
                        ? settings.heroImage
                        : `/media/${settings.heroImage}`)
                      : (settings.heroImage?.url || '/images/home/portrait.png')}
                    alt="Hero image preview"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/home/portrait.png' // Fallback image
                      console.log('Hero image failed to load:', target.src)
                    }}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => handleSettingChange('heroImage', null)}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                    id="heroImageUpload"
                  />
                  <label htmlFor="heroImageUpload" className={styles.uploadLabel}>
                    📷 Upload Hero Image
                  </label>
                  <p>Recommended: 350x500px portrait image</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3>Footer Settings</h3>
          <div className={styles.settingItem}>
            <label>Footer Text</label>
            <textarea
              value={settings.footerText}
              onChange={(e) => handleSettingChange('footerText', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className={styles.settingGroup}>
          <h3>Custom Menu Items</h3>
          <div className={styles.settingItem}>
            <label>Menu Items</label>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '8px 0' }}>
              {settings.customMenuItems.length === 0
                ? 'No custom menu items configured'
                : `${settings.customMenuItems.length} custom menu items`}
            </p>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                // TODO: Implement menu item management
                alert('Menu item management coming soon!')
              }}
            >
              Manage Menu Items
            </button>
          </div>
        </div>
      </div>

      <div className={styles.settingsActions}>
        <button
          className={styles.primaryButton}
          onClick={handleSaveSettings}
          disabled={isSavingSettings}
        >
          {isSavingSettings ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dashboard</h1>
          <div className={styles.headerActions}>
            <span className={styles.userInfo}>Welcome back! 👋</span>
            <button
              className={styles.previewButton}
              onClick={() => window.open('/', '_blank')}
            >
              <span>🌐</span>
              Preview Site
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <nav className={styles.navigation}>
        <div className={styles.navTabs}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'projects', label: 'Projects', icon: '📁' },
            { id: 'blog', label: 'Blog', icon: '📝' },
            { id: 'media', label: 'Media', icon: '🖼️' },
            { id: 'about', label: 'About', icon: '👤' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`${styles.navTab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'blog' && renderBlog()}
        {activeTab === 'media' && renderMedia()}
        {activeTab === 'about' && renderAbout()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />

      {editingProject && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingProject(null)
          }}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          project={editingProject}
        />
      )}
    </div>
  )
} 