import React, { useState } from 'react'
import '../../styles/createFood.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    video: null
  })
  const [isDragging, setIsDragging] = useState(false)
  const [videoPreview, setVideoPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const previewCounts = { likes: 23, saves: 23, comments: 45 }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, video: file }))
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, video: file }))
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in name and description.')
      return
    }
    if (!formData.video) {
      alert('Please select a video.')
      return
    }

    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.append('name', formData.name)
      fd.append('description', formData.description)
      fd.append('video', formData.video) // field name must match multer.single("video")

      const res = await axios.post('/api/food', fd, {
        withCredentials: true, // required if your route checks auth via cookie
        // DO NOT set Content-Type; the browser sets multipart boundary automatically
      })
      console.log('Food post created:', res.data)
      navigate("/");
      // optional: reset
      // setFormData({ name: '', description: '', video: null })
      // setVideoPreview('')
    } catch (err) {
      console.error('Create food failed:', err?.response?.data || err.message)
      alert(err?.response?.data?.message || 'Failed to create food.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-food-page">
      <form className="create-food-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Create New Food Post</h1>

        <div className="form-group">
          <label className="form-label" htmlFor="name">Food Name</label>
          <input
            type="text" id="name" name="name"
            className="form-input"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter the name of your dish"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description" name="description"
            className="form-input form-textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your food preparation..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Food Video</label>
          <div
            className={`video-upload ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleVideoChange}
              style={{ display: 'none' }}
            />
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div className="upload-text">
              {formData.video ? formData.video.name : 'Drag & drop your video here'}
            </div>
            <div className="upload-hint">
              or <label htmlFor="video" style={{ color: 'var(--accent)', cursor: 'pointer' }}>browse files</label>
            </div>
          </div>

          {videoPreview && (
            <div className="video-preview active">
              <div className="preview-overlay">
                <video src={videoPreview} controls playsInline />

                <div className="preview-actions" aria-hidden>
                  <div className="preview-action">
                    <button type="button" aria-label="Like">
                      {/* heart icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                      </svg>
                    </button>
                    <div className="count">likes : {previewCounts.likes}</div>
                  </div>

                  <div className="preview-action">
                    <button type="button" aria-label="Save">
                      {/* bookmark icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                        <path d="M6 2h12v18l-6-4-6 4V2z" />
                      </svg>
                    </button>
                    <div className="count">Save : {previewCounts.saves}</div>
                  </div>

                  <div className="preview-action">
                    <button type="button" aria-label="Comment">
                      {/* comment icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                    <div className="count">Comment:{previewCounts.comments}</div>
                  </div>
                </div>

                <div className="preview-info">
                  <div className="description-text">{formData.description || 'description'}</div>
                  <div className="visit-store-btn">
                    <button type="button" className="submit-button" style={{ padding: '8px 14px' }}>visit store</button>
                  </div>
                </div>

                <div className="preview-bottom-nav" role="navigation" aria-label="preview navigation">
                  <div className="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-6 9 6v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9z"/></svg>
                    <div>home</div>
                  </div>
                  <div className="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2h12v18l-6-4-6 4V2z"/></svg>
                    <div>saved</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'Uploading…' : 'Create Food Post'}
        </button>
      </form>
    </div>
  )
}

export default CreateFood
