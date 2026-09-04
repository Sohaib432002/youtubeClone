import { Link } from 'react-router-dom'
import { useAuth } from '../../Hooks/AuthContext'
import { usePlaylists } from '../../Hooks/PlaylistsContext'
import { timeAgo } from '../../utils/format'

/** Channel tab: show the signed-in user's playlists (YouTube-style library entry point). */
const Playlist = () => {
  const { isSignedIn, openSignIn } = useAuth()
  const { playlists } = usePlaylists()

  if (!isSignedIn) {
    return (
      <div className="text-center py-12 text-white">
        <i className="fa-solid fa-list text-3xl text-[#555] mb-3"></i>
        <p className="mb-2">Sign in to create playlists</p>
        <button
          type="button"
          onClick={openSignIn}
          className="inline-flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-2 text-sm"
        >
          Sign in
        </button>
      </div>
    )
  }

  if (!playlists.length) {
    return (
      <div className="text-center py-12 text-white">
        <i className="fa-solid fa-list text-3xl text-[#555] mb-3"></i>
        <p className="mb-1">No playlists yet</p>
        <p className="text-sm text-[#aaa] mb-4">
          Save videos from any player, or create one on the Playlists page.
        </p>
        <Link to="/playlists" className="text-[#3ea6ff] text-sm hover:underline">
          Go to Playlists
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      {playlists.map((pl) => {
        const cover =
          pl.videos?.[0]?.thumbnail ||
          (pl.videos?.[0]?.videoId
            ? `https://i.ytimg.com/vi/${pl.videos[0].videoId}/mqdefault.jpg`
            : null)
        return (
          <Link
            key={pl.id}
            to={`/playlist/${pl.id}`}
            className="rounded-xl overflow-hidden bg-[#181818] border border-[#272727] hover:border-[#3f3f3f]"
          >
            <div className="aspect-video bg-[#272727] relative">
              {cover ? (
                <img src={cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555]">
                  <i className="fa-solid fa-list text-3xl"></i>
                </div>
              )}
              <div className="absolute inset-y-0 right-0 w-2/5 bg-black/70 flex flex-col items-center justify-center text-white">
                <span className="text-lg font-semibold">{(pl.videos || []).length}</span>
                <i className="fa-solid fa-list mt-1"></i>
              </div>
            </div>
            <div className="p-3 text-white">
              <p className="font-medium truncate">{pl.name}</p>
              <p className="text-xs text-[#aaa] mt-1">
                Updated {timeAgo(pl.updatedAt || pl.createdAt)}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Playlist
