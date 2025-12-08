import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'published'
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const includeContent = searchParams.get('includeContent') === 'true'

    const payload = await getPayloadClient()

    // Build where clause for filtering
    const whereClause: any = {}

    // Filter by status (for admin vs public)
    if (status !== 'all') {
      whereClause.status = { equals: status }
    }

    // Search functionality
    if (search) {
      whereClause.or = [
        {
          title: {
            contains: search,
          },
        },
        {
          excerpt: {
            contains: search,
          },
        },
        {
          'content': {
            contains: search,
          },
        },
      ]
    }

    // Filter by category
    if (category) {
      whereClause['categories.category'] = {
        contains: category,
      }
    }

    const result = await payload.find({
      collection: 'blog-posts',
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      page,
      limit,
      sort: '-publishedAt',
      depth: 2, // Populate related fields including featuredImage
      select: includeContent ? undefined : {
        content: false, // Exclude content for listing views to improve performance
      },
    })

    // Format the response data
    const formattedDocs = result.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: includeContent ? doc.content : undefined,
      featuredImage: doc.featuredImage,
      categories: doc.categories,
      tags: doc.tags,
      status: doc.status,
      publishedAt: doc.publishedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      seoData: doc.seoData,
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
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      categories,
      tags,
      status,
      publishedAt,
      seoData
    } = body

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        message: 'Title and content are required'
      }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Convert plain text content to Lexical rich text format for Payload
    const richTextContent = content ? {
      root: {
        type: 'root',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: content,
                type: 'text',
                version: 1,
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            textFormat: 0,
            version: 1,
          }
        ]
      }
    } : null

    const result = await payload.create({
      collection: 'blog-posts',
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || '',
        content: richTextContent,
        featuredImage: featuredImage || null,
        categories: categories || [],
        tags: tags || [],
        status: status || 'draft',
        publishedAt: publishedAt || (status === 'published' ? new Date() : null),
        seoData: seoData || {},
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: {
        id: result.id,
        title: result.title,
        slug: result.slug,
        status: result.status,
        publishedAt: result.publishedAt,
      }
    })

  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create blog post',
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
        message: 'Blog post ID is required'
      }, { status: 400 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      categories,
      tags,
      status,
      publishedAt,
      seoData
    } = body

    const payload = await getPayloadClient()

    // Convert plain text content to Lexical rich text format for Payload
    const richTextContent = content ? {
      root: {
        type: 'root',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: content,
                type: 'text',
                version: 1,
              }
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            textFormat: 0,
            version: 1,
          }
        ]
      }
    } : null

    const result = await payload.update({
      collection: 'blog-posts',
      id,
      data: {
        title,
        slug,
        excerpt,
        content: richTextContent,
        featuredImage,
        categories,
        tags,
        status,
        publishedAt: publishedAt || (status === 'published' && !publishedAt ? new Date() : publishedAt),
        seoData,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: {
        id: result.id,
        title: result.title,
        slug: result.slug,
        status: result.status,
        publishedAt: result.publishedAt,
      }
    })

  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update blog post',
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
        message: 'Blog post ID is required'
      }, { status: 400 })
    }

    const payload = await getPayloadClient()

    await payload.delete({
      collection: 'blog-posts',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 