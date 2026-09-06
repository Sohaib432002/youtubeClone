import { useState } from 'react'
import { Link } from 'react-router-dom'
import { downloadVideoFile, formatViews, timeAgo, clockFromSeconds, parseIsoDuration } from '../../utils/format'
import { useWatchLater } from '../../Hooks/WatchLaterContext'
import { useFeedHide } from '../../Hooks/useFeedHide'
import SavePlaylistModal from '../ui/SavePlaylistModal'

const SAMPLE_MP4 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const Card = ({ item, channelLogo, onHidden }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { addToWatchLater, isInWatchLater, removeFromWatchLater } = useWatchLater()
  const { hideVideo, hideChannel } = useFeedHide()

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
  const rawDuration = meta?.duration || item.contentDetails?.duration || ''
  const duration = String(rawDuration).startsWith('PT')
    ? clockFromSeconds(parseIsoDuration(rawDuration))
    : rawDuration
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
    setTimeout(() => setToast(''), 2200)
  }

  const closeMenu = () => setMenuOpen(false)

  const menuActions = [
    {
      icon: 'fa-regular fa-clock',
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
      icon: 'fa-regular fa-bookmark',
      label: 'Save to playlist',
      run: () => setSaveOpen(true),
    },
    {
      icon: 'fa-solid fa-share',
      label: 'Share',
      run: () => {
        navigator.clipboard?.writeText(`${window.location.origin}/Video/${videoId}`)
        flash('Link copied')
      },
    },
    {
      icon: 'fa-solid fa-download',
      label: 'Download',
      run: async () => {
        try {
          const url = meta?.localVideoUrl || SAMPLE_MP4
          const name = `${(item.snippet.title || 'video').slice(0, 40).replace(/[^\w\s-]/g, '')}.mp4`
          await downloadVideoFile(url, name)
          flash('Download started')
        } catch {
          flash('Download failed')
        }
      },
    },
    {
      icon: 'fa-regular fa-eye-slash',
      label: 'Not interested',
      run: () => {
        hideVideo(videoId)
        onHidden?.(videoId)
        flash('We will hide this video')
      },
    },
    {
      icon: 'fa-solid fa-ban',
      label: "Don't recommend channel",
      run: () => {
        if (channelId) hideChannel(channelId)
        onHidden?.(videoId, channelId)
        flash("We won't recommend this channel")
      },
    },
  ]

  return (
    <div
      className={`group relative flex flex-col w-full min-w-0 text-[#f1f1f1] overflow-visible ${
        menuOpen ? 'z-50' : ''
      }`}
    >
      <Link
        to={`/Video/${videoId}`}
        onClick={() => window.scrollTo(0, 0)}
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
            <Link
              to={`/Video/${videoId}`}
              onClick={() => window.scrollTo(0, 0)}
              className="min-w-0 flex-1"
            >
              <h3 className="text-sm sm:text-[15px] font-medium leading-snug line-clamp-2">
                {item.snippet.title}
              </h3>
            </Link>
            <div className="relative flex-shrink-0">
              <button
                type="button"
                className="h-8 w-8 rounded-full hover:bg-[#272727]"
                aria-label="More options"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setMenuOpen((v) => !v)
                }}
              >
                <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
              </button>
              {menuOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[80] cursor-default"
                    aria-label="Close menu"
                    onClick={closeMenu}
                  />
                  <div className="absolute right-0 top-9 z-[90] w-60 rounded-xl bg-[#282828] shadow-2xl overflow-hidden text-sm border border-[#3f3f3f]">
                    {menuActions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className="w-full text-left px-4 py-2.5 hover:bg-[#3e3e3e] flex items-center gap-3"
                        onClick={() => {
                          action.run()
                          closeMenu()
                        }}
                      >
                        <i className={`${action.icon} w-4 text-center text-[#aaa]`}></i>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
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

      {toast ? (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-[#f1f1f1] text-black text-sm px-4 py-2 rounded-lg shadow-lg">
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
