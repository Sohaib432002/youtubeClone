import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useAuth } from '../../Hooks/AuthContext'
import { useStudio } from '../../Hooks/StudioContext'

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

const CreateChannel = () => {
  const { isDesktopSidebar, contentOffsetPx, setisShowScrollbar, setWatchMode } =
    useContext(ThemeContext)
  const { isSignedIn, openSignIn, user } = useAuth()
  const { getMyChannel, createChannel } = useStudio()
  const navigate = useNavigate()
  const existing = getMyChannel()

  const [title, setTitle] = useState(existing?.title || user?.name || '')
  const [handle, setHandle] = useState(existing?.handle || user?.handle || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [avatar, setAvatar] = useState(existing?.avatar || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setisShowScrollbar(false)
    setWatchMode(false)
  }, [setisShowScrollbar, setWatchMode])

  useEffect(() => {
    if (existing) {
      setTitle(existing.title || '')
      setHandle(existing.handle || '')
      setDescription(existing.description || '')
      setAvatar(existing.avatar || '')
    }
  }, [existing])

  const leftPad = isDesktopSidebar
    ? contentOffsetPx >= 240
      ? 'lg:ml-[240px]'
      : 'lg:ml-[72px]'
    : 'md:ml-[72px]'

  const onAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image for the channel photo.')
      return
    }
    const data = await readFileAsDataUrl(file)
    setAvatar(data)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!isSignedIn) {
      openSignIn()
      return
    }
    setSaving(true)
    setError('')
    const result = createChannel({ title, handle, description, avatar })
    setSaving(false)
    if (!result.ok) {
      setError(result.reason === 'empty' ? 'Enter a channel name.' : 'Could not save channel.')
      return
    }
    navigate(`/channel/${result.channel.id}`)
  }

  return (
    <div className={`min-h-screen bg-[#0f0f0f] text-white pt-[100px] pb-24 px-4 ${leftPad}`}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">
          {existing ? 'Customize channel' : 'Create a channel'}
        </h1>
        <p className="text-sm text-[#aaa] mb-6">
          Your channel name and photo appear on your videos and comments.
        </p>

        {!isSignedIn ? (
          <div className="rounded-xl bg-[#212121] p-5 flex items-center justify-between gap-4">
            <p className="text-sm">Sign in to create a channel.</p>
            <button
              type="button"
              onClick={openSignIn}
              className="px-4 py-2 rounded-full border border-[#3ea6ff] text-[#3ea6ff] text-sm"
            >
              Sign in
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <label className="flex items-center gap-4 cursor-pointer w-fit">
              <img
                src={avatar || user?.avatar || '/favicon.ico'}
                alt=""
                className="w-20 h-20 rounded-full object-cover bg-[#272727]"
              />
              <span className="text-sm text-[#3ea6ff]">Upload picture</span>
              <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Name
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 outline-none focus:border-white"
                placeholder="Channel name"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Handle
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 outline-none focus:border-white"
                placeholder="@yourhandle"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 outline-none focus:border-white resize-y"
                placeholder="Tell viewers about your channel"
              />
            </label>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-[#d9d9d9] disabled:opacity-60"
              >
                {existing ? 'Save' : 'Create channel'}
              </button>
              {existing ? (
                <Link to={`/channel/${existing.id}`} className="text-sm text-[#3ea6ff] hover:underline">
                  View channel
                </Link>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreateChannel
