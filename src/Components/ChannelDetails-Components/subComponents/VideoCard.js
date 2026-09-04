import { useState } from 'react'
import { Link } from 'react-router'
import { useWatchLater } from '../../../Hooks/WatchLaterContext'
import SavePlaylistModal from '../../ui/SavePlaylistModal'

const VideoCard = ({ item }) => {
  const [options, setOptions] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const { addToWatchLater, isInWatchLater, removeFromWatchLater } = useWatchLater()

  const videoId = item?.id?.videoId || item?.id
  if (!videoId || !item?.snippet) return null

  const title = item.snippet.localized?.title || item.snippet.title
  const thumb =
    item.snippet.thumbnails?.high?.url ||
    item.snippet.thumbnails?.medium?.url ||
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`

  const videoEntry = {
    videoId: String(videoId),
    title,
    thumbnail: thumb,
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    publishedAt: item.snippet.publishedAt,
  }

  const actions = [
    {
      icon: 'clock',
      label: isInWatchLater(String(videoId))
        ? 'Remove from Watch Later'
        : 'Save to Watch Later',
      run: (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isInWatchLater(String(videoId))) removeFromWatchLater(String(videoId))
        else addToWatchLater(videoEntry)
        setOptions(false)
      },
    },
    {
      icon: 'list',
      label: 'Save to playlist',
      run: (e) => {
        e.preventDefault()
        e.stopPropagation()
        setSaveOpen(true)
        setOptions(false)
      },
    },
    {
      icon: 'share',
      label: 'Share',
      run: (e) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard?.writeText(`${window.location.origin}/Video/${videoId}`)
        setOptions(false)
      },
    },
  ]

  return (
    <>
      <div className="px-1 relative">
        <Link to={`/Video/${videoId}`}>
          <div className="w-[260px] max-w-full flex flex-col">
            <div className="rounded-lg overflow-hidden aspect-video bg-[#272727]">
              <img src={thumb} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="cardText flex text-white justify-between p-2 gap-2">
              <div className="min-w-0">
                <p className="text-[16px] line-clamp-2">{title}</p>
                <span className="text-[14px] text-[#969696]">
                  {item.snippet.channelTitle || 'Channel'}
                </span>
              </div>
              <button
                type="button"
                className="relative flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOptions((v) => !v)
                }}
                aria-label="More"
              >
                <i className="fa-solid my-3 fa-ellipsis-vertical"></i>
              </button>
            </div>
          </div>
        </Link>
        {options ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-20"
              aria-label="Close"
              onClick={() => setOptions(false)}
            />
            <div className="z-30 right-2 top-10 text-[14px] overflow-hidden w-[210px] bg-[#272727] rounded-lg absolute border border-[#3f3f3f]">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.run}
                  className="w-full px-4 hover:bg-[#414140] flex items-center py-2 text-left text-white"
                >
                  <i className={`fa-solid mx-2 fa-${action.icon}`}></i>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
      <SavePlaylistModal open={saveOpen} onClose={() => setSaveOpen(false)} video={videoEntry} />
    </>
  )
}

export default VideoCard
