import React from 'react'
import Image from 'next/image'
import type { Media } from '../../payload-types'
import styles from './RichTextRenderer.module.css'

// Simple utility functions for media handling (client-safe)
const getMediaUrl = (media: Media | string | null, size?: 'thumbnail' | 'small' | 'medium' | 'large'): string => {
  if (!media) return '/images/placeholder.jpg'
  
  if (typeof media === 'string') {
    return media
  }

  // Use optimized size if available
  if (size && media.sizes && media.sizes[size]) {
    return media.sizes[size].url || media.url || '/images/placeholder.jpg'
  }

  return media.url || '/images/placeholder.jpg'
}

const getMediaAlt = (media: Media | string | null): string => {
  if (!media || typeof media === 'string') return 'Image'
  return media.alt || 'Image'
}

// Rich text content interfaces (matching Lexical editor structure)
interface RichTextNode {
  type: string
  version: number
  text?: string
  format?: number
  style?: string
  detail?: number
  mode?: string
  children?: RichTextNode[]
  direction?: 'ltr' | 'rtl' | null
  indent?: number
  tag?: string
  url?: string
  rel?: string
  title?: string
  target?: string
  src?: string | Media
  alt?: string
  width?: number
  height?: number
  showCaption?: boolean
  caption?: RichTextNode[]
}

interface RichTextContent {
  root: {
    type: string
    children: RichTextNode[]
    direction: 'ltr' | 'rtl' | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
  }
}

// Props for the RichTextRenderer
interface RichTextRendererProps {
  content: RichTextContent | string | null | undefined
  className?: string
  enableImageOptimization?: boolean
  enableAnimations?: boolean
}

// Text formatting utilities
const getTextClasses = (format: number = 0): string => {
  const classes: string[] = []
  
  // Lexical format flags
  if (format & 1) classes.push(styles.bold) // Bold
  if (format & 2) classes.push(styles.italic) // Italic
  if (format & 4) classes.push(styles.strikethrough) // Strikethrough
  if (format & 8) classes.push(styles.underline) // Underline
  if (format & 16) classes.push(styles.code) // Code
  if (format & 32) classes.push(styles.subscript) // Subscript
  if (format & 64) classes.push(styles.superscript) // Superscript
  if (format & 128) classes.push(styles.highlight) // Highlight
  
  return classes.join(' ')
}

// Node renderers
const renderTextNode = (node: RichTextNode, key: string): React.ReactElement => {
  const textClasses = getTextClasses(node.format)
  
  return (
    <span key={key} className={textClasses}>
      {node.text}
    </span>
  )
}

const renderParagraphNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[]
): React.ReactElement => {
  const alignmentClass = node.format ? styles[`align-${node.format}`] : ''
  const className = `${styles.paragraph} ${alignmentClass}`.trim()
  
  return (
    <p key={key} className={className}>
      {node.children ? renderChildren(node.children) : null}
    </p>
  )
}

const renderHeadingNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[]
): React.ReactElement => {
  const tag = node.tag || 'h2'
  const alignmentClass = node.format ? styles[`align-${node.format}`] : ''
  const className = `${styles.heading} ${styles[tag]} ${alignmentClass}`.trim()
  
  const children = node.children ? renderChildren(node.children) : null
  
  switch (tag) {
    case 'h1': return <h1 key={key} className={className}>{children}</h1>
    case 'h2': return <h2 key={key} className={className}>{children}</h2>
    case 'h3': return <h3 key={key} className={className}>{children}</h3>
    case 'h4': return <h4 key={key} className={className}>{children}</h4>
    case 'h5': return <h5 key={key} className={className}>{children}</h5>
    case 'h6': return <h6 key={key} className={className}>{children}</h6>
    default: return <h2 key={key} className={className}>{children}</h2>
  }
}

const renderLinkNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[]
): React.ReactElement => {
  const isExternal = node.url?.startsWith('http')
  const linkProps = {
    href: node.url || '#',
    className: `${styles.link} ${isExternal ? styles.external : styles.internal}`,
    ...(node.rel && { rel: node.rel }),
    ...(node.title && { title: node.title }),
    ...(node.target && { target: node.target }),
    ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }),
  }
  
  return (
    <a key={key} {...linkProps}>
      {node.children ? renderChildren(node.children) : null}
    </a>
  )
}

const renderListNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[]
): React.ReactElement => {
  const isOrdered = node.tag === 'ol'
  const ListTag = isOrdered ? 'ol' : 'ul'
  const className = `${styles.list} ${isOrdered ? styles.ordered : styles.unordered}`
  
  return (
    <ListTag key={key} className={className}>
      {node.children ? renderChildren(node.children) : null}
    </ListTag>
  )
}

const renderListItemNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[]
): React.ReactElement => {
  return (
    <li key={key} className={styles.listItem}>
      {node.children ? renderChildren(node.children) : null}
    </li>
  )
}

const renderQuoteNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[]
): React.ReactElement => {
  return (
    <blockquote key={key} className={styles.quote}>
      {node.children ? renderChildren(node.children) : null}
    </blockquote>
  )
}

const renderCodeBlockNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[]
): React.ReactElement => {
  return (
    <pre key={key} className={styles.codeBlock}>
      <code>
        {node.children ? renderChildren(node.children) : null}
      </code>
    </pre>
  )
}

const renderImageNode = (
  node: RichTextNode, 
  key: string, 
  enableImageOptimization: boolean = true
): React.ReactElement => {
  const src = typeof node.src === 'object' && node.src 
    ? getMediaUrl(node.src, 'large')
    : typeof node.src === 'string' 
    ? node.src 
    : '/images/placeholder.jpg'
    
  const alt = node.alt || (typeof node.src === 'object' && node.src ? getMediaAlt(node.src) : 'Image')
  
  const imageElement = enableImageOptimization ? (
    <Image
      src={src}
      alt={alt}
      width={node.width || 800}
      height={node.height || 600}
      className={styles.image}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
    />
  ) : (
    <img
      src={src}
      alt={alt}
      className={styles.image}
      style={{
        width: node.width ? `${node.width}px` : 'auto',
        height: node.height ? `${node.height}px` : 'auto',
      }}
    />
  )
  
  return (
    <figure key={key} className={styles.figure}>
      {imageElement}
      {node.showCaption && node.caption && (
        <figcaption className={styles.caption}>
          {node.caption.map((captionNode, index) => 
            renderNode(captionNode, `caption-${index}`, (children: RichTextNode[]) => 
              children.map((child, idx) => renderNode(child, `caption-child-${idx}`, () => [], enableImageOptimization))
            , enableImageOptimization)
          )}
        </figcaption>
      )}
    </figure>
  )
}

const renderLineBreakNode = (key: string): React.ReactElement => {
  return <br key={key} />
}

// Main node renderer
const renderNode = (
  node: RichTextNode, 
  key: string, 
  renderChildren: (children: RichTextNode[]) => React.ReactElement[],
  enableImageOptimization: boolean = true
): React.ReactElement => {
  switch (node.type) {
    case 'text':
      return renderTextNode(node, key)
    
    case 'paragraph':
      return renderParagraphNode(node, key, renderChildren)
    
    case 'heading':
      return renderHeadingNode(node, key, renderChildren)
    
    case 'link':
      return renderLinkNode(node, key, renderChildren)
    
    case 'list':
      return renderListNode(node, key, renderChildren)
    
    case 'listitem':
      return renderListItemNode(node, key, renderChildren)
    
    case 'quote':
      return renderQuoteNode(node, key, renderChildren)
    
    case 'code':
      return renderCodeBlockNode(node, key, renderChildren)
    
    case 'image':
      return renderImageNode(node, key, enableImageOptimization)
    
    case 'linebreak':
      return renderLineBreakNode(key)
    
    default:
      // Fallback for unknown node types
      console.warn(`Unknown rich text node type: ${node.type}`)
      return (
        <div key={key} className={styles.unknown}>
          {node.children ? renderChildren(node.children) : null}
        </div>
      )
  }
}

// Main RichTextRenderer component
export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className = '',
  enableImageOptimization = true,
  enableAnimations = false,
}) => {
  if (!content) {
    return null
  }

  // Handle string content (fallback)
  if (typeof content === 'string') {
    return (
      <div className={`${styles.richText} ${className}`}>
        <p className={styles.paragraph}>{content}</p>
      </div>
    )
  }

  // Recursive function to render children
  const renderChildren = (children: RichTextNode[]): React.ReactElement[] => {
    return children.map((child, index) => 
      renderNode(child, `node-${index}`, renderChildren, enableImageOptimization)
    )
  }

  const containerClasses = [
    styles.richText,
    className,
    enableAnimations ? styles.animated : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {content.root.children ? renderChildren(content.root.children) : null}
    </div>
  )
}

// Utility functions
export const richTextUtils = {
  // Extract plain text from rich text content
  extractPlainText(content: RichTextContent | string | null | undefined): string {
    if (!content) return ''
    
    if (typeof content === 'string') return content
    
    const extractTextFromNodes = (nodes: RichTextNode[]): string => {
      return nodes.map(node => {
        if (node.type === 'text') {
          return node.text || ''
        }
        if (node.children) {
          return extractTextFromNodes(node.children)
        }
        return ''
      }).join('')
    }
    
    return extractTextFromNodes(content.root.children)
  },

  // Get reading time estimate
  getReadingTime(content: RichTextContent | string | null | undefined): number {
    const text = this.extractPlainText(content)
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
    const wordsPerMinute = 200
    return Math.ceil(wordCount / wordsPerMinute)
  },

  // Check if content has images
  hasImages(content: RichTextContent | string | null | undefined): boolean {
    if (!content || typeof content === 'string') return false
    
    const checkForImages = (nodes: RichTextNode[]): boolean => {
      return nodes.some(node => {
        if (node.type === 'image') return true
        if (node.children) return checkForImages(node.children)
        return false
      })
    }
    
    return checkForImages(content.root.children)
  },

  // Get first image from content
  getFirstImage(content: RichTextContent | string | null | undefined): string | null {
    if (!content || typeof content === 'string') return null
    
    const findFirstImage = (nodes: RichTextNode[]): string | null => {
      for (const node of nodes) {
        if (node.type === 'image' && node.src) {
          return typeof node.src === 'object' 
            ? getMediaUrl(node.src, 'medium')
            : node.src
        }
        if (node.children) {
          const found = findFirstImage(node.children)
          if (found) return found
        }
      }
      return null
    }
    
    return findFirstImage(content.root.children)
  },

  // Generate excerpt from rich text
  generateExcerpt(content: RichTextContent | string | null | undefined, maxLength: number = 150): string {
    const text = this.extractPlainText(content)
    if (text.length <= maxLength) return text
    
    const trimmed = text.substring(0, maxLength).trim()
    const lastSpace = trimmed.lastIndexOf(' ')
    
    return lastSpace > 0 
      ? trimmed.substring(0, lastSpace) + '...'
      : trimmed + '...'
  },
}

export default RichTextRenderer 