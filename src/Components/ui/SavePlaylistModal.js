import { useEffect, useState } from 'react'
import { useAuth } from '../../Hooks/AuthContext'
import { usePlaylists } from '../../Hooks/PlaylistsContext'
import { useWatchLater } from '../../Hooks/WatchLaterContext'

/**
 * Modal to save a video to Watch Later and/or user playlists.
 * `video` shape matches library entries (videoId, title, thumbnail, …).
 */
const SavePlaylistModal = ({ open, onClose, video }) => {
  const { isSignedIn, openSignIn } = useAuth()
  const { playlists, createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist, isVideoInPlaylist } =
    usePlaylists()
  const { isInWatchLater, addToWatchLater, removeFromWatchLater } = useWatchLater()
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setNewName('')
      setCreating(false)
      setMessage('')
      setError('')
    }
  }, [open])

  if (!open || !video?.videoId) return null

  const requireAuth = () => {
    if (!isSignedIn) {
      openSignIn()
      return false
    }
    return true
  }

  const flash = (text, isError = false) => {
    if (isError) {
      setError(text)
      setMessage('')
    } else {
      setMessage(text)
      setError('')
    }
  }

  const onWatchLater = () => {
    if (!requireAuth()) return
    if (isInWatchLater(video.videoId)) {
      removeFromWatchLater(video.videoId)
      flash('Removed from Watch later')
    } else {
      const r = addToWatchLater(video)
      if (r.ok) flash(r.already ? 'Already in Watch later' : 'Saved to Watch later')
      else flash('Could not save. Try again.', true)
    }
  }

  const onTogglePlaylist = (playlistId) => {
    if (!requireAuth()) return
    if (isVideoInPlaylist(playlistId, video.videoId)) {
      removeVideoFromPlaylist(playlistId, video.videoId)
      flash('Removed from playlist')
    } else {
      const r = addVideoToPlaylist(playlistId, video)
      if (r.ok) flash(r.already ? 'Already in playlist' : 'Added to playlist')
      else flash('Could not update playlist.', true)
    }
  }

  const onCreate = (e) => {
    e.preventDefault()
    if (!requireAuth()) return
    const r = createPlaylist(newName, video)
    if (!r.ok) {
      flash(r.reason === 'empty' ? 'Enter a playlist name' : 'Could not create playlist.', true)
      return
    }
    setNewName('')
    setCreating(false)
    flash(`Created “${r.playlist.name}” and added video`)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Save to playlist"
    >
      <div
        className="w-full sm:max-w-md bg-[#212121] text-white rounded-t-2xl sm:rounded-2xl border border-[#3f3f3f] shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3f3f3f]">
          <h2 className="text-base font-medium">Save to…</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#3f3f3f]"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="overflow-y-auto px-2 py-2 flex-1">
          <button
            type="button"
            onClick={onWatchLater}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#3f3f3f] text-left"
          >
            <i
              className={`fa-${isInWatchLater(video.videoId) ? 'solid' : 'regular'} fa-clock w-5 text-center`}
            ></i>
            <span className="flex-1 text-sm">Watch later</span>
            {isInWatchLater(video.videoId) ? (
              <i className="fa-solid fa-check text-[#3ea6ff]"></i>
            ) : null}
          </button>

          {playlists.map((pl) => {
            const checked = isVideoInPlaylist(pl.id, video.videoId)
            return (
              <button
                key={pl.id}
                type="button"
                onClick={() => onTogglePlaylist(pl.id)}
                className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#3f3f3f] text-left"
              >
                <i className={`fa-${checked ? 'solid' : 'regular'} fa-list w-5 text-center`}></i>
                <span className="flex-1 text-sm truncate">
                  {pl.name}
                  <span className="block text-xs text-[#aaa]">
                    {(pl.videos || []).length} video{(pl.videos || []).length === 1 ? '' : 's'}
                  </span>
                </span>
                {checked ? <i className="fa-solid fa-check text-[#3ea6ff]"></i> : null}
              </button>
            )
          })}

          {!playlists.length && !creating ? (
            <p className="px-3 py-2 text-sm text-[#aaa]">No playlists yet. Create one below.</p>
          ) : null}
        </div>

        <div className="border-t border-[#3f3f3f] px-3 py-3">
          {creating ? (
            <form onSubmit={onCreate} className="flex gap-2">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Playlist name"
                className="flex-1 min-w-0 bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3ea6ff]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-[#e5e5e5]"
              >
                Create
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!requireAuth()) return
                setCreating(true)
              }}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#3f3f3f] text-sm text-left"
            >
              <i className="fa-solid fa-plus w-5 text-center"></i>
              New playlist
            </button>
          )}
          {message ? <p className="mt-2 text-xs text-[#3ea6ff] px-1">{message}</p> : null}
          {error ? <p className="mt-2 text-xs text-red-400 px-1">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default SavePlaylistModal
