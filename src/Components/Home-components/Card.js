import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/format'

const Card = ({ item, channelLogo }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const videoId =
    item?.id?.videoId ||
    (typeof item?.id === 'string' ? item.id : null) ||
    item?.meta?.videoId
  const meta = item?.meta
  if (!videoId || !item?.snippet) return null

  const thumb =
    (videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null) ||
    item.snippet.thumbnails?.medium?.url ||
    item.snippet.thumbnails?.high?.url ||
    item.snippet.thumbnails?.default?.url

  const channelId = item.snippet.channelId
  const logo = channelLogo || meta?.channelAvatar || '/favicon.ico'
  const views = meta?.views ?? item.statistics?.viewCount
  const duration = meta?.duration || item.contentDetails?.duration || ''
  const published = item.snippet.publishTime || item.snippet.publishedAt

  return (
    <div className="group relative flex flex-col w-full min-w-0 text-[#f1f1f1]">
      <Link
        to={`/Video/${videoId}`}
        className="relative block w-full aspect-video overflow-hidden rounded-xl bg-[#272727]"
      >
        <img
          src={thumb}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {duration ? (
          <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[12px] font-medium px-1.5 py-0.5 rounded">
            {duration}
          </span>
        ) : null}
      </Link>

      <div className="flex gap-3 pt-3 pr-1">
        <Link
          to={channelId ? `/channel/${channelId}` : '#'}
          className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-[#272727]"
        >
          <img src={logo} alt="" className="w-full h-full object-cover" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex gap-2">
            <Link to={`/Video/${videoId}`} className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-[15px] font-medium leading-snug line-clamp-2">
                {item.snippet.title}
              </h3>
            </Link>
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 h-8 w-8 flex-shrink-0 rounded-full hover:bg-[#272727]"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen((v) => !v)
              }}
            >
              <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
            </button>
          </div>
          <Link
            to={channelId ? `/channel/${channelId}` : '#'}
            className="mt-1 text-[13px] text-[#aaaaaa] hover:text-[#f1f1f1] truncate flex items-center gap-1"
          >
            {item.snippet.channelTitle}
            {meta?.verified ? (
              <i className="fa-solid fa-circle-check text-[10px] text-[#aaaaaa]"></i>
            ) : null}
          </Link>
          <p className="text-[13px] text-[#aaaaaa]">
            {views != null ? `${formatViews(views)} views` : ''}
            {published ? ` • ${timeAgo(published)}` : ''}
          </p>
        </div>
      </div>

      {menuOpen ? (
        <div className="absolute top-12 right-0 z-20 w-48 rounded-xl bg-[#282828] shadow-xl overflow-hidden text-sm">
          {['Add to queue', 'Save to Watch later', 'Share', 'Not interested'].map((label) => (
            <button
              key={label}
              type="button"
              className="w-full text-left px-4 py-2.5 hover:bg-[#3e3e3e]"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Card
