import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params
    const path = resolvedParams.path.join('/')
    
    // Extract filename from path (e.g., "file/project-1.jpg" -> "project-1.jpg")
    const filename = path.split('/').pop()
    
    if (!filename) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Get the file's update timestamp from database for proper cache-busting
    let cacheBuster = Date.now()
    try {
      const payload = await getPayloadClient()
      const mediaResult = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: filename,
          },
        },
        limit: 1,
      })
      
      if (mediaResult.docs.length > 0) {
        const updateTime = new Date(mediaResult.docs[0].updatedAt).getTime()
        cacheBuster = updateTime
      }
    } catch {
      console.log('Could not fetch file timestamp, using current time')
    }

    const staticUrl = `/media/${filename}?v=${cacheBuster}`
    
    // Create response with cache-busting headers
    const response = NextResponse.redirect(new URL(staticUrl, request.url))
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error serving media file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 