import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'number',
            title: 'Project Number (e.g. 01, 02)',
            type: 'string',
        }),
        defineField({
            name: 'client',
            title: 'Client Name',
            type: 'string',
        }),
        defineField({
            name: 'year',
            title: 'Year',
            type: 'string',
        }),
        defineField({
            name: 'role',
            title: 'Role / Services',
            type: 'string',
            description: 'e.g. Design & Dev',
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Project Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'gallery',
            title: 'Project Gallery',
            type: 'array',
            of: [{ type: 'image' }],
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description (Slider)',
            type: 'text',
        }),
        defineField({
            name: 'longDescription',
            title: 'Long Description / Background (Project Page)',
            type: 'text',
        }),
        defineField({
            name: 'stack',
            title: 'Tech Stack (e.g. Next.js, Framer Motion)',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'clientReviewText',
            title: 'Client Review (2 paragraphs max)',
            type: 'text',
        }),
        defineField({
            name: 'liveUrl',
            title: 'Live Site URL',
            type: 'url',
        }),
    ],
})
