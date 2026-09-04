import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useAuth } from '../../Hooks/AuthContext'
import { usePlaylists } from '../../Hooks/PlaylistsContext'
import { timeAgo } from '../../utils/format'

const PlaylistsPage = () => {
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
  const { isSignedIn, openSignIn } = useAuth()
  const { playlists, createPlaylist, deletePlaylist } = usePlaylists()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  const onCreate = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!isSignedIn) {
      openSignIn()
      return
    }
    const r = createPlaylist(name)
    if (!r.ok) {
      setError(r.reason === 'empty' ? 'Enter a playlist name' : 'Could not create playlist')
      return
    }
    setName('')
    setSuccess(`Created “${r.playlist.name}”`)
  }

  return (
    <div className={`min-h-screen pt-[100px] pb-24 px-4 ${leftPad} text-white max-w-5xl`}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Playlists</h1>
        <p className="text-sm text-[#aaa] mt-1">
          {isSignedIn
            ? `${playlists.length} playlist${playlists.length === 1 ? '' : 's'}`
            : 'Sign in to create and manage playlists'}
        </p>
      </div>

      {!isSignedIn ? (
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <i className="fa-solid fa-list text-4xl mb-3 text-[#555]"></i>
          <p className="text-white text-lg mb-1">Sign in to use playlists</p>
          <p className="text-sm text-[#aaa] mb-4">
            Create playlists and save videos from any video page.
          </p>
          <button
            type="button"
            onClick={openSignIn}
            className="inline-flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#3ea6ff]/10"
          >
            <i className="fa-regular fa-circle-user"></i>
            Sign in
          </button>
        </div>
      ) : (
        <>
          <form
            onSubmit={onCreate}
            className="flex flex-col sm:flex-row gap-2 mb-6 p-3 rounded-xl bg-[#181818] border border-[#272727]"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Create a new playlist"
              className="flex-1 min-w-0 bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#3ea6ff]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-[#e5e5e5]"
            >
              Create
            </button>
          </form>
          {error ? <p className="text-sm text-red-400 mb-3">{error}</p> : null}
          {success ? <p className="text-sm text-[#3ea6ff] mb-3">{success}</p> : null}

          {!playlists.length ? (
            <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
              <i className="fa-solid fa-list text-4xl mb-3 text-[#555]"></i>
              <p className="text-white text-lg mb-1">No playlists yet</p>
              <p className="text-sm text-[#aaa]">Create one above or save a video to a new playlist.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((pl) => {
                const cover =
                  pl.videos?.[0]?.thumbnail ||
                  (pl.videos?.[0]?.videoId
                    ? `https://i.ytimg.com/vi/${pl.videos[0].videoId}/mqdefault.jpg`
                    : null)
                return (
                  <div
                    key={pl.id}
                    className="group relative rounded-xl overflow-hidden bg-[#181818] border border-[#272727] hover:border-[#3f3f3f]"
                  >
                    <Link to={`/playlist/${pl.id}`}>
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
                      <div className="p-3">
                        <p className="font-medium truncate">{pl.name}</p>
                        <p className="text-xs text-[#aaa] mt-1">
                          Updated {timeAgo(pl.updatedAt || pl.createdAt)}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      title="Delete playlist"
                      onClick={() => {
                        if (window.confirm(`Delete playlist “${pl.name}”?`)) {
                          deletePlaylist(pl.id)
                        }
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/80"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PlaylistsPage
