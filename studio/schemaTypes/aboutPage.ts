import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'aboutPage',
    title: 'About Page',
    type: 'document',
    fields: [
        defineField({
            name: 'heroImage',
            title: 'Hero Background Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'heroHeader',
            title: 'Hero Header',
            type: 'string',
            description: 'e.g. The Alchemist Behind It',
        }),
        defineField({
            name: 'bioParagraph1',
            title: 'Bio Paragraph 1',
            type: 'text',
        }),
        defineField({
            name: 'bioParagraph2',
            title: 'Bio Paragraph 2',
            type: 'text',
        }),
        defineField({
            name: 'skillsList',
            title: 'Skills / Tech Bubbles',
            type: 'array',
            description: 'All the floating skill bubbles on the About page (e.g. HTML, CSS, GSAP).',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'galleryImages',
            title: 'Gallery Cards',
            type: 'array',
            description: 'The sticky cards photo gallery. Each entry is an image with a code label.',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
                        { name: 'label', title: 'Code Label', type: 'string', description: 'e.g. X01-842' },
                    ],
                },
            ],
        }),
    ],
})
