import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    
    // Fetch homepage content from CMS with populated relationships
    const homepage = await payload.findGlobal({
      slug: 'homepage',
      depth: 2, // Populate relationships like heroImage
    })

    // Extract text from rich text fields if they exist
    const transformedHomepage = {
      ...homepage,
      heroTitle: homepage?.heroTitle?.root?.children?.[0]?.children?.[0]?.text || homepage?.heroTitle || 'MOHAMMAD KHALID',
      heroTitleTop: homepage?.heroTitleTop || 'MOHAMMAD',
      heroTitleBottom: homepage?.heroTitleBottom || 'KHALID',
      // Ensure hero image URL is correct
      heroImage: homepage?.heroImage 
        ? (homepage.heroImage.url?.startsWith('/media/') 
            ? homepage.heroImage 
            : { ...homepage.heroImage, url: `/media/${homepage.heroImage.filename}` })
        : null
    }

    return NextResponse.json(transformedHomepage)
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    
    // Return default homepage content if CMS is not available
    return NextResponse.json({
      heroTitle: 'MOHAMMAD KHALID',
      heroTitleTop: 'MOHAMMAD',
      heroTitleBottom: 'KHALID',
      heroSubtitle: 'Interaction Designer',
      heroTagline: 'Based in Toronto',
      heroImage: null,
      aboutPreview: 'Creating meaningful digital experiences that bridge technology and human needs.',
      featuredProjects: []
    }, { status: 200 }) // Ensure we return 200 even on error
  }
}

export async function POST(request: Request) {
  try {
    const homepageData = await request.json()
    const payload = await getPayloadClient()
    
    // Transform heroTitle to rich text format if it's a string
    const transformedData = {
      ...homepageData,
      heroTitle: typeof homepageData.heroTitle === 'string' 
        ? {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: homepageData.heroTitle
                    }
                  ]
                }
              ]
            }
          }
        : homepageData.heroTitle
    }
    
    // Update homepage content in CMS
    const updatedHomepage = await payload.updateGlobal({
      slug: 'homepage',
      data: transformedData,
    })

    return NextResponse.json({
      success: true,
      message: 'Homepage content saved successfully',
      data: updatedHomepage
    })
  } catch (error) {
    console.error('Error saving homepage content:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to save homepage content. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 