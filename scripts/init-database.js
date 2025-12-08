#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script helps initialize the Payload CMS database schema.
 * Run this script to create the necessary database tables and initial content.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting database initialization...\n')

// Check if we're in the right directory
if (!fs.existsSync('payload.config.ts')) {
  console.error('❌ Error: payload.config.ts not found. Please run this script from the project root.')
  process.exit(1)
}

// Check environment variables
const requiredEnvVars = ['SUPABASE_DATABASE_URL', 'PAYLOAD_SECRET']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error('❌ Error: Missing required environment variables:')
  missingEnvVars.forEach(envVar => console.error(`   - ${envVar}`))
  console.error('\nPlease add these to your .env.local file or environment variables.')
  process.exit(1)
}

console.log('✅ Environment variables configured')

try {
  // Step 1: Create migration
  console.log('\n📝 Creating database migration...')
  try {
    execSync('npx payload migrate:create', { stdio: 'inherit' })
    console.log('✅ Migration created successfully')
  } catch (error) {
    console.log('ℹ️  Migration already exists or no changes needed')
  }

  // Step 2: Run migration
  console.log('\n🔄 Running database migration...')
  execSync('npx payload migrate', { stdio: 'inherit' })
  console.log('✅ Database migration completed')

  // Step 3: Create initial content
  console.log('\n📝 Creating initial content...')
  
  // Create initial site settings
  const siteSettingsData = {
    siteName: 'Alhadad',
    siteDescription: 'Portfolio of Mohammad Khalid Alhadad, a Software Engineer based in Pasuruan.',
    logoTitle: 'ALHADAD',
    siteTitle: 'Mohammad Khalid Alhadad - Software Engineer',
    footerText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: '© 2024 Mohammad Khalid Alhadad. All rights reserved.'
              }
            ]
          }
        ]
      }
    }
  }

  // Create initial homepage content
  const homepageData = {
    heroTitleTop: 'MOHAMMAD KHALID I',
    heroTitleBottom: 'ALHADAD',
    heroSubtitle: 'Software Engineer',
    heroTagline: 'Pasuruan',
    heroTitle: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'MOHAMMAD KHALID'
              }
            ]
          }
        ]
      }
    }
  }

  // Create initial about content
  const aboutData = {
    bio: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Software Engineer with expertise in modern web technologies and full-stack development.'
              }
            ]
          }
        ]
      }
    },
    skills: [
      { skill: 'JavaScript/TypeScript', proficiency: 'expert' },
      { skill: 'React/Next.js', proficiency: 'expert' },
      { skill: 'Node.js', proficiency: 'advanced' },
      { skill: 'PostgreSQL', proficiency: 'advanced' }
    ],
    experience: [
      {
        company: 'Your Company',
        role: 'Software Engineer',
        period: '2023 - Present',
        description: 'Full-stack development with modern technologies'
      }
    ]
  }

  // Create initial contact content
  const contactData = {
    email: 'contact@alhadad.com',
    phone: '+62 xxx-xxx-xxxx',
    location: 'Pasuruan, Indonesia',
    socialLinks: [
      {
        platform: 'github',
        url: 'https://github.com/yourusername',
        label: 'GitHub'
      },
      {
        platform: 'linkedin',
        url: 'https://linkedin.com/in/yourusername',
        label: 'LinkedIn'
      }
    ]
  }

  console.log('✅ Initial content structure defined')
  console.log('\n📋 Next steps:')
  console.log('1. Visit your admin panel at /admin')
  console.log('2. Create your first admin user')
  console.log('3. Upload images and customize content')
  console.log('4. Test the API endpoints')

  console.log('\n🎉 Database initialization completed successfully!')

} catch (error) {
  console.error('\n❌ Error during database initialization:', error.message)
  console.error('\n🔧 Troubleshooting:')
  console.error('1. Check your SUPABASE_DATABASE_URL is correct')
  console.error('2. Ensure your Supabase project is active')
  console.error('3. Verify database permissions')
  console.error('4. Check network connectivity')
  process.exit(1)
} 