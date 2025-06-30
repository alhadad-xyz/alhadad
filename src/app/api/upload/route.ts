import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'
import { generateFilename, isValidImageType } from '@/utils/media'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const customName = formData.get('customName') as string
    const altText = formData.get('altText') as string
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!isValidImageType(file.name)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()
    
    // Generate clean filename
    const cleanFilename = generateFilename(customName || '', file.name)
    
    // Use custom name for alt text if provided, otherwise use altText parameter
    const finalAltText = customName || altText || 'Uploaded image'
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create a file-like object that Payload expects with clean filename
    const uploadFile = {
      data: buffer,
      mimetype: file.type,
      name: cleanFilename, // Use the clean filename
      size: file.size,
    }

    // Upload to Payload media collection
    const result = await payload.create({
      collection: 'media',
      data: {
        alt: finalAltText,
      },
      file: uploadFile,
    })

    console.log('Upload result:', result) // Debug log
    
    // Ensure the URL is correct for Next.js static serving
    const correctUrl = result.url?.startsWith('/media/') 
      ? result.url 
      : `/media/${result.filename}`
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: result.id,
        url: correctUrl,
        alt: result.alt,
        filename: result.filename,
        originalName: file.name,
        customName: customName,
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to upload file. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 