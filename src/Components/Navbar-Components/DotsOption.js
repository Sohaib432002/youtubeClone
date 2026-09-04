import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { usePrefs } from '../../Hooks/PrefsContext'

const SUBMENUS = {
  Appearance: ['Dark theme', 'Light theme', 'Device theme'],
  Language: ['English', 'Urdu', 'Hindi', 'Arabic'],
  Restricted: ['Off', 'On'],
  Location: ['Pakistan', 'United States', 'United Kingdom', 'India', 'Canada'],
}

const DotsOption = () => {
  const [open, setOpen] = useState(false)
  const [submenu, setSubmenu] = useState(null)
  const rootRef = useRef(null)
  const navigate = useNavigate()
  const { prefs, setPref } = usePrefs()

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false)
        setSubmenu(null)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const mainItems = [
    { key: 'data', label: 'Your data on YouTubeClone', icon: 'fa-solid fa-user-shield' },
    {
      key: 'appearance',
      label: 'Appearance',
      icon: 'fa-solid fa-moon',
      submenu: 'Appearance',
      valueKey: 'appearance',
    },
    {
      key: 'language',
      label: 'Language',
      icon: 'fa-solid fa-language',
      submenu: 'Language',
      valueKey: 'language',
    },
    {
      key: 'restricted',
      label: 'Restricted Mode',
      icon: 'fa-solid fa-shield',
      submenu: 'Restricted',
      valueKey: 'restricted',
    },
    {
      key: 'location',
      label: 'Location',
      icon: 'fa-solid fa-globe',
      submenu: 'Location',
      valueKey: 'location',
    },
    { key: 'shortcuts', label: 'Keyboard shortcuts', icon: 'fa-solid fa-keyboard' },
  ]

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#272727] text-white"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
          setSubmenu(null)
        }}
        aria-label="More options"
      >
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>

      {open && !submenu ? (
        <div
          className="absolute right-0 top-12 z-50 w-[320px] bg-[#282828] rounded-xl overflow-hidden shadow-2xl py-2 text-white text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {mainItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-[#3f3f3f] text-left"
              onClick={() => {
                if (item.submenu) {
                  setSubmenu({ name: item.submenu, valueKey: item.valueKey, label: item.label })
                  return
                }
                if (item.key === 'shortcuts') {
                  alert('Shortcuts:\n/ Search\nj/k Next/prev\nm Mute\nf Fullscreen')
                  setOpen(false)
                  return
                }
                if (item.key === 'data') {
                  alert('Your watch history and preferences are stored locally on this device.')
                  setOpen(false)
                  return
                }
                setOpen(false)
              }}
            >
              <i className={`${item.icon} w-5 text-center text-base`}></i>
              <span className="flex-1">
                {item.label}
                {item.valueKey ? `: ${prefs[item.valueKey]}` : ''}
              </span>
              {item.submenu ? (
                <i className="fa-solid fa-chevron-right text-[10px] text-[#aaa]"></i>
              ) : null}
            </button>
          ))}
          <hr className="border-[#3f3f3f] my-2" />
          <button
            type="button"
            className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-[#3f3f3f] text-left"
            onClick={() => {
              setOpen(false)
              navigate('/settings')
            }}
          >
            <i className="fa-solid fa-gear w-5 text-center"></i>
            Settings
          </button>
          <hr className="border-[#3f3f3f] my-2" />
          <button
            type="button"
            className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-[#3f3f3f] text-left"
            onClick={() => {
              alert('Help center: Sign in, search, Shorts, downloads, and settings.')
              setOpen(false)
            }}
          >
            <i className="fa-regular fa-circle-question w-5 text-center"></i>
            Help
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-[#3f3f3f] text-left"
            onClick={() => {
              const msg = window.prompt('Send feedback:')
              if (msg?.trim()) alert('Thanks! Feedback received.')
              setOpen(false)
            }}
          >
            <i className="fa-regular fa-message w-5 text-center"></i>
            Send feedback
          </button>
        </div>
      ) : null}

      {open && submenu ? (
        <div
          className="absolute right-0 top-12 z-50 w-[320px] bg-[#282828] rounded-xl overflow-hidden shadow-2xl py-2 text-white text-sm max-h-[70vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3f3f3f] font-medium border-b border-[#3f3f3f]"
            onClick={() => setSubmenu(null)}
          >
            <i className="fa-solid fa-arrow-left"></i>
            {submenu.label || submenu.name}
          </button>
          <p className="px-4 py-2 text-xs text-[#aaa]">
            Setting applies to this browser only
          </p>
          {(SUBMENUS[submenu.name] || []).map((opt) => {
            const active = prefs[submenu.valueKey] === opt
            return (
              <button
                key={opt}
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-left"
                onClick={() => {
                  setPref(submenu.valueKey, opt)
                  setSubmenu(null)
                  setOpen(false)
                }}
              >
                <span className="w-5 text-center text-[#3ea6ff]">
                  {active ? <i className="fa-solid fa-check"></i> : null}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default DotsOption
