import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ChatWindow({ messages, setMessages }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        question: input,
      })

      const aiMessage = {
        role: 'assistant',
        content: res.data.answer,
        sources: res.data.sources,
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      toast.error('Something went wrong!')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Effect */}
      <div style={{
        position: 'absolute',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, #6c63ff15, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'var(--surface)',
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'var(--success)',
          boxShadow: '0 0 8px var(--success)',
        }} />
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: '700',
          fontSize: '16px',
        }}>
          AI Knowledge Assistant
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '12px',
          color: 'var(--text-muted)',
          background: 'var(--surface2)',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '1px solid var(--border)',
        }}>
          RAG Powered
        </span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0,
                }}>
                  ⚡
                </div>
              )}

              <div style={{ maxWidth: '70%' }}>
                <div style={{
                  padding: '16px 20px',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6c63ff, #8b85ff)'
                    : 'var(--surface)',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}>
                    {msg.sources.map((src, j) => (
                      <span key={j} style={{
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: 'var(--surface2)',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                      }}>
                        📄 {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0,
                }}>
                  👤
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}>⚡</div>
            <div style={{
              padding: '16px 20px',
              borderRadius: '20px 20px 20px 4px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '20px 32px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '12px 16px',
          transition: 'border-color 0.2s',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your documents..."
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              resize: 'none',
              lineHeight: '1.5',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, #6c63ff, #ff6584)'
                : 'var(--border)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              color: 'white',
              fontFamily: 'Syne, sans-serif',
              fontWeight: '700',
              fontSize: '13px',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            Send ➤
          </motion.button>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          Press Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}