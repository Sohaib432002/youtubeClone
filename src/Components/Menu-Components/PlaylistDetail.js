import { useContext, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useAuth } from '../../Hooks/AuthContext'
import { usePlaylists } from '../../Hooks/PlaylistsContext'
import LibraryVideoList from '../ui/LibraryVideoList'
import { timeAgo } from '../../utils/format'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
  const { isSignedIn, openSignIn } = useAuth()
  const { getPlaylist, removeVideoFromPlaylist, deletePlaylist } = usePlaylists()
  const playlist = getPlaylist(playlistId)

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  if (!isSignedIn) {
    return (
      <div className={`min-h-screen pt-[100px] pb-24 px-4 ${leftPad} text-white max-w-5xl`}>
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <p className="text-lg mb-4">Sign in to view this playlist</p>
          <button
            type="button"
            onClick={openSignIn}
            className="inline-flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-2 text-sm font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className={`min-h-screen pt-[100px] pb-24 px-4 ${leftPad} text-white max-w-5xl`}>
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <p className="text-lg mb-2">Playlist not found</p>
          <Link to="/playlists" className="text-[#3ea6ff] text-sm hover:underline">
            Back to playlists
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pt-[100px] pb-24 px-4 ${leftPad} text-white max-w-5xl`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <Link to="/playlists" className="text-sm text-[#3ea6ff] hover:underline">
            ← Playlists
          </Link>
          <h1 className="text-2xl font-semibold mt-2">{playlist.name}</h1>
          <p className="text-sm text-[#aaa] mt-1">
            {(playlist.videos || []).length} video
            {(playlist.videos || []).length === 1 ? '' : 's'}
            {playlist.updatedAt ? ` • Updated ${timeAgo(playlist.updatedAt)}` : ''}
          </p>
        </div>
        <button
          type="button"
          className="text-sm text-red-400 hover:underline"
          onClick={() => {
            if (window.confirm(`Delete playlist “${playlist.name}”?`)) {
              deletePlaylist(playlist.id)
              navigate('/playlists')
            }
          }}
        >
          Delete playlist
        </button>
      </div>

      <LibraryVideoList
        items={playlist.videos || []}
        emptyIcon="fa-solid fa-list"
        emptyTitle="This playlist is empty"
        emptyHint="Save videos to this playlist from any video’s Save menu."
        onRemove={(videoId) => removeVideoFromPlaylist(playlist.id, videoId)}
        removeTitle="Remove from playlist"
        dateKey="addedAt"
        dateLabel="Added"
      />
    </div>
  )
}

export default PlaylistDetail
