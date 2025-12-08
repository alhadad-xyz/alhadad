import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET() {
    try {
        const payload = await getPayloadClient()

        // Fetch active menu items, sorted by order
        const menuItems = await (payload as any).find({
            collection: 'menu-items',
            where: {
                isActive: {
                    equals: true,
                },
            },
            sort: 'order',
            limit: 100,
        })

        return NextResponse.json({
            success: true,
            data: menuItems.docs
        })
    } catch (error) {
        console.error('Error fetching menu items:', error)

        // Return default menu items if CMS is not available
        return NextResponse.json({
            success: true,
            data: [
                { label: 'About', url: '/about', order: 1, isActive: true, openInNewTab: false },
                { label: 'Work', url: '/works', order: 2, isActive: true, openInNewTab: false },
                { label: 'Blog', url: '/blog', order: 3, isActive: true, openInNewTab: false },
                { label: 'Contact', url: '/contact', order: 4, isActive: true, openInNewTab: false },
            ]
        })
    }
}
