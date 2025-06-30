import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''

    const payload = await getPayloadClient()
    
    // Build where clause for filtering
    const whereClause: any = {}
    
    if (search) {
      whereClause.or = [
        {
          alt: {
            contains: search,
          },
        },
        {
          filename: {
            contains: search,
          },
        },
        {
          caption: {
            contains: search,
          },
        },
      ]
    }
    
    if (tag) {
      whereClause['tags.tag'] = {
        contains: tag,
      }
    }

    const result = await payload.find({
      collection: 'media',
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      page,
      limit,
      sort: '-createdAt', // Sort by newest first
    })

    // Format the response data
    const formattedDocs = result.docs.map((doc: any) => ({
      id: doc.id,
      filename: doc.filename,
      alt: doc.alt,
      caption: doc.caption,
      url: doc.url,
      thumbnailURL: doc.thumbnailURL,
      mimeType: doc.mimeType,
      filesize: doc.filesize,
      width: doc.width,
      height: doc.height,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      sizes: doc.sizes,
    }))

    return NextResponse.json({
      success: true,
      data: {
        docs: formattedDocs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    })

  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch media files',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Media ID is required'
      }, { status: 400 })
    }

    const payload = await getPayloadClient()
    
    await payload.delete({
      collection: 'media',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Media file deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete media file',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Media ID is required'
      }, { status: 400 })
    }

    const body = await request.json()
    const { alt, caption, tags } = body

    const payload = await getPayloadClient()
    
    const result = await payload.update({
      collection: 'media',
      id,
      data: {
        alt: alt || 'Uploaded image',
        caption: caption || null,
        tags: tags || [],
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Media file updated successfully',
      data: {
        id: result.id,
        alt: result.alt,
        caption: result.caption,
        tags: result.tags,
        filename: result.filename,
        url: result.url,
      }
    })

  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update media file',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 