import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    
    // Fetch both site settings and homepage content
    const [siteSettings, homepage] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'homepage' })
    ])

    // Combine settings with homepage hero content
    const combinedSettings = {
      ...siteSettings,
      // Site branding
      logoTitle: siteSettings?.logoTitle || 'CURA FUTURI',
      siteTitle: siteSettings?.siteTitle || 'Cura Futuri - Interaction Designer',
      siteIcon: siteSettings?.siteIcon || null,
      menuPreviewImages: {
        about: siteSettings?.menuPreviewImageAbout 
          ? (siteSettings.menuPreviewImageAbout.url?.startsWith('/media/') 
              ? siteSettings.menuPreviewImageAbout 
              : { ...siteSettings.menuPreviewImageAbout, url: `/media/${siteSettings.menuPreviewImageAbout.filename}` })
          : null,
        work: siteSettings?.menuPreviewImageWork 
          ? (siteSettings.menuPreviewImageWork.url?.startsWith('/media/') 
              ? siteSettings.menuPreviewImageWork 
              : { ...siteSettings.menuPreviewImageWork, url: `/media/${siteSettings.menuPreviewImageWork.filename}` })
          : null,
        blog: siteSettings?.menuPreviewImageBlog 
          ? (siteSettings.menuPreviewImageBlog.url?.startsWith('/media/') 
              ? siteSettings.menuPreviewImageBlog 
              : { ...siteSettings.menuPreviewImageBlog, url: `/media/${siteSettings.menuPreviewImageBlog.filename}` })
          : null,
        contact: siteSettings?.menuPreviewImageContact 
          ? (siteSettings.menuPreviewImageContact.url?.startsWith('/media/') 
              ? siteSettings.menuPreviewImageContact 
              : { ...siteSettings.menuPreviewImageContact, url: `/media/${siteSettings.menuPreviewImageContact.filename}` })
          : null,
      },
      // Hero section from homepage (extract text from rich text if needed)
      heroTitle: homepage?.heroTitle?.root?.children?.[0]?.children?.[0]?.text || homepage?.heroTitle || 'MOHAMMAD KHALID',
      heroTitleTop: homepage?.heroTitleTop || 'MOHAMMAD',
      heroTitleBottom: homepage?.heroTitleBottom || 'KHALID',
      heroSubtitle: homepage?.heroSubtitle || 'Interaction Designer',
      heroTagline: homepage?.heroTagline || 'Based in Toronto',
      heroImage: homepage?.heroImage 
        ? (homepage.heroImage.url?.startsWith('/media/') 
            ? homepage.heroImage 
            : { ...homepage.heroImage, url: `/media/${homepage.heroImage.filename}` })
        : null
    }

    return NextResponse.json(combinedSettings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    
    // Return default settings if CMS is not available
    return NextResponse.json({
      siteName: 'Cura Futuri',
      siteDescription: 'Portfolio of Cura Futuri, an interaction designer based in Toronto specializing in digital experiences and creative development.',
      footerText: '© 2024 Cura Futuri. All rights reserved.',
      customMenuItems: [],
      // Site branding defaults
      logoTitle: 'CURA FUTURI',
      siteTitle: 'Cura Futuri - Interaction Designer',
      siteIcon: null,
      menuPreviewImages: {
        about: null,
        work: null,
        blog: null,
        contact: null,
      },
      // Default hero content
      heroTitle: 'MOHAMMAD KHALID',
      heroTitleTop: 'MOHAMMAD',
      heroTitleBottom: 'KHALID',
      heroSubtitle: 'Interaction Designer',
      heroTagline: 'Based in Toronto',
      heroImage: null
    })
  }
}

export async function POST(request: Request) {
  try {
    const settingsData = await request.json()
    const payload = await getPayloadClient()
    
    // Separate hero content from site settings
    const { heroTitle, heroTitleTop, heroTitleBottom, heroSubtitle, heroTagline, heroImage, siteIcon, menuPreviewImages, ...siteSettingsData } = settingsData
    
    // Process images - extract ID if it's an object, otherwise use as-is
    const processedHeroImage = heroImage 
      ? (typeof heroImage === 'object' && heroImage.id ? heroImage.id : heroImage)
      : null
    const processedSiteIcon = siteIcon 
      ? (typeof siteIcon === 'object' && siteIcon.id ? siteIcon.id : siteIcon)
      : null
    
    // Process menu preview images
    const processedMenuPreviewImages = menuPreviewImages ? {
      about: menuPreviewImages.about 
        ? (typeof menuPreviewImages.about === 'object' && menuPreviewImages.about.id ? menuPreviewImages.about.id : menuPreviewImages.about)
        : null,
      work: menuPreviewImages.work 
        ? (typeof menuPreviewImages.work === 'object' && menuPreviewImages.work.id ? menuPreviewImages.work.id : menuPreviewImages.work)
        : null,
      blog: menuPreviewImages.blog 
        ? (typeof menuPreviewImages.blog === 'object' && menuPreviewImages.blog.id ? menuPreviewImages.blog.id : menuPreviewImages.blog)
        : null,
      contact: menuPreviewImages.contact 
        ? (typeof menuPreviewImages.contact === 'object' && menuPreviewImages.contact.id ? menuPreviewImages.contact.id : menuPreviewImages.contact)
        : null,
    } : { about: null, work: null, blog: null, contact: null }
    
    // Update both site settings and homepage content
    const [updatedSettings, updatedHomepage] = await Promise.all([
      // Update site settings
      payload.updateGlobal({
        slug: 'site-settings',
        data: {
          ...siteSettingsData,
          siteIcon: processedSiteIcon,
          menuPreviewImageAbout: processedMenuPreviewImages.about,
          menuPreviewImageWork: processedMenuPreviewImages.work,
          menuPreviewImageBlog: processedMenuPreviewImages.blog,
          menuPreviewImageContact: processedMenuPreviewImages.contact
        },
      }),
      // Update homepage hero content
      payload.updateGlobal({
        slug: 'homepage',
        data: {
          heroTitle: typeof heroTitle === 'string' 
            ? {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: heroTitle
                        }
                      ]
                    }
                  ]
                }
              }
            : heroTitle,
          heroTitleTop,
          heroTitleBottom,
          heroSubtitle,
          heroTagline,
          heroImage: processedHeroImage
        },
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Settings and hero content saved successfully',
      data: {
        siteSettings: updatedSettings,
        homepage: updatedHomepage
      }
    })
  } catch (error) {
    console.error('Error saving site settings:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to save settings. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 