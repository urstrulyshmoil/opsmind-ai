import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage({ onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all fields!')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form)
      login(res.data.user, res.data.token)
      toast.success(`Welcome, ${res.data.user.name}! 🎉`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, #ff658420, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '420px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '40px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ⚡ OpsMind AI
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
            Create your account
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              FULL NAME
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              EMAIL
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                color: 'var(--text)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontFamily: 'Syne, sans-serif',
              fontWeight: '700',
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
            }}
          >
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </motion.button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span
            onClick={onSwitch}
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}
          >
            Sign in
          </span>
        </div>
      </motion.div>
    </div>
  )
}