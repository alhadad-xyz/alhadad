import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Slug is required'
      }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const posts = await payload.find({
      collection: 'blog-posts',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
      depth: 2, // Populate related fields including featuredImage
    })

    if (posts.docs.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Blog post not found'
      }, { status: 404 })
    }

    const post = posts.docs[0]

    // Format the response data
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      categories: post.categories,
      tags: post.tags,
      status: post.status,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      seoData: post.seoData,
    }

    return NextResponse.json({
      success: true,
      data: formattedPost
    })

  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 