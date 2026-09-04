import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useAuth } from '../../Hooks/AuthContext'
import { useLikes } from '../../Hooks/LikesContext'
import { formatViews, timeAgo } from '../../utils/format'

const LikedVideos = () => {
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
  const { isSignedIn, openSignIn } = useAuth()
  const { likedVideos, unlike } = useLikes()

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`min-h-screen pt-[100px] pb-24 px-4 ${leftPad} text-white max-w-5xl`}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Liked videos</h1>
          <p className="text-sm text-[#aaa] mt-1">
            {isSignedIn
              ? `${likedVideos.length} video${likedVideos.length === 1 ? '' : 's'}`
              : 'Sign in to see your liked videos'}
          </p>
        </div>
      </div>

      {!isSignedIn ? (
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <i className="fa-regular fa-thumbs-up text-4xl mb-3 text-[#555]"></i>
          <p className="text-white text-lg mb-1">Sign in to like videos</p>
          <p className="text-sm text-[#aaa] mb-4">
            Liked videos are saved to your account on this device.
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
      ) : !likedVideos.length ? (
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <i className="fa-regular fa-thumbs-up text-4xl mb-3 text-[#555]"></i>
          <p className="text-white text-lg mb-1">You haven&apos;t liked any videos yet.</p>
          <p className="text-sm text-[#aaa]">Videos you like will show up here.</p>
          <Link to="/" className="inline-block mt-4 text-[#3ea6ff] text-sm hover:underline">
            Browse videos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {likedVideos.map((item, index) => (
            <div
              key={item.videoId}
              className="group flex gap-3 sm:gap-4 hover:bg-[#1a1a1a] rounded-xl p-2 pr-3"
            >
              <span className="hidden sm:flex w-6 items-center justify-center text-[#aaa] text-sm">
                {index + 1}
              </span>
              <Link
                to={`/Video/${item.videoId}`}
                className="relative w-40 sm:w-56 aspect-video rounded-lg overflow-hidden bg-[#272727] flex-shrink-0"
              >
                <img
                  src={
                    item.thumbnail ||
                    `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
                {item.duration ? (
                  <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[11px] font-medium px-1 py-0.5 rounded">
                    {item.duration}
                  </span>
                ) : null}
              </Link>
              <div className="min-w-0 flex-1 py-0.5">
                <Link to={`/Video/${item.videoId}`}>
                  <p className="line-clamp-2 text-sm sm:text-[15px] font-medium leading-snug">
                    {item.title}
                  </p>
                </Link>
                <Link
                  to={item.channelId ? `/channel/${item.channelId}` : '#'}
                  className="mt-1.5 text-[13px] text-[#aaa] hover:text-white truncate block"
                >
                  {item.channelTitle || 'Channel'}
                </Link>
                <p className="text-[12px] text-[#aaa] mt-0.5">
                  {item.views != null ? `${formatViews(item.views)} views` : ''}
                  {item.publishedAt ? ` • ${timeAgo(item.publishedAt)}` : ''}
                  {item.likedAt ? ` • Liked ${timeAgo(item.likedAt)}` : ''}
                </p>
              </div>
              <button
                type="button"
                title="Remove from liked videos"
                onClick={() => unlike(item.videoId)}
                className="self-start mt-1 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 w-9 h-9 rounded-full hover:bg-[#272727] text-[#aaa] hover:text-white"
              >
                <i className="fa-solid fa-thumbs-up"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LikedVideos
