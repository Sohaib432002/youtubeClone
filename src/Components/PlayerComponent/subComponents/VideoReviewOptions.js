import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getChannelLogoMap } from '../../../utils/youtubeApi'
import { getCatalogVideo } from '../../../data/mockCatalog'
import { downloadVideoFile, formatViews } from '../../../utils/format'
import { useLikes } from '../../../Hooks/LikesContext'
import { useSubscriptions } from '../../../Hooks/SubscriptionsContext'
import SubscribeButton from '../../ui/SubscribeButton'

const VideoReviewOptions = ({ fetchData }) => {
  const [disLike, setdisLike] = useState(false)
  const [revOptions, setrevOptions] = useState(false)
  const [Saved, setSaved] = useState(false)
  const [channelLogo, setChannelLogo] = useState('')
  const [dlProgress, setDlProgress] = useState(null)
  const [dlError, setDlError] = useState('')
  const [actionError, setActionError] = useState('')

  const { isLiked, toggleLike } = useLikes()
  const { getSubscriberCount } = useSubscriptions()

  const video = fetchData?.items?.[0]
  const channelId = video?.snippet?.channelId
  const videoId =
    (typeof video?.id === 'string' && video.id) ||
    video?.id?.videoId ||
    (typeof video?.id === 'object' ? null : video?.id)
  const catalog = getCatalogVideo(videoId)
  const liked = isLiked(videoId)

  useEffect(() => {
    setdisLike(false)
    setActionError('')
  }, [videoId])

  useEffect(() => {
    if (catalog?.channelAvatar) {
      setChannelLogo(catalog.channelAvatar)
      return
    }
    if (!channelId || String(channelId).startsWith('ch_')) return
    let cancelled = false
    getChannelLogoMap([channelId]).then((map) => {
      if (!cancelled) setChannelLogo(map[channelId] || '')
    })
    return () => {
      cancelled = true
    }
  }, [channelId, catalog])

  const onLike = () => {
    setActionError('')
    const result = toggleLike({
      videoId,
      title: video.snippet?.title,
      thumbnail:
        video.snippet?.thumbnails?.medium?.url ||
        video.snippet?.thumbnails?.high?.url ||
        `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      channelTitle: video.snippet?.channelTitle,
      channelId,
      channelLogo: channelLogo || catalog?.channelAvatar,
      views: video.statistics?.viewCount || catalog?.views,
      duration: catalog?.duration || '',
      publishedAt: video.snippet?.publishedAt || catalog?.publishedAt,
    })
    if (result.ok && result.liked) setdisLike(false)
    if (!result.ok && result.reason !== 'auth') {
      setActionError('Could not update like. Try again.')
    }
  }

  const onDownload = async () => {
    setDlError('')
    const url = catalog?.downloadUrl
    if (!url) {
      setDlError('Download is not available for this video.')
      return
    }
    try {
      setDlProgress(0)
      const name = `${(catalog?.title || 'video').slice(0, 40).replace(/[^\w\s-]/g, '')}.mp4`
      await downloadVideoFile(url, name, setDlProgress)
      const prev = JSON.parse(localStorage.getItem('yt_clone_downloads') || '[]')
      const entry = {
        videoId: catalog.videoId,
        title: catalog.title,
        thumbnail: catalog.thumbnails.medium.url,
        downloadedAt: new Date().toISOString(),
      }
      localStorage.setItem(
        'yt_clone_downloads',
        JSON.stringify([entry, ...prev.filter((x) => x.videoId !== entry.videoId)].slice(0, 50))
      )
      setTimeout(() => setDlProgress(null), 800)
    } catch (err) {
      setDlProgress(null)
      setDlError(err.message || 'Download failed. Try again.')
    }
  }

  if (!video) return null

  const baseLikes = Number(video.statistics?.likeCount || catalog?.likes || 0)
  const displayLikes = baseLikes + (liked ? 1 : 0)
  const subCount = getSubscriberCount(
    channelId,
    video.statistics?.subscriberCount || catalog?.subscribers || 0
  )

  return (
    <>
      <div className="title mx-2 sm:mx-4 md:ml-6 lg:ml-0 mt-3">
        <p className="text-lg sm:text-xl font-bold text-[#f1f1f1] break-words pr-2">
          {video.snippet?.title}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center max-w-[1280px] mx-2 sm:mx-4 md:ml-6 lg:ml-0 VideoCreatorDetails justify-between gap-3 mt-2">
        <div className="flex items-center flex-wrap gap-2 min-w-0">
          <Link
            to={channelId ? `/channel/${channelId}` : '#'}
            className="flex-shrink-0"
          >
            <img
              src={channelLogo || catalog?.channelAvatar || '/favicon.ico'}
              alt=""
              className="w-10 h-10 rounded-full object-cover bg-[#272727]"
            />
          </Link>
          <div className="flex flex-col min-w-0">
            <Link
              to={channelId ? `/channel/${channelId}` : '#'}
              className="text-sm sm:text-base text-[#f1f1f1] font-medium truncate hover:underline"
            >
              {video.snippet?.channelTitle}
            </Link>
            <span className="text-xs text-[#aaa]">
              {formatViews(subCount)} subscribers
            </span>
          </div>
          <SubscribeButton
            channelId={channelId}
            title={video.snippet?.channelTitle}
            avatar={channelLogo || catalog?.channelAvatar}
            subscriberCount={subCount}
            className="ml-1"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-full bg-[#272727] text-[#eee] text-sm">
            <button
              type="button"
              onClick={onLike}
              className={`flex items-center gap-1.5 px-3.5 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f] ${
                liked ? 'text-white' : ''
              }`}
              aria-pressed={liked}
            >
              <i className={`fa-${liked ? 'solid' : 'regular'} fa-thumbs-up`}></i>
              {formatViews(displayLikes)}
            </button>
            <button
              type="button"
              onClick={() => {
                setdisLike(!disLike)
                if (!disLike && liked) {
                  toggleLike({
                    videoId,
                    title: video.snippet?.title,
                    thumbnail: video.snippet?.thumbnails?.medium?.url,
                    channelTitle: video.snippet?.channelTitle,
                    channelId,
                  })
                }
              }}
              className="px-3.5 py-2 hover:bg-[#3f3f3f]"
              aria-pressed={disLike}
            >
              <i className={`fa-${disLike ? 'solid' : 'regular'} fa-thumbs-down`}></i>
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#eee] text-sm px-3.5 py-2"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href)
              setActionError('')
              alert('Link copied')
            }}
          >
            <i className="fa-solid fa-share"></i>
            Share
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={dlProgress !== null}
            className="flex items-center gap-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#eee] text-sm px-3.5 py-2 disabled:opacity-60"
          >
            {dlProgress !== null ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                {dlProgress}%
              </>
            ) : (
              <>
                <i className="fa-solid fa-download"></i>
                Download
              </>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setrevOptions(!revOptions)}
              className="w-10 h-10 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#eee]"
              aria-label="More actions"
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            {revOptions ? (
              <div className="absolute right-0 top-12 z-30 bg-[#282828] rounded-xl overflow-hidden w-48 shadow-xl border border-[#3f3f3f]">
                <button
                  type="button"
                  onClick={() => {
                    setSaved(!Saved)
                    setrevOptions(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-sm text-left"
                >
                  <i className={`fa-${Saved ? 'solid' : 'regular'} fa-bookmark`}></i>
                  {Saved ? 'Saved' : 'Save'}
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-sm text-left"
                  onClick={() => setrevOptions(false)}
                >
                  <i className="fa-regular fa-flag"></i>
                  Report
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {dlError ? (
        <p className="mx-2 sm:mx-4 md:ml-6 lg:ml-0 mt-2 text-sm text-red-400">{dlError}</p>
      ) : null}
      {actionError ? (
        <p className="mx-2 sm:mx-4 md:ml-6 lg:ml-0 mt-2 text-sm text-red-400">{actionError}</p>
      ) : null}
    </>
  )
}

export default VideoReviewOptions
