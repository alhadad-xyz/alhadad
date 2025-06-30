import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Database configuration using Supabase PostgreSQL
  db: postgresAdapter({
    pool: {
      connectionString: process.env.SUPABASE_DATABASE_URL,
    },
  }),

  // Admin panel configuration
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Portfolio CMS',
    },
  },

  // Rich text editor configuration
  editor: lexicalEditor({}),

  // Secret key for authentication
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-development',

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Collections (Database tables)
  collections: [
    // Projects Collection - Core portfolio projects
    {
      slug: 'projects',
      admin: {
        defaultColumns: ['title', 'featuredImage', 'category', 'year', 'status', 'updatedAt'],
        useAsTitle: 'title',
        group: 'Portfolio',
        description: 'Manage portfolio projects with rich media and case studies',
      },
      access: {
        read: () => true, // Public read access
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
      },
      fields: [
        // Basic Information Group
        {
          type: 'collapsible',
          label: 'Basic Information',
          admin: {
            initCollapsed: false,
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Project name as it appears on the portfolio',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              admin: {
                position: 'sidebar',
                description: 'URL-friendly version (auto-generated from title)',
              },
              hooks: {
                beforeValidate: [
                  ({ data }) => {
                    if (data?.title && !data?.slug) {
                      return data.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    }
                    return data?.slug;
                  },
                ],
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Brief description for project previews and SEO',
              },
            },
            {
              name: 'year',
              type: 'text',
              required: true,
              admin: {
                description: 'Year the project was completed',
              },
            },
            {
              name: 'category',
              type: 'select',
              options: [
                { label: 'Web Development', value: 'web' },
                { label: 'Mobile App', value: 'mobile' },
                { label: 'Branding', value: 'branding' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
          ],
        },

        // Rich Content Group
        {
          type: 'collapsible',
          label: 'Project Content',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'richContent',
              type: 'richText',
              admin: {
                description: 'Full project case study with images and formatting',
              },
            },
          ],
        },

        // Media Group  
        {
          type: 'collapsible',
          label: 'Images & Media',
          admin: {
            initCollapsed: false,
          },
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Main project image shown in grid view (recommended: 800x600px)',
              },
            },
            {
              name: 'previewImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image shown on hover in works page (optional, same dimensions as featured)',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              admin: {
                description: 'Additional images for project gallery',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  admin: {
                    description: 'Optional caption for this image',
                  },
                },
              ],
            },
          ],
        },

        // Technical Details Group
        {
          type: 'collapsible',
          label: 'Technical Details',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'technologies',
              type: 'array',
              admin: {
                description: 'Technologies used in this project',
              },
              fields: [
                {
                  name: 'technology',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'liveUrl',
              type: 'text',
              admin: {
                description: 'Link to live project (optional)',
              },
            },
            {
              name: 'githubUrl',
              type: 'text',
              admin: {
                description: 'Link to GitHub repository (optional)',
              },
            },
          ],
        },

        // Publishing Settings Group
        {
          type: 'collapsible',
          label: 'Publishing Settings',
          admin: {
            position: 'sidebar',
            initCollapsed: false,
          },
          fields: [
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
              defaultValue: 'draft',
              admin: {
                description: 'Publication status',
              },
            },
            {
              name: 'displayOrder',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Order in project grid (lower numbers first)',
              },
            },
          ],
        },

        // SEO Group (JSONB field for flexible metadata)
        {
          type: 'collapsible',
          label: 'SEO Settings',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'seoData',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Override default SEO title (optional)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Meta description for search engines',
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Override image for social media sharing',
                  },
                },
              ],
            },
          ],
        },
      ],
      timestamps: true,
    },

    // Blog Posts Collection - Full blog functionality
    {
      slug: 'blog-posts',
      admin: {
        defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
        useAsTitle: 'title',
        group: 'Content',
        description: 'Manage blog posts and articles',
      },
      access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          admin: {
            position: 'sidebar',
          },
          hooks: {
            beforeValidate: [
              ({ data }) => {
                if (data?.title && !data?.slug) {
                  return data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                }
                return data?.slug;
              },
            ],
          },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          admin: {
            description: 'Brief summary for blog listing pages',
          },
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Main image for the blog post',
          },
        },
        {
          name: 'categories',
          type: 'array',
          fields: [
            {
              name: 'category',
              type: 'text',
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            position: 'sidebar',
            description: 'Publication date and time',
          },
        },
        {
          name: 'seoData',
          type: 'group',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'keywords',
              type: 'array',
              fields: [
                {
                  name: 'keyword',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
      timestamps: true,
    },

    // Media Collection - File management
    {
      slug: 'media',
      admin: {
        group: 'Media',
        description: 'Upload and manage images and files',
      },
      access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
      },
      upload: {
        staticDir: 'public/media',
        adminThumbnail: ({ doc }) => `${doc.url}?w=200&h=150&fit=crop`,
        imageSizes: [
          {
            name: 'thumbnail',
            width: 200,
            height: 150,
            crop: 'centre',
          },
          {
            name: 'small',
            width: 600,
            height: undefined,
            crop: 'centre',
          },
          {
            name: 'medium',
            width: 1200,
            height: undefined,
            crop: 'centre',
          },
          {
            name: 'large',
            width: 1920,
            height: undefined,
            crop: 'centre',
          },
        ],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: {
            description: 'Describe this image for accessibility and SEO',
          },
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for image galleries',
          },
        },
        {
          name: 'tags',
          type: 'array',
          admin: {
            description: 'Tags for organizing and finding images',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
      ],
    },

    // Users Collection - Admin authentication
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
        group: 'Admin',
      },
      access: {
        read: ({ req: { user } }) => !!user,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          defaultValue: 'editor',
        },
      ],
    },
  ],

  // Global settings (Singleton collections)
  globals: [
    // Global Homepage Content
    {
      slug: 'homepage',
      admin: {
        group: 'Global Content',
        description: 'Manage homepage content and settings',
      },
      access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          type: 'collapsible',
          label: 'Hero Section',
          fields: [
            {
              name: 'heroTitle',
              type: 'richText',
              admin: {
                description: 'Legacy hero title field (for backwards compatibility)',
              },
            },
            {
              name: 'heroTitleTop',
              type: 'text',
              required: true,
              admin: {
                description: 'Hero title top line (e.g., "MOHAMMAD")',
              },
            },
            {
              name: 'heroTitleBottom',
              type: 'text',
              required: true,
              admin: {
                description: 'Hero title bottom line (e.g., "KHALID")',
              },
            },
            {
              name: 'heroSubtitle',
              type: 'text',
              required: true,
              admin: {
                description: 'Hero subtitle (currently "Interaction Designer")',
              },
            },
            {
              name: 'heroTagline',
              type: 'text',
              required: true,
              admin: {
                description: 'Hero tagline (currently "Based in Toronto")',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Hero section background or profile image',
              },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'About Preview',
          fields: [
            {
              name: 'aboutPreview',
              type: 'richText',
              admin: {
                description: 'Brief about section preview for homepage',
              },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Featured Projects',
          fields: [
            {
              name: 'featuredProjects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              maxRows: 4,
              admin: {
                description: 'Select up to 4 projects to feature on homepage',
              },
            },
          ],
        },
      ],
    },

    // Global About Content
    {
      slug: 'about',
      admin: {
        group: 'Global Content',
        description: 'Manage about page content',
      },
      access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          name: 'profileImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Professional profile photo for about page',
          },
        },
        {
          name: 'bio',
          type: 'richText',
          required: true,
          admin: {
            description: 'Professional biography',
          },
        },
        {
          name: 'skills',
          type: 'array',
          admin: {
            description: 'List of skills and expertise areas',
          },
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: true,
            },
            {
              name: 'proficiency',
              type: 'select',
              options: [
                { label: 'Expert', value: 'expert' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Beginner', value: 'beginner' },
              ],
              defaultValue: 'intermediate',
            },
          ],
        },
        {
          name: 'experience',
          type: 'array',
          admin: {
            description: 'Work experience and career history',
          },
          fields: [
            {
              name: 'company',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
            },
            {
              name: 'period',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "2020 - Present" or "Jan 2019 - Dec 2020"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Brief description of responsibilities and achievements',
              },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Contact Information',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              admin: {
                description: 'Contact email displayed on about page',
              },
            },
            {
              name: 'contactPhone',
              type: 'text',
              admin: {
                description: 'Phone number displayed on about page',
              },
            },
            {
              name: 'contactAddress',
              type: 'textarea',
              admin: {
                description: 'Address displayed on about page',
              },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Technical Skills & Tools',
          fields: [
            {
              name: 'technicalSkills',
              type: 'array',
              admin: {
                description: 'Technical skills organized by categories',
              },
              fields: [
                {
                  name: 'category',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., "Frontend", "Animation", "Backend", "Tools"',
                  },
                },
                {
                  name: 'primarySkills',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Main skills for this category (left column)',
                  },
                },
                {
                  name: 'secondarySkills',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Additional skills for this category (right column)',
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Content Sections',
          fields: [
            {
              name: 'marqueeText',
              type: 'text',
              admin: {
                description: 'Scrolling marquee text at the top of the page',
              },
            },
            {
              name: 'introTitle',
              type: 'richText',
              admin: {
                description: 'Main introduction title/paragraph',
              },
            },
            {
              name: 'establishedYear',
              type: 'text',
              admin: {
                description: 'Established year (e.g., "Est. 1997")',
              },
            },
            {
              name: 'aboutParagraphs',
              type: 'array',
              admin: {
                description: 'Main content paragraphs about your work and experience',
              },
              fields: [
                {
                  name: 'paragraph',
                  type: 'richText',
                  required: true,
                },
              ],
            },
            {
              name: 'callToActionTitle',
              type: 'text',
              admin: {
                description: 'Call to action section title (e.g., "Let\'s work together")',
              },
            },
            {
              name: 'callToActionText',
              type: 'richText',
              admin: {
                description: 'Call to action description text',
              },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'FAQ Section',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              admin: {
                description: 'Frequently asked questions',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },

    // Global Contact Content
    {
      slug: 'contact',
      admin: {
        group: 'Global Content',
        description: 'Manage contact information and social links',
      },
      access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'location',
          type: 'text',
          admin: {
            description: 'City, Country or full address',
          },
        },
        {
          name: 'socialLinks',
          type: 'array',
          admin: {
            description: 'Social media and professional profile links',
          },
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Dribbble', value: 'dribbble' },
                { label: 'Behance', value: 'behance' },
                { label: 'GitHub', value: 'github' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                description: 'Custom label (for "Other" platform type)',
              },
            },
          ],
        },
      ],
    },

    // Global Navigation & Site Settings
    {
      slug: 'site-settings',
      admin: {
        group: 'Global Content',
        description: 'Site-wide settings and navigation',
      },
      access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          name: 'siteName',
          type: 'text',
          required: true,
          defaultValue: 'Cura Futuri',
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          admin: {
            description: 'Default site description for SEO',
          },
        },
        {
          type: 'collapsible',
          label: 'Site Branding',
          fields: [
            {
              name: 'logoTitle',
              type: 'text',
              required: true,
              defaultValue: 'CURA FUTURI',
              admin: {
                description: 'Text that appears in the top-left corner of your site',
              },
            },
            {
              name: 'siteTitle',
              type: 'text',
              required: true,
              defaultValue: 'Cura Futuri - Interaction Designer',
              admin: {
                description: 'Title that appears in browser tabs and search results',
              },
            },
            {
              name: 'siteIcon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site icon (favicon) - recommended 32x32px or 64x64px square image',
              },
            },
            {
              name: 'menuPreviewImageAbout',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image that appears when hovering over "About" menu item - recommended 400x300px landscape image',
              },
            },
            {
              name: 'menuPreviewImageWork',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image that appears when hovering over "Work" menu item - recommended 400x300px landscape image',
              },
            },
            {
              name: 'menuPreviewImageBlog',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image that appears when hovering over "Blog" menu item - recommended 400x300px landscape image',
              },
            },
            {
              name: 'menuPreviewImageContact',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Image that appears when hovering over "Contact" menu item - recommended 400x300px landscape image',
              },
            },
          ],
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Default image for social media sharing',
          },
        },
        {
          name: 'footerText',
          type: 'richText',
          admin: {
            description: 'Footer content and copyright information',
          },
        },
        {
          name: 'customMenuItems',
          type: 'array',
          admin: {
            description: 'Additional navigation menu items (beyond default pages)',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],

  // Plugin configuration
  plugins: [],

  // CORS configuration
  cors: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3000',
  ],

  // CSRF configuration
  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3000',
  ],
})