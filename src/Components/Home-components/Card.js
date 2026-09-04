import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/format'
import { useWatchLater } from '../../Hooks/WatchLaterContext'
import SavePlaylistModal from '../ui/SavePlaylistModal'

const Card = ({ item, channelLogo }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { addToWatchLater, isInWatchLater, removeFromWatchLater } = useWatchLater()

  const videoId =
    item?.id?.videoId ||
    (typeof item?.id === 'string' ? item.id : null) ||
    item?.meta?.videoId
  const meta = item?.meta
  if (!videoId || !item?.snippet) return null

  const thumb =
    item.snippet.thumbnails?.high?.url ||
    item.snippet.thumbnails?.medium?.url ||
    (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '') ||
    item.snippet.thumbnails?.default?.url

  const channelId = item.snippet.channelId
  const logo = channelLogo || meta?.channelAvatar || '/favicon.ico'
  const views = meta?.views ?? item.statistics?.viewCount
  const duration = meta?.duration || item.contentDetails?.duration || ''
  const published = item.snippet.publishTime || item.snippet.publishedAt

  const videoEntry = {
    videoId,
    title: item.snippet.title,
    thumbnail: thumb,
    channelTitle: item.snippet.channelTitle,
    channelId,
    channelLogo: logo,
    views,
    duration,
    publishedAt: published,
  }

  const flash = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const menuActions = [
    {
      label: isInWatchLater(videoId) ? 'Remove from Watch later' : 'Save to Watch later',
      run: () => {
        if (isInWatchLater(videoId)) {
          removeFromWatchLater(videoId)
          flash('Removed from Watch later')
        } else {
          const r = addToWatchLater(videoEntry)
          if (r.ok) flash(r.already ? 'Already in Watch later' : 'Saved to Watch later')
        }
      },
    },
    {
      label: 'Save to playlist',
      run: () => setSaveOpen(true),
    },
    {
      label: 'Share',
      run: () => {
        navigator.clipboard?.writeText(`${window.location.origin}/Video/${videoId}`)
        flash('Link copied')
      },
    },
  ]

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
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 h-8 w-8 flex-shrink-0 rounded-full hover:bg-[#272727]"
              aria-label="More options"
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
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-12 right-0 z-30 w-52 rounded-xl bg-[#282828] shadow-xl overflow-hidden text-sm border border-[#3f3f3f]">
            {menuActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-[#3e3e3e]"
                onClick={() => {
                  action.run()
                  setMenuOpen(false)
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {toast ? (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#f1f1f1] text-black text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      ) : null}

      <SavePlaylistModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        video={videoEntry}
      />
    </div>
  )
}

export default Card
