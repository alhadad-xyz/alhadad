// TypeScript type definitions for the project

// Lexical Rich Text Types
export interface LexicalTextNode {
    type: 'text'
    text: string
    format?: number
    style?: string
}

export interface LexicalNode {
    type: string
    children?: LexicalNode[]
    text?: string
    format?: number
    [key: string]: unknown
}

export interface LexicalRootNode {
    type: 'root'
    children: LexicalNode[]
    direction: 'ltr' | 'rtl' | null
    format: string
    indent: number
    version: number
}

export interface LexicalContent {
    root: LexicalRootNode
}

// Payload CMS Types
export interface PayloadWhereClause {
    [key: string]: unknown
}

// Media Types
export interface MediaItem {
    id: number | string
    filename: string
    alt: string
    url: string
    mimeType?: string
    filesize?: number
    width?: number
    height?: number
    caption?: string
    tags?: Array<{ tag: string; id?: string }>
    sizes?: {
        thumbnail?: { url: string; width: number; height: number }
        small?: { url: string; width: number; height: number }
        medium?: { url: string; width: number; height: number }
        large?: { url: string; width: number; height: number }
    }
}

// Project Types
export interface ProjectData {
    id?: string
    title: string
    slug: string
    description?: string
    richContent?: LexicalContent | string
    year: string
    category: string
    status: 'draft' | 'published' | string // Allow string for flexibility
    technologies?: string[]
    clientName?: string
    liveUrl?: string
    githubUrl?: string
    featuredImage?: MediaItem | number | null // Allow null
    previewImage?: MediaItem | number | null // Allow null
    gallery?: Array<{ image: MediaItem | number; caption?: string }>
}

// About Page Types
export interface AboutParagraph {
    paragraph: string
}

export interface FAQ {
    question: string
    answer: string
}

// Upload Response Types
export interface UploadResponse {
    success: boolean
    data?: MediaItem
    error?: string
}

// Settings Change Value Type
export type SettingsValue = string | number | boolean | null | { url: string; alt: string } | unknown
