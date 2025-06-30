'use client'

import React, { useState } from 'react'
import styles from './CreateProjectModal.module.css'
import { uploadMediaFile } from '@/utils/media'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectData: any) => void
}

export default function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    year: new Date().getFullYear().toString(),
    category: '',
    description: '', // Brief description
    richContent: '', // Long description/content
    status: 'draft',
    technologies: [] as string[],
    clientName: '',
    liveUrl: '',
    githubUrl: '',
    featuredImage: null as number | null,
    previewImage: null as number | null,
    gallery: [] as { image: number; caption: string }[],
  })
  
  const [currentTechnology, setCurrentTechnology] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [previewImageUploading, setPreviewImageUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [currentGalleryCaption, setCurrentGalleryCaption] = useState('')

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const result = await uploadMediaFile(
        file, 
        '',
        `${formData.title} - Featured Image`
      )
      
      if (result.success && result.data) {
        // Store the media ID for Payload CMS compatibility
        setFormData(prev => ({
          ...prev,
          featuredImage: result.data.id
        }))
        
        // Reset the file input
        event.target.value = ''
      } else {
        console.error('Upload failed:', result.error)
        setErrors(prev => ({ ...prev, featuredImage: result.error || 'Failed to upload image' }))
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors(prev => ({ ...prev, featuredImage: 'Failed to upload image. Please try again.' }))
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
        '',
        `${formData.title} - Preview Image`
      )
      
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          previewImage: result.data.id
        }))
        
        // Reset the file input
        event.target.value = ''
      } else {
        console.error('Preview upload failed:', result.error)
        setErrors(prev => ({ ...prev, previewImage: result.error || 'Failed to upload preview image' }))
      }
    } catch (error) {
      console.error('Preview upload error:', error)
      setErrors(prev => ({ ...prev, previewImage: 'Failed to upload preview image. Please try again.' }))
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
        '',
        `${formData.title} - Gallery Image`
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
        console.error('Gallery upload failed:', result.error)
        setErrors(prev => ({ ...prev, gallery: result.error || 'Failed to upload gallery image' }))
      }
    } catch (error) {
      console.error('Gallery upload error:', error)
      setErrors(prev => ({ ...prev, gallery: 'Failed to upload gallery image. Please try again.' }))
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare project data for API submission
      const projectData = {
        ...formData,
        technologies: formData.technologies.map(t => t.trim()).filter(Boolean)
      }

      // Call the API to create the project
      await onSubmit(projectData)
      onClose()
      
      // Reset form
      setFormData({
        title: '',
        slug: '',
        year: new Date().getFullYear().toString(),
        category: '',
        description: '',
        richContent: '',
        status: 'draft',
        technologies: [],
        clientName: '',
        liveUrl: '',
        githubUrl: '',
        featuredImage: null,
        previewImage: null,
        gallery: [],
      })
    } catch (error) {
      console.error('Error creating project:', error)
      setErrors({ submit: 'Failed to create project. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create New Project</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? styles.error : ''}
                placeholder="Enter project title"
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="slug">URL Slug *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={errors.slug ? styles.error : ''}
                placeholder="project-url-slug"
              />
              {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? styles.error : ''}
              >
                <option value="">Select category</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="branding">Branding</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <span className={styles.errorText}>{errors.category}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={errors.year ? styles.error : ''}
                min="2000"
                max="2030"
                placeholder="2024"
              />
              {errors.year && <span className={styles.errorText}>{errors.year}</span>}
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

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="githubUrl">GitHub URL</label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Brief Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? styles.error : ''}
              placeholder="Brief description shown in project preview and listings..."
              rows={3}
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
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

          <div className={styles.formGroup}>
            <label>Featured Image</label>
            <div className={styles.imageUpload}>
              {/* Show upload success if image uploaded */}
              {formData.featuredImage && (
                <div className={styles.uploadSuccess}>
                  <div className={styles.successHeader}>
                    <span className={styles.successIcon}>✅</span>
                    <span>Image uploaded successfully (ID: {formData.featuredImage})</span>
                  </div>
                </div>
              )}
              
              {/* Upload area */}
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
                  📷 Upload Featured Image
                </label>
                <p>Recommended: High-quality project screenshot or featured image</p>
                {imageUploading && <p className={styles.uploadingText}>Uploading...</p>}
              </div>
            </div>
            {errors.featuredImage && (
              <div className={styles.errorText}>
                {errors.featuredImage}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Preview Image (Optional)</label>
            <div className={styles.imageUpload}>
              {/* Show upload success if preview image uploaded */}
              {formData.previewImage && (
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
                  🖼️ Upload Preview Image
                </label>
                <p>Image shown on hover in works page (optional, same dimensions as featured)</p>
                {previewImageUploading && <p className={styles.uploadingText}>Uploading...</p>}
              </div>
            </div>
            {errors.previewImage && (
              <div className={styles.errorText}>
                {errors.previewImage}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Project Gallery</label>
            <div className={styles.gallerySection}>
              {/* Gallery Items */}
              {formData.gallery.length > 0 && (
                <div className={styles.galleryItems}>
                  {formData.gallery.map((item, index) => (
                    <div key={index} className={styles.galleryItem}>
                      <div className={styles.galleryItemHeader}>
                        <span>Image ID: {item.image}</span>
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
            {errors.gallery && (
              <div className={styles.errorText}>
                {errors.gallery}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className={styles.submitError}>
              {errors.submit}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 