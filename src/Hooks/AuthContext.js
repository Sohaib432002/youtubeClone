import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'yt_clone_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [showSignIn, setShowSignIn] = useState(false)

  const signIn = ({ name, email }) => {
    const next = {
      name: name.trim() || 'YouTube User',
      email: (email || '').trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name.trim() || 'U'
      )}&background=ff0000&color=fff`,
      signedInAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setUser(next)
    setShowSignIn(false)
  }

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isSignedIn: Boolean(user),
      signIn,
      signOut,
      showSignIn,
      openSignIn: () => setShowSignIn(true),
      closeSignIn: () => setShowSignIn(false),
    }),
    [user, showSignIn]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
