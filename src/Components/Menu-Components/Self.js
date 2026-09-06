import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Hooks/AuthContext'
import { useWatchHistory } from '../../Hooks/HistoryContext'
import { useLikes } from '../../Hooks/LikesContext'
import { useWatchLater } from '../../Hooks/WatchLaterContext'
import { usePlaylists } from '../../Hooks/PlaylistsContext'
import { useStudio } from '../../Hooks/StudioContext'
import { ThemeContext } from '../../Hooks/ThemeContext'

const Self = () => {
  const { user, isSignedIn, openSignIn, signOut } = useAuth()
  const { history } = useWatchHistory()
  const { likedVideos } = useLikes()
  const { watchLater } = useWatchLater()
  const { playlists } = usePlaylists()
  const { getMyChannel, myVideos } = useStudio()
  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)
  const myChannel = getMyChannel()

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  const links = [
    {
      to: '/history',
      icon: 'fa-solid fa-clock-rotate-left',
      label: 'History',
      meta: `${history.length} videos`,
    },
    {
      to: '/playlists',
      icon: 'fa-solid fa-list',
      label: 'Playlists',
      meta: isSignedIn ? `${playlists.length} playlists` : 'Sign in to manage',
    },
    {
      to: '/watch-later',
      icon: 'fa-regular fa-clock',
      label: 'Watch later',
      meta: isSignedIn ? `${watchLater.length} videos` : 'Sign in to save',
    },
    {
      to: '/liked',
      icon: 'fa-regular fa-thumbs-up',
      label: 'Liked videos',
      meta: isSignedIn ? `${likedVideos.length} videos` : 'Sign in to like',
    },
    {
      to: '/Subscriptions',
      icon: 'fa-solid fa-bell',
      label: 'Subscriptions',
      meta: '',
    },
    {
      to: '/downloads',
      icon: 'fa-solid fa-download',
      label: 'Downloads',
      meta: '',
    },
  ]

  return (
    <div className={`min-h-screen pt-[100px] pb-24 px-4 ${leftPad} text-white max-w-3xl`}>
      <h1 className="text-2xl font-semibold mb-6">You</h1>

      {isSignedIn ? (
        <div className="flex items-center gap-4 mb-8">
          <img src={user.avatar} alt="" className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-xl font-medium">{user.name}</p>
            {user.email ? <p className="text-[#AAAAAA] text-sm">{user.email}</p> : null}
            <div className="flex flex-wrap gap-3 mt-2">
              {myChannel ? (
                <Link to={`/channel/${myChannel.id}`} className="text-sm text-[#3ea6ff] hover:underline">
                  View your channel
                </Link>
              ) : (
                <Link to="/studio/channel" className="text-sm text-[#3ea6ff] hover:underline">
                  Create a channel
                </Link>
              )}
              <Link to="/studio/upload" className="text-sm text-[#3ea6ff] hover:underline">
                Upload video
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="text-sm text-[#3ea6ff] hover:underline"
              >
                Sign out
              </button>
            </div>
            {myChannel ? (
              <p className="text-xs text-[#aaa] mt-2">
                {myChannel.title} · {myVideos.length} video{myVideos.length === 1 ? '' : 's'}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-[#212121] flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="font-medium">Sign in to get the most out of YouTubeClone</p>
            <p className="text-sm text-[#AAAAAA] mt-1">
              Save history, likes, playlists, and Watch later.
            </p>
          </div>
          <button
            type="button"
            onClick={openSignIn}
            className="flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-1.5 text-sm font-medium hover:bg-[#3ea6ff]/10"
          >
            <i className="fa-regular fa-circle-user"></i>
            Sign in
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {links.map((item) => (
          <Link
            key={item.to + item.label}
            to={item.to}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#272727]"
          >
            <i className={`${item.icon} w-6 text-center`}></i>
            <div>
              <p>{item.label}</p>
              {item.meta ? <p className="text-xs text-[#AAAAAA]">{item.meta}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Self
