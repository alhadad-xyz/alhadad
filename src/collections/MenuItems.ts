import type { CollectionConfig } from 'payload'

export const MenuItems: CollectionConfig = {
    slug: 'menu-items',
    admin: {
        useAsTitle: 'label',
        defaultColumns: ['label', 'url', 'order', 'isActive'],
        group: 'Settings',
    },
    access: {
        read: () => true, // Public can read menu items
    },
    fields: [
        {
            name: 'label',
            type: 'text',
            required: true,
            admin: {
                description: 'The text displayed in the navigation',
            },
        },
        {
            name: 'url',
            type: 'text',
            required: true,
            admin: {
                description: 'The URL path (e.g., /about, /works, /contact)',
            },
        },
        {
            name: 'order',
            type: 'number',
            required: true,
            defaultValue: 0,
            admin: {
                description: 'Display order (lower numbers appear first)',
            },
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                description: 'Show/hide this menu item',
            },
        },
        {
            name: 'openInNewTab',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description: 'Open link in new tab',
            },
        },
        {
            name: 'icon',
            type: 'text',
            admin: {
                description: 'Optional icon name (for future use)',
            },
        },
    ],
}
