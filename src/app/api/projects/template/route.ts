import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Create a template showing the expected JSON structure for project imports
    const template = {
      projects: [
        {
          // Basic Information (Required fields marked with *)
          title: "Sample Project Title", // * Required
          slug: "sample-project-title", // Auto-generated if not provided
          description: "Brief description of the project for previews and SEO",
          year: "2024", // * Required
          category: "web", // * Required: "web", "mobile", "branding", or "other"
          
          // Project Content
          richContent: null, // Rich text content for full case study - leave null for now, can be edited in CMS
          
          // Images & Media (Note: Upload images via CMS first, then reference by ID)
          // IMPORTANT: featuredImage can be left null during import
          // If null, a placeholder image will be used automatically
          // You can then update the image via the CMS interface after importing
          featuredImage: null, // Upload ID from media collection, or null for auto-placeholder
          previewImage: null, // Optional upload ID for hover image
          gallery: [
            // Array of gallery images - upload images first, then add IDs
            // {
            //   image: 123, // Upload ID from media collection
            //   caption: "Optional caption for this image"
            // }
          ],
          
          // Technical Details
          technologies: [
            { technology: "Next.js" },
            { technology: "TypeScript" },
            { technology: "GSAP" }
          ],
          liveUrl: "https://example.com", // Optional
          githubUrl: "https://github.com/username/project", // Optional
          
          // Publishing Settings
          status: "draft", // "draft", "published", or "archived" (defaults to "draft")
          displayOrder: 0, // Order in project grid (lower numbers first, defaults to 0)
          
          // SEO Settings (Optional)
          seoData: {
            title: "Custom SEO Title", // Override default SEO title
            description: "Meta description for search engines",
            keywords: [
              { keyword: "web development" },
              { keyword: "portfolio" },
              { keyword: "nextjs" }
            ],
            ogImage: null // Upload ID for social media sharing image
          }
        },
        {
          // Minimal example showing only required fields
          title: "Another Project",
          year: "2023",
          category: "mobile"
          // All other fields are optional and will use defaults
        }
      ]
    }

    return new NextResponse(JSON.stringify(template, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="project-import-template.json"'
      }
    })

  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
} 