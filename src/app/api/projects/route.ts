import { NextResponse, NextRequest } from 'next/server'
import { getAllProjects, getAllProjectsForDashboard, getPayloadClient } from '@/lib/payload-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const dashboard = searchParams.get('dashboard') // Check if this is a dashboard request

    if (slug) {
      // Fetch specific project by slug
      const payload = await getPayloadClient()
      const whereCondition: any = {
        slug: {
          equals: slug,
        },
      }

      // Only filter by published status if not a dashboard request
      if (!dashboard) {
        whereCondition.status = {
          equals: 'published',
        }
      }

      const result = await payload.find({
        collection: 'projects',
        where: whereCondition,
        limit: 1,
        depth: 2, // Populate media relationships
      })

      if (result.docs.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      return NextResponse.json(result.docs)
    } else {
      // Fetch all projects - use dashboard version if requested
      const projects = dashboard ? await getAllProjectsForDashboard() : await getAllProjects()
      return NextResponse.json(projects)
    }
  } catch (error) {
    console.error('Error fetching projects:', error)

    const { searchParams } = new URL(request.url)
    if (searchParams?.get('slug')) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Return fallback project data for all projects
    return NextResponse.json([
      {
        id: '1',
        title: 'Blisscove \'24',
        slug: 'blisscove-24',
        year: '2024',
        category: 'Web Design',
        featuredImage: {
          url: '/images/projects/project-1.jpg',
          alt: 'Blisscove \'24'
        },
        previewImage: {
          url: '/images/projects/project-1.jpg',
          alt: 'Blisscove \'24 Preview'
        }
      },
      {
        id: '2',
        title: 'Quantleaf',
        slug: 'quantleaf',
        year: '2023',
        category: 'App Design',
        featuredImage: {
          url: '/images/projects/project-2.jpg',
          alt: 'Quantleaf'
        },
        previewImage: {
          url: '/images/projects/project-2.jpg',
          alt: 'Quantleaf Preview'
        }
      },
      {
        id: '3',
        title: 'Mystrove Hue',
        slug: 'mystrove-hue',
        year: '2023',
        category: 'Branding',
        featuredImage: {
          url: '/images/projects/project-3.jpg',
          alt: 'Mystrove Hue'
        },
        previewImage: {
          url: '/images/projects/project-3.jpg',
          alt: 'Mystrove Hue Preview'
        }
      },
      {
        id: '4',
        title: 'Glintmark',
        slug: 'glintmark',
        year: '2022',
        category: 'Web Design',
        featuredImage: {
          url: '/images/projects/project-4.jpg',
          alt: 'Glintmark'
        },
        previewImage: {
          url: '/images/projects/project-4.jpg',
          alt: 'Glintmark Preview'
        }
      },
      {
        id: '5',
        title: 'La Dreamveil',
        slug: 'la-dreamveil',
        year: '2021',
        category: 'App Design',
        featuredImage: {
          url: '/images/projects/project-5.jpg',
          alt: 'La Dreamveil'
        },
        previewImage: {
          url: '/images/projects/project-5.jpg',
          alt: 'La Dreamveil Preview'
        }
      }
    ])
  }
}

export async function POST(request: Request) {
  try {
    const projectData = await request.json()
    console.log('POST - Received project data:', JSON.stringify(projectData, null, 2))
    console.log('POST - Gallery data:', projectData.gallery)

    const payload = await getPayloadClient()

    // Transform technologies from string array to object array
    const transformedTechnologies = projectData.technologies?.map((tech: string | { technology: string }) => {
      if (typeof tech === 'string') {
        return { technology: tech }
      }
      return tech
    }) || []

    // Create project in Payload CMS
    const newProject = await payload.create({
      collection: 'projects',
      data: {
        title: projectData.title,
        slug: projectData.slug,
        description: projectData.description,
        year: projectData.year,
        category: projectData.category,
        status: projectData.status || 'draft',
        technologies: transformedTechnologies,
        liveUrl: projectData.liveUrl,
        githubUrl: projectData.githubUrl,
        richContent: projectData.richContent,
        featuredImage: projectData.featuredImage,
        previewImage: projectData.previewImage,
        gallery: projectData.gallery || []
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    })
  } catch (error) {
    console.error('Error creating project:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to create project. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const projectData = await request.json()
    console.log('PUT - Received project data:', JSON.stringify(projectData, null, 2))
    console.log('PUT - Gallery data:', projectData.gallery)

    const { id, ...updateData } = projectData

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required for updates'
      }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Transform technologies from string array to object array
    const transformedTechnologies = updateData.technologies?.map((tech: string | { technology: string }) => {
      if (typeof tech === 'string') {
        return { technology: tech }
      }
      return tech
    }) || []

    // Update project in Payload CMS
    const updatedProject = await payload.update({
      collection: 'projects',
      id: id,
      data: {
        title: updateData.title,
        slug: updateData.slug,
        description: updateData.description,
        year: updateData.year,
        category: updateData.category,
        status: updateData.status,
        technologies: transformedTechnologies,
        liveUrl: updateData.liveUrl,
        githubUrl: updateData.githubUrl,
        richContent: updateData.richContent,
        featuredImage: updateData.featuredImage,
        previewImage: updateData.previewImage,
        gallery: updateData.gallery || []
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    })
  } catch (error) {
    console.error('Error updating project:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to update project. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Project ID is required for deletion'
      }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Delete project from Payload CMS
    await payload.delete({
      collection: 'projects',
      id: id,
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting project:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to delete project. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 