import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '../../../../../payload.config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await req.json()
    
    const { projects } = body
    
    if (!Array.isArray(projects)) {
      return NextResponse.json({ 
        error: 'Invalid format. Expected an array of projects.' 
      }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (let i = 0; i < projects.length; i++) {
      const projectData = projects[i]
      
      try {
        // Validate required fields
        if (!projectData.title) {
          results.failed++
          results.errors.push(`Project ${i + 1}: Title is required`)
          continue
        }
        
        if (!projectData.year) {
          results.failed++
          results.errors.push(`Project ${i + 1}: Year is required`)
          continue
        }
        
        if (!projectData.category) {
          results.failed++
          results.errors.push(`Project ${i + 1}: Category is required`)
          continue
        }

        // Note: featuredImage is required by the schema but we'll allow import without it
        // and let users add images later via the CMS interface

        // Validate category value
        const validCategories = ['web', 'mobile', 'branding', 'other']
        if (!validCategories.includes(projectData.category)) {
          results.failed++
          results.errors.push(`Project ${i + 1}: Invalid category. Must be one of: ${validCategories.join(', ')}`)
          continue
        }

        // Generate slug if not provided
        if (!projectData.slug && projectData.title) {
          projectData.slug = projectData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        // Set default status if not provided
        if (!projectData.status) {
          projectData.status = 'draft'
        }

        // Set default display order if not provided
        if (projectData.displayOrder === undefined) {
          projectData.displayOrder = 0
        }

        // Handle featured image requirement
        // Since featuredImage is required by Payload schema, we need to provide a default
        const createData = { ...projectData }
        
        // If featuredImage is null or undefined, use a placeholder image from existing media
        if (!createData.featuredImage) {
          // Get the first available media item as a placeholder
          try {
            const mediaResponse = await payload.find({
              collection: 'media',
              limit: 1,
              overrideAccess: true,
            })
            
            if (mediaResponse.docs.length > 0) {
              createData.featuredImage = mediaResponse.docs[0].id
              // Add a note that this is a placeholder
              if (!createData.description) {
                createData.description = 'Imported project - please update featured image'
              } else {
                createData.description += ' (Please update featured image)'
              }
            }
          } catch (mediaError) {
            results.failed++
            results.errors.push(`Project ${i + 1}: No media available for placeholder image. Please add media first or include featuredImage in JSON.`)
            continue
          }
        }
        
        // Remove null preview image
        if (!createData.previewImage) {
          delete createData.previewImage
        }

        // Create the project with draft validation disabled
        await payload.create({
          collection: 'projects',
          data: createData,
          overrideAccess: true,
          disableVerificationEmail: true,
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Project ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      message: `Import completed. ${results.success} projects imported successfully, ${results.failed} failed.`,
      results
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import projects' },
      { status: 500 }
    )
  }
} 