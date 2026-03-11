import { motion } from 'framer-motion'

export default function Sidebar({ documents, onUploadClick, onAdminClick, user, onLogout }) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={{
        width: '280px',
        minWidth: '280px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '24px',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '8px 12px' }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '22px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ⚡ OpsMind AI
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Corporate Knowledge Brain
        </div>
      </div>

      {/* Upload Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onUploadClick}
        style={{
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          border: 'none',
          borderRadius: '12px',
          padding: '14px',
          color: 'white',
          fontFamily: 'Syne, sans-serif',
          fontWeight: '700',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        📄 Upload PDF Document
      </motion.button>

      {/* Admin Dashboard Button - only for admins */}
      {user?.role === 'admin' && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAdminClick}
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px',
            color: 'var(--text)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          📊 Admin Dashboard
        </motion.button>
      )}

      {/* Documents List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '12px',
          padding: '0 4px',
        }}>
          Knowledge Base
        </div>

        {documents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--text-muted)',
            fontSize: '13px',
            background: 'var(--surface2)',
            borderRadius: '12px',
            border: '1px dashed var(--border)',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
            No documents yet. Upload your first SOP!
          </div>
        ) : (
          documents.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                marginBottom: '8px',
                fontSize: '13px',
                color: 'var(--text)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📄</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {doc.originalName}
                </span>
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--success)' }}>
                ✓ {doc.totalChunks} chunks indexed
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* User Info & Logout */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '14px',
          flexShrink: 0,
          color: 'white',
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'var(--text)',
          }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {user?.role}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onLogout}
          title="Logout"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          →
        </motion.button>
      </div>
    </motion.div>
  )
}