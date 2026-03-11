import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    fields: [
        defineField({
            name: 'heroName',
            title: 'Hero Name',
            type: 'string',
            description: 'Displayed as the large h1 on the homepage. e.g. Alhadad',
        }),
        defineField({
            name: 'heroCopy',
            title: 'Hero Description',
            type: 'text',
            description: 'The paragraph beneath the hero name.',
        }),
        defineField({
            name: 'heroTag1',
            title: 'Hero Tag 1',
            type: 'string',
            description: 'e.g. Interface Alchemy',
        }),
        defineField({
            name: 'heroTag2',
            title: 'Hero Tag 2',
            type: 'string',
            description: 'e.g. Scroll Sorcery',
        }),
        defineField({
            name: 'skillsetHeader',
            title: 'Skillset Section Header',
            type: 'string',
            description: 'e.g. Stuff I\'ve leveled up so you don\'t have to',
        }),
        defineField({
            name: 'skillsets',
            title: 'Skillset Cards',
            type: 'array',
            description: 'The 4 "Move 01-04" ability cards on the homepage.',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Card Label', type: 'string', description: 'e.g. Move 01' },
                        { name: 'title', title: 'Card Title', type: 'string', description: 'e.g. Strategy' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'servicesIntro',
            title: 'Services Section Intro',
            type: 'string',
            description: 'e.g. Equipped and ready for scroll battles',
        }),
        defineField({
            name: 'services',
            title: 'Services Cards (Flip Cards)',
            type: 'array',
            description: 'The 3 flip cards (Plan, Design, Develop).',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'number', title: 'Number', type: 'string', description: 'e.g. 01' },
                        { name: 'title', title: 'Title', type: 'string', description: 'e.g. Plan' },
                        { name: 'items', title: 'Back Items', type: 'array', of: [{ type: 'string' }] },
                    ],
                },
            ],
        }),
        defineField({
            name: 'spotlightIntroText',
            title: 'Spotlight Intro Header',
            type: 'string',
            description: 'e.g. Trends shout but Juno whispers',
        }),
        defineField({
            name: 'spotlightMaskImage',
            title: 'Spotlight Mask Background Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'spotlightMaskHeader',
            title: 'Spotlight Mask Reveal Header',
            type: 'string',
            description: 'e.g. Built This Face with Flexbox',
        }),
        defineField({
            name: 'outroText',
            title: 'Outro Header Text',
            type: 'string',
            description: 'e.g. Scroll ends but ideas don\'t',
        }),
        defineField({
            name: 'outroSkills',
            title: 'Outro Skill Tags (all strips combined)',
            type: 'array',
            description: 'The rolling skill tags in the outro section.',
            of: [{ type: 'string' }],
        }),
    ],
})
