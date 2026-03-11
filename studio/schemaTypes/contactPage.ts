import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'contactPage',
    title: 'Contact Page',
    type: 'document',
    fields: [
        defineField({
            name: 'headerTitle',
            title: 'Contact Page Header',
            type: 'string',
            description: 'e.g. Summon Juno to Your Project',
        }),
        defineField({
            name: 'contactGif',
            title: 'Contact GIF / Image',
            type: 'image',
        }),
    ],
})
