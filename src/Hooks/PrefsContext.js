import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const PrefsContext = createContext(null)
const STORAGE_KEY = 'yt_clone_prefs'

const DEFAULTS = {
  appearance: 'Dark theme',
  language: 'English',
  restricted: 'Off',
  location: 'Pakistan',
}

export const PrefsProvider = ({ children }) => {
  const [prefs, setPrefsState] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
    } catch {
      return { ...DEFAULTS }
    }
  })
  const [toast, setToast] = useState('')

  const setPrefs = (patch) => {
    setPrefsState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const setPref = (key, value) => {
    setPrefs({ [key]: value })
    setToast(`${key[0].toUpperCase()}${key.slice(1)} set to ${value}`)
    window.clearTimeout(setPref._t)
    setPref._t = window.setTimeout(() => setToast(''), 2200)
  }

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    if (prefs.appearance === 'Light theme') {
      body.classList.add('yt-light')
      body.classList.remove('yt-dark')
    } else {
      body.classList.add('yt-dark')
      body.classList.remove('yt-light')
    }

    if (prefs.language === 'Urdu' || prefs.language === 'Arabic') {
      root.lang = prefs.language === 'Urdu' ? 'ur' : 'ar'
      root.dir = 'rtl'
    } else {
      root.lang = 'en'
      root.dir = 'ltr'
    }

    root.dataset.restricted = prefs.restricted === 'On' ? '1' : '0'
    root.dataset.location = prefs.location
  }, [prefs])

  const value = useMemo(
    () => ({ prefs, setPrefs, setPref, toast, clearToast: () => setToast('') }),
    [prefs, toast]
  )

  return (
    <PrefsContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#282828] text-white text-sm px-4 py-2 rounded-lg shadow-xl border border-[#3f3f3f]">
          {toast}
        </div>
      ) : null}
    </PrefsContext.Provider>
  )
}

export const usePrefs = () => {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider')
  return ctx
}
