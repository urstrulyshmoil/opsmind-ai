import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import UploadModal from './components/UploadModal'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'

function MainApp() {
  const { user, logout } = useAuth()
  const [showUpload, setShowUpload] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hello ${user?.name || ''}! I am OpsMind AI — your corporate knowledge assistant. Upload your SOP documents and ask me anything!`,
    }
  ])

  // Show login/register if not logged in
  if (!user) {
    return showRegister
      ? <RegisterPage onSwitch={() => setShowRegister(false)} />
      : <LoginPage onSwitch={() => setShowRegister(true)} />
  }

  // Show admin dashboard
  if (showAdmin && user?.role === 'admin') {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />
  }

  // Show main chat
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        documents={documents}
        onUploadClick={() => setShowUpload(true)}
        onAdminClick={() => setShowAdmin(true)}
        user={user}
        onLogout={logout}
      />
      <ChatWindow
        messages={messages}
        setMessages={setMessages}
      />
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          setDocuments={setDocuments}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <MainApp />
    </AuthProvider>
  )
}

export default App