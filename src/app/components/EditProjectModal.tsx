'use client'

import React, { useState, useEffect } from 'react'
import styles from './CreateProjectModal.module.css' // Reuse the same styles
import { uploadMediaFile } from '@/utils/media'

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  richContent?: any
  year: string
  category: string
  status: string
  technologies?: (string | { id: string; technology: string })[]
  clientName?: string
  liveUrl?: string
  githubUrl?: string
  featuredImage?: {
    id: number
    url: string
    alt: string
  } | number
  previewImage?: {
    id: number
    url: string
    alt: string
  } | number
  gallery?: { image: { id: number; url: string; alt: string } | number; caption?: string }[]
}

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (projectData: any) => void
  onDelete: (projectId: string) => void
  project: Project
}

export default function EditProjectModal({ isOpen, onClose, onUpdate, onDelete, project }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '', // Brief description
    richContent: '', // Long description/content
    year: '',
    category: '',
    status: 'draft',
    technologies: [] as string[],
    clientName: '',
    liveUrl: '',
    githubUrl: '',
    featuredImage: null as { id: number; url: string; alt: string } | number | null,
    previewImage: null as { id: number; url: string; alt: string } | number | null,
    gallery: [] as { image: { id: number; url: string; alt: string } | number; caption: string }[]
  })
  
  const [currentTechnology, setCurrentTechnology] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [previewImageUploading, setPreviewImageUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [hasUploadedNewImage, setHasUploadedNewImage] = useState(false)
  const [currentGalleryCaption, setCurrentGalleryCaption] = useState('')

  // Populate form with project data when modal opens
  useEffect(() => {
    if (isOpen && project) {
      // Transform technologies from API format to string array
      const transformedTechnologies = project.technologies?.map(tech => 
        typeof tech === 'string' ? tech : tech.technology
      ) || []

      // Handle featuredImage - if it's an object, extract the ID
      let featuredImageValue = null
      if (project.featuredImage) {
        featuredImageValue = typeof project.featuredImage === 'number' 
          ? project.featuredImage 
          : project.featuredImage.id
      }

      // Handle previewImage - if it's an object, extract the ID
      let previewImageValue = null
      if (project.previewImage) {
        previewImageValue = typeof project.previewImage === 'number' 
          ? project.previewImage 
          : project.previewImage.id
      }

      // Transform gallery from API format
      const transformedGallery = project.gallery?.map(item => ({
        image: typeof item.image === 'number' ? item.image : item.image.id,
        caption: item.caption || ''
      })) || []

      setFormData(prev => ({
        title: project.title || '',
        slug: project.slug || '',
        description: project.description || '',
        richContent: project.richContent || '',
        year: project.year || '',
        category: project.category || '',
        status: project.status || 'draft',
        technologies: transformedTechnologies,
        clientName: project.clientName || '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        // Only update featuredImage if we haven't uploaded a new one in this session
        featuredImage: hasUploadedNewImage ? prev.featuredImage : featuredImageValue,
        previewImage: previewImageValue,
        gallery: transformedGallery
      }))
    }
  }, [isOpen, project.id, hasUploadedNewImage]) // Include hasUploadedNewImage in dependencies

  // Reset upload state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasUploadedNewImage(false)
    }
  }, [isOpen])

  // Debug state changes
  useEffect(() => {
  }, [hasUploadedNewImage])

  useEffect(() => {
  }, [formData.featuredImage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const addTechnology = () => {
    if (currentTechnology.trim() && !formData.technologies.includes(currentTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, currentTechnology.trim()]
      }))
      setCurrentTechnology('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const result = await uploadMediaFile(
        file, 
        undefined,
        undefined
      )
      
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          featuredImage: result.data.id
        }))
        
        // Reset the file input
        event.target.value = ''

        // Mark that a new image has been uploaded in this session
        setHasUploadedNewImage(true)
      } else {
        alert(result.error || 'Failed to upload image. Please try again.')
      }
    } catch {
      alert('Failed to upload image. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  const handlePreviewImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPreviewImageUploading(true)
    try {
      const result = await uploadMediaFile(
        file, 
        undefined,
        undefined
      )
      
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          previewImage: result.data.id
        }))
        
        // Reset the file input
        event.target.value = ''
      } else {
        alert(result.error || 'Failed to upload preview image. Please try again.')
      }
    } catch {
      alert('Failed to upload preview image. Please try again.')
    } finally {
      setPreviewImageUploading(false)
    }
  }

  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setGalleryUploading(true)
    try {
      const result = await uploadMediaFile(
        file, 
        undefined,
        undefined
      )
      
      if (result.success && result.data) {
        const newGalleryItem = {
          image: result.data.id,
          caption: currentGalleryCaption || ''
        }
        
        setFormData(prev => ({
          ...prev,
          gallery: [...prev.gallery, newGalleryItem]
        }))
        
        // Reset inputs
        event.target.value = ''
        setCurrentGalleryCaption('')
      } else {
        alert(result.error || 'Failed to upload gallery image. Please try again.')
      }
    } catch {
      alert('Failed to upload gallery image. Please try again.')
    } finally {
      setGalleryUploading(false)
    }
  }

  const removeGalleryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Please enter a project title')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Include the project ID for the update
      const projectData = {
        id: project.id,
        ...formData
      }
      
      await onUpdate(projectData)
      
      onClose()
    } catch {
      alert('Failed to update project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(project.id)
      onClose()
    } catch {
      alert('Failed to delete project. Please try again.')
    }
  }

  const confirmDelete = () => {
    setShowDeleteConfirm(true)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Project</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter project title"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="project-slug"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Brief Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description shown in project preview and listings..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="richContent">Detailed Content</label>
            <textarea
              id="richContent"
              name="richContent"
              value={formData.richContent}
              onChange={handleInputChange}
              placeholder="Detailed project description, case study, process, challenges, and outcomes..."
              rows={6}
            />
            <p className={styles.fieldHelp}>This content will be displayed on the project detail page.</p>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="year">Year</label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2024"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="branding">Branding</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Technologies</label>
            <div className={styles.technologiesInput}>
              <input
                type="text"
                value={currentTechnology}
                onChange={(e) => setCurrentTechnology(e.target.value)}
                placeholder="Add technology"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <button type="button" onClick={addTechnology}>Add</button>
            </div>
            <div className={styles.technologiesList}>
              {formData.technologies.map((tech, index) => (
                <span key={index} className={styles.technologyTag}>
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="clientName">Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Client or company name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="liveUrl">Live URL</label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="githubUrl">GitHub URL</label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Featured Image</label>
            <div className={styles.imageUpload}>
              {/* Show current image if it exists and no new upload */}
              {formData.featuredImage && typeof formData.featuredImage === 'object' && !imageUploading && (
                <div className={styles.imagePreview}>
                  <img 
                    src={formData.featuredImage.url} 
                    alt={formData.featuredImage.alt}
                  />
                  <button 
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => setFormData(prev => ({ ...prev, featuredImage: null }))}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
              
              {/* Show upload success if new image uploaded */}
              {formData.featuredImage && typeof formData.featuredImage === 'number' && hasUploadedNewImage && (
                <div className={styles.uploadSuccess}>
                  <div className={styles.successHeader}>
                    <span className={styles.successIcon}>✅</span>
                    <span>New image uploaded successfully (ID: {formData.featuredImage})</span>
                  </div>
                  <div className={styles.customNameDisplay}>
                    Ready to save changes
                  </div>
                </div>
              )}
              
              {/* Upload area - always show for new uploads */}
              <div className={styles.uploadPlaceholder}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploading}
                  className={styles.fileInput}
                  id="featuredImageUpload"
                />
                <label htmlFor="featuredImageUpload" className={styles.uploadLabel}>
                  📷 {formData.featuredImage ? 'Change Image' : 'Upload Featured Image'}
                </label>
                <p>Recommended: High-quality project screenshot or featured image</p>
                {imageUploading && <p className={styles.uploadingText}>Uploading...</p>}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Preview Image (Optional)</label>
            <div className={styles.imageUpload}>
              {/* Show current preview image if it exists */}
              {formData.previewImage && typeof formData.previewImage === 'object' && !previewImageUploading && (
                <div className={styles.imagePreview}>
                  <img 
                    src={formData.previewImage.url} 
                    alt={formData.previewImage.alt}
                  />
                  <button 
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => setFormData(prev => ({ ...prev, previewImage: null }))}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
              
              {/* Show upload success if new preview image uploaded */}
              {formData.previewImage && typeof formData.previewImage === 'number' && (
                <div className={styles.uploadSuccess}>
                  <div className={styles.successHeader}>
                    <span className={styles.successIcon}>✅</span>
                    <span>Preview image uploaded successfully (ID: {formData.previewImage})</span>
                  </div>
                </div>
              )}
              
              {/* Upload area */}
              <div className={styles.uploadPlaceholder}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePreviewImageUpload}
                  disabled={previewImageUploading}
                  className={styles.fileInput}
                  id="previewImageUpload"
                />
                <label htmlFor="previewImageUpload" className={styles.uploadLabel}>
                  🖼️ {formData.previewImage ? 'Change Preview Image' : 'Upload Preview Image'}
                </label>
                <p>Image shown on hover in works page (optional, same dimensions as featured)</p>
                {previewImageUploading && <p className={styles.uploadingText}>Uploading...</p>}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Project Gallery</label>
            <div className={styles.gallerySection}>
              {/* Gallery Items */}
              {formData.gallery && formData.gallery.length > 0 && (
                <div className={styles.galleryItems}>
                  {formData.gallery.map((item, index) => (
                    <div key={index} className={styles.galleryItem}>
                      <div className={styles.galleryItemHeader}>
                        <span>Image ID: {typeof item.image === 'number' ? item.image : item.image.id}</span>
                        <button 
                          type="button" 
                          onClick={() => removeGalleryItem(index)}
                          className={styles.removeGalleryButton}
                        >
                          ✕
                        </button>
                      </div>
                      {item.caption && (
                        <p className={styles.galleryCaption}>{item.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Gallery Item */}
              <div className={styles.galleryUpload}>
                <div className={styles.galleryInputRow}>
                  <input
                    type="text"
                    value={currentGalleryCaption}
                    onChange={(e) => setCurrentGalleryCaption(e.target.value)}
                    placeholder="Image caption (optional)"
                    className={styles.galleryCaption}
                  />
                </div>
                <div className={styles.uploadPlaceholder}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageUpload}
                    disabled={galleryUploading}
                    className={styles.fileInput}
                    id="galleryImageUpload"
                  />
                  <label htmlFor="galleryImageUpload" className={styles.uploadLabel}>
                    🖼️ Add Gallery Image
                  </label>
                  <p>Add images to project gallery</p>
                  {galleryUploading && <p className={styles.uploadingText}>Uploading...</p>}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button 
              type="button" 
              onClick={confirmDelete} 
              className={styles.deleteButton}
              disabled={isSubmitting}
            >
              Delete Project
            </button>
            <div className={styles.rightActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmDialog}>
              <h3>Delete Project</h3>
              <p>Are you sure you want to delete &ldquo;<strong>{project.title}</strong>&rdquo;?</p>
              <p className={styles.warningText}>This action cannot be undone.</p>
              <div className={styles.confirmActions}>
                <button 
                  type="button" 
                  onClick={cancelDelete} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleDelete} 
                  className={styles.confirmDeleteButton}
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 