import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard({ onBack }) {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, docsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers }),
        axios.get('http://localhost:5000/api/admin/documents', { headers }),
      ])
      setStats(statsRes.data)
      setDocuments(docsRes.data)
    } catch (err) {
      toast.error('Failed to load dashboard data!')
    } finally {
      setLoading(false)
    }
  }

  const deleteDocument = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await axios.delete(`http://localhost:5000/api/admin/document/${id}`, { headers })
      toast.success('Document deleted!')
      setDocuments(prev => prev.filter(d => d._id !== id))
      setStats(prev => ({ ...prev, totalDocs: prev.totalDocs - 1 }))
    } catch (err) {
      toast.error('Delete failed!')
    }
  }

  const statCards = [
    { label: 'Total Documents', value: stats?.totalDocs || 0, icon: '📄', color: '#6c63ff' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#ff6584' },
    { label: 'Total Chunks', value: stats?.totalChunks || 0, icon: '🧩', color: '#00e5a0' },
    { label: 'AI Model', value: 'Llama 3.1', icon: '🤖', color: '#ffa500' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '32px',
      overflow: 'auto',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'radial-gradient(ellipse at top, #6c63ff08, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
      }}>
        <div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ⚡ Admin Dashboard
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
            OpsMind AI — Knowledge Base Management
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '10px 20px',
            color: 'var(--text)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ← Back to Chat
        </motion.button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ fontSize: '48px', marginBottom: '16px' }}
          >⚡</motion.div>
          <div>Loading dashboard...</div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {statCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-20px', right: '-20px',
                  width: '80px', height: '80px',
                  borderRadius: '50%',
                  background: `${card.color}15`,
                }} />
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{card.icon}</div>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '28px',
                  fontWeight: '800',
                  color: card.color,
                }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {card.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Documents Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Table Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: '700',
                fontSize: '16px',
              }}>
                📚 Knowledge Base Documents
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                background: 'var(--surface2)',
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
              }}>
                {documents.length} documents
              </div>
            </div>

            {/* Table */}
            {documents.length === 0 ? (
              <div style={{
                padding: '60px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                No documents uploaded yet
              </div>
            ) : (
              <div>
                {/* Column Headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 180px 100px',
                  padding: '12px 24px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface2)',
                }}>
                  <div>Document Name</div>
                  <div>Chunks</div>
                  <div>Uploaded</div>
                  <div>Action</div>
                </div>

                {documents.map((doc, i) => (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 120px 180px 100px',
                      padding: '16px 24px',
                      borderBottom: '1px solid var(--border)',
                      alignItems: 'center',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>📄</span>
                      <span style={{
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {doc.originalName}
                      </span>
                    </div>
                    <div>
                      <span style={{
                        fontSize: '12px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: '#6c63ff20',
                        color: '#6c63ff',
                        border: '1px solid #6c63ff40',
                      }}>
                        {doc.totalChunks} chunks
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteDocument(doc._id, doc.originalName)}
                        style={{
                          background: '#ff658420',
                          border: '1px solid #ff658440',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          color: '#ff6584',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        🗑️ Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}