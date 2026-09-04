import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

const CreateMenu = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const items = [
    {
      icon: 'fa-solid fa-upload',
      label: 'Upload video',
      action: () => {
        alert('Upload flow: choose a video file to upload (demo).')
      },
    },
    {
      icon: 'fa-solid fa-tower-broadcast',
      label: 'Go live',
      action: () => alert('Go live studio opens here (demo).'),
    },
    {
      icon: 'fa-regular fa-pen-to-square',
      label: 'Create post',
      action: () => navigate('/you'),
    },
  ]

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white text-sm font-medium rounded-full px-3.5 py-1.5"
      >
        <i className="fa-solid fa-plus"></i>
        Create
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
