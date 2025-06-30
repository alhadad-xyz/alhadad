import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    
    // Fetch about content from CMS
    const about = await payload.findGlobal({
      slug: 'about',
    })

    // Helper function to extract text from rich text
    const extractRichText = (richText: any) => {
      if (!richText) return ''
      if (typeof richText === 'string') return richText
      return richText?.root?.children?.[0]?.children?.[0]?.text || ''
    }

    // Transform rich text fields for easier frontend consumption
    const transformedAbout = {
      ...about,
      // Fix profile image URL format for Next.js static serving
      profileImage: about?.profileImage ? {
        ...about.profileImage,
        url: about.profileImage.filename ? `/media/${about.profileImage.filename}` : about.profileImage.url
      } : null,
      bio: extractRichText(about?.bio) || 'Interaction Designer based in Toronto, specializing in creating meaningful digital experiences that bridge the gap between technology and human needs.',
      introTitle: extractRichText(about?.introTitle) || '',
      aboutParagraphs: about?.aboutParagraphs?.map((item: any) => ({
        ...item,
        paragraph: extractRichText(item.paragraph)
      })) || [],
      callToActionText: extractRichText(about?.callToActionText) || '',
      faqs: about?.faqs?.map((faq: any) => ({
        ...faq,
        answer: extractRichText(faq.answer)
      })) || []
    }

    return NextResponse.json(transformedAbout)
  } catch (error) {
    console.error('Error fetching about content:', error)
    
    // Return default about content if CMS is not available
    return NextResponse.json({
      profileImage: null,
      bio: 'Full Stack Developer based in Pasuruan, specializing in creating meaningful digital experiences that bridge the gap between technology and human needs.',
      skills: [
        { skill: 'UI/UX Design', proficiency: 'expert' },
        { skill: 'Frontend Development', proficiency: 'expert' },
        { skill: 'Backend Development', proficiency: 'advanced' },
        { skill: 'Animation & Motion', proficiency: 'advanced' },
        { skill: 'Database Design', proficiency: 'advanced' }
      ],
      experience: [
        {
          company: 'Freelance',
          role: 'Full Stack Developer',
          period: '2022 - Present',
          description: 'Developing web applications and digital experiences for various clients.'
        }
      ],
      // Contact Information
      contactEmail: 'hello@mohammadkhalid.dev',
      contactPhone: '+62 812 3456 7890',
      contactAddress: 'Pasuruan, East Java, Indonesia',
      // Technical Skills
      technicalSkills: [
        {
          category: 'Frontend',
          primarySkills: 'JavaScript, TypeScript',
          secondarySkills: 'React, Next.js, Vue.js'
        },
        {
          category: 'Animation',
          primarySkills: 'GSAP, Framer Motion',
          secondarySkills: 'Three.js, WebGL'
        },
        {
          category: 'Backend',
          primarySkills: 'Node.js, Express',
          secondarySkills: 'Python, PHP'
        },
        {
          category: 'Tools',
          primarySkills: 'Git, Docker, Webpack',
          secondarySkills: 'Figma, VS Code'
        }
      ],
      // Content Sections
      marqueeText: 'Transforming Your Digital Presence with Unforgettable Web Animations.',
      introTitle: 'Mohammad Khalid is an innovative Full Stack Developer, based in Pasuruan, specializing in bringing digital experiences to life. With a keen eye for detail and a passion for pushing the boundaries of web development.',
      establishedYear: 'Est. 1997',
      aboutParagraphs: [
        {
          paragraph: 'Mohammad Khalid partners with a broad spectrum of clients in Tech, Education, Entertainment, and eCommerce, crafting immersive web applications and interactive designs for brands of all shapes and sizes. With a focus on Frontend Development, User Interface (UI) Design, and Animation, Mohammad brings a unique blend of creativity and technical precision to every project.'
        },
        {
          paragraph: 'Renowned for pioneering in the field of web development and animation, Mohammad has been working on innovative projects that push the boundaries of what\'s possible on the web.'
        }
      ],
      callToActionTitle: 'Let\'s work together',
      callToActionText: 'Ready to bring your digital vision to life? Let\'s collaborate on creating something extraordinary.',
      // FAQ
      faqs: [
        {
          question: 'What type of works do you take on?',
          answer: 'I specialize in full stack web development and animation design, focusing on creating engaging and dynamic user experiences for websites and web applications. My work encompasses a range of projects, including interactive web applications, UI/UX design, motion graphics for online platforms, and custom animations for brand storytelling.'
        },
        {
          question: 'How do you charge for projects?',
          answer: 'My project pricing is tailored to the specific needs and scope of each project. I typically offer a project-based fee after a thorough discussion about the project\'s requirements, timelines, and expected deliverables. This approach allows for a clear understanding of the project costs upfront.'
        },
        {
          question: 'What is your hourly rate?',
          answer: 'While I primarily work with project-based pricing, I understand that some projects may require an hourly rate. My hourly rate varies depending on the complexity and scope of the work. For long-term engagements or larger projects, I am open to discussing a customized rate that aligns with the client\'s needs and project goals.'
        }
      ]
    })
  }
}

export async function POST(request: Request) {
  try {
    const aboutData = await request.json()
    const payload = await getPayloadClient()
    
    // Helper function to convert string to rich text format
    const stringToRichText = (text: string) => ({
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: text
              }
            ]
          }
        ]
      }
    })

    // Transform string fields to rich text format for Payload CMS
    const transformedData = {
      ...aboutData,
      // Handle profile image - extract ID if it's an object, or pass through if it's already an ID/null
      profileImage: aboutData.profileImage?.id || aboutData.profileImage || null,
      bio: typeof aboutData.bio === 'string' ? stringToRichText(aboutData.bio) : aboutData.bio,
      introTitle: typeof aboutData.introTitle === 'string' ? stringToRichText(aboutData.introTitle) : aboutData.introTitle,
      callToActionText: typeof aboutData.callToActionText === 'string' ? stringToRichText(aboutData.callToActionText) : aboutData.callToActionText,
      aboutParagraphs: aboutData.aboutParagraphs?.map((item: any) => ({
        ...item,
        paragraph: typeof item.paragraph === 'string' ? stringToRichText(item.paragraph) : item.paragraph
      })),
      faqs: aboutData.faqs?.map((faq: any) => ({
        ...faq,
        answer: typeof faq.answer === 'string' ? stringToRichText(faq.answer) : faq.answer
      }))
    }
    
    // Update about content in CMS
    const updatedAbout = await payload.updateGlobal({
      slug: 'about',
      data: transformedData,
    })

    return NextResponse.json({
      success: true,
      message: 'About page content saved successfully',
      data: updatedAbout
    })
  } catch (error) {
    console.error('Error saving about content:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to save about content. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 