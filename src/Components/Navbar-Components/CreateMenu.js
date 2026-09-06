import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../Hooks/AuthContext'
import { useStudio } from '../../Hooks/StudioContext'

const CreateMenu = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { isSignedIn, openSignIn } = useAuth()
  const { getMyChannel } = useStudio()

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const go = (path) => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    navigate(path)
  }

  const items = [
    {
      icon: 'fa-solid fa-upload',
      label: 'Upload video',
      action: () => go(getMyChannel() ? '/studio/upload' : '/studio/channel'),
    },
    {
      icon: 'fa-solid fa-plus',
      label: getMyChannel() ? 'Customize channel' : 'Create channel',
      action: () => go('/studio/channel'),
    },
    {
      icon: 'fa-solid fa-tower-broadcast',
      label: 'Go live',
      action: () => {
        if (!isSignedIn) {
          openSignIn()
          return
        }
        alert('Go live studio opens here (demo).')
      },
    },
    {
      icon: 'fa-regular fa-pen-to-square',
      label: 'Create post',
      action: () => go('/you'),
    },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white text-sm font-medium rounded-full w-10 h-10 sm:w-auto sm:px-3.5 sm:py-1.5"
        aria-label="Create"
      >
        <i className="fa-solid fa-plus"></i>
        <span className="hidden sm:inline">Create</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-11 z-50 w-56 bg-[#282828] rounded-xl overflow-hidden shadow-2xl py-2 text-white text-sm">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-left"
              onClick={() => {
                setOpen(false)
                item.action()
              }}
            >
              <i className={`${item.icon} w-5 text-center`}></i>
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default CreateMenu
