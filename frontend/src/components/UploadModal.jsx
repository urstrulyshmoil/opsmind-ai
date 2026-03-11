import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function UploadModal({ onClose, setDocuments }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setProgress('📤 Uploading PDF...')

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData)
      const { documentId, totalChunks } = uploadRes.data
      setProgress(`🧠 Generating AI embeddings for ${totalChunks} chunks...`)

      await axios.post(`http://localhost:5000/api/embed/${documentId}`)

      setDocuments(prev => [...prev, { originalName: file.name, totalChunks }])

      toast.success(`✅ "${file.name}" added to knowledge base!`)
      onClose()

    } catch (err) {
      toast.error('Upload failed! Try again.')
      console.error(err)
    } finally {
      setUploading(false)
      setProgress('')
    }
  }, [onClose, setDocuments])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '40px',
            width: '480px',
            maxWidth: '90vw',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
          }}>
            <div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '20px',
                fontWeight: '800',
              }}>
                Upload Document
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Add PDFs to your knowledge base
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >✕</button>
          </div>

          {/* Dropzone */}
          {!uploading ? (
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#6c63ff' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '48px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? '#6c63ff10' : 'var(--surface2)',
                transition: 'all 0.2s',
              }}
            >
              <input {...getInputProps()} />
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {isDragActive ? '📂' : '📄'}
              </div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700',
                fontSize: '16px',
                marginBottom: '8px',
              }}>
                {isDragActive ? 'Drop it here!' : 'Drag & Drop your PDF'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                or click to browse files
              </div>
            </div>
          ) : (
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '48px 32px',
              textAlign: 'center',
              background: 'var(--surface2)',
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ fontSize: '48px', marginBottom: '16px' }}
              >
                ⚡
              </motion.div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700',
                fontSize: '16px',
                marginBottom: '8px',
              }}>
                Processing...
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {progress}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}