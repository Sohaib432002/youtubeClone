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

const UploadVideo = () => {
  const { isDesktopSidebar, contentOffsetPx, setisShowScrollbar, setWatchMode } =
    useContext(ThemeContext)
  const { isSignedIn, openSignIn } = useAuth()
  const { getMyChannel, uploadVideo } = useStudio()
  const navigate = useNavigate()
  const channel = getMyChannel()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [thumbnail, setThumbnail] = useState('')
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setisShowScrollbar(false)
    setWatchMode(false)
  }, [setisShowScrollbar, setWatchMode])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const leftPad = isDesktopSidebar
    ? contentOffsetPx >= 240
      ? 'lg:ml-[240px]'
      : 'lg:ml-[72px]'
    : 'md:ml-[72px]'

  const onVideo = (e) => {
    const next = e.target.files?.[0]
    if (!next) return
    if (!next.type.startsWith('video/')) {
      setError('Choose a video file.')
      return
    }
    setError('')
    setFile(next)
    if (!title) setTitle(next.name.replace(/\.[^.]+$/, ''))
    const url = URL.createObjectURL(next)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  const onThumb = async (e) => {
    const next = e.target.files?.[0]
    if (!next) return
    if (!next.type.startsWith('image/')) {
      setError('Choose an image for the thumbnail.')
      return
    }
    setThumbnail(await readFileAsDataUrl(next))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!isSignedIn) {
      openSignIn()
      return
    }
    if (!channel) {
      navigate('/studio/channel')
      return
    }
    if (!file) {
      setError('Select a video to upload.')
      return
    }
    setSaving(true)
    setError('')
    const result = uploadVideo({ title, description, thumbnail, file })
    setSaving(false)
    if (!result.ok) {
      setError('Could not upload. Check the title and try again.')
      return
    }
    navigate(`/Video/${result.video.videoId}`)
  }

  return (
    <div className={`min-h-screen bg-[#0f0f0f] text-white pt-[100px] pb-24 px-4 ${leftPad}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Upload video</h1>
        <p className="text-sm text-[#aaa] mb-6">
          Add a title, thumbnail, and file. Your video appears on your channel and Home.
        </p>

        {!isSignedIn ? (
          <div className="rounded-xl bg-[#212121] p-5 flex items-center justify-between gap-4">
            <p className="text-sm">Sign in to upload.</p>
            <button
              type="button"
              onClick={openSignIn}
              className="px-4 py-2 rounded-full border border-[#3ea6ff] text-[#3ea6ff] text-sm"
            >
              Sign in
            </button>
          </div>
        ) : !channel ? (
          <div className="rounded-xl bg-[#212121] p-5">
            <p className="text-sm mb-3">Create a channel before you upload.</p>
            <Link
              to="/studio/channel"
              className="inline-flex px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
            >
              Create channel
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#3f3f3f] rounded-2xl px-4 py-10 cursor-pointer hover:bg-[#181818]">
              <i className="fa-solid fa-upload text-3xl text-[#aaa]"></i>
              <span className="text-sm">
                {file ? file.name : 'Select a video file to upload'}
              </span>
              <input type="file" accept="video/*" className="hidden" onChange={onVideo} />
            </label>

            {preview ? (
              <video src={preview} controls className="w-full rounded-xl bg-black max-h-72" />
            ) : null}

            <label className="flex flex-col gap-1 text-sm">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 outline-none focus:border-white"
                placeholder="Add a title that describes your video"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 outline-none focus:border-white resize-y"
                placeholder="Tell viewers about your video"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              Thumbnail
              <input type="file" accept="image/*" onChange={onThumb} />
              {thumbnail ? (
                <img src={thumbnail} alt="" className="w-48 aspect-video object-cover rounded-lg" />
              ) : null}
            </label>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={saving}
              className="self-start px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-[#d9d9d9] disabled:opacity-60"
            >
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default UploadVideo
