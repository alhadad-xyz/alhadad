import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'email',
            title: 'Contact Email',
            type: 'string',
            description: 'e.g. alhadad.dev@gmail.com',
        }),
        defineField({
            name: 'instagramUrl',
            title: 'Instagram URL',
            type: 'url',
        }),
        defineField({
            name: 'linkedinUrl',
            title: 'LinkedIn URL',
            type: 'url',
        }),
        defineField({
            name: 'twitterUrl',
            title: 'Twitter / X URL',
            type: 'url',
        }),
        defineField({
            name: 'youtubeUrl',
            title: 'YouTube URL',
            type: 'url',
        }),
        defineField({
            name: 'addressLine1',
            title: 'Address Line 1',
            type: 'string',
        }),
        defineField({
            name: 'addressLine2',
            title: 'Address Line 2',
            type: 'string',
        }),
        defineField({
            name: 'footerTagline',
            title: 'Footer Copyright Tagline',
            type: 'string',
            description: 'e.g. © 2025 All Rights Reserved',
        }),
    ],
})
