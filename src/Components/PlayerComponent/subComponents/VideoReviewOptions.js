import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getChannelsByIds } from '../../../utils/youtubeApi'
import { getCatalogVideo } from '../../../data/mockCatalog'
import { formatViews } from '../../../utils/format'
import { downloadAndSave } from '../../../utils/downloads'
import { useAuth } from '../../../Hooks/AuthContext'
import { useLikes } from '../../../Hooks/LikesContext'
import { useSubscriptions } from '../../../Hooks/SubscriptionsContext'
import { useWatchLater } from '../../../Hooks/WatchLaterContext'
import SubscribeButton from '../../ui/SubscribeButton'
import SavePlaylistModal from '../../ui/SavePlaylistModal'

const VideoReviewOptions = ({ fetchData }) => {
  const [disLike, setdisLike] = useState(false)
  const [revOptions, setrevOptions] = useState(false)
  const [channelLogo, setChannelLogo] = useState('')
  const [channelSubs, setChannelSubs] = useState(null)
  const [dlProgress, setDlProgress] = useState(null)
  const [dlError, setDlError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionOk, setActionOk] = useState('')
  const [saveOpen, setSaveOpen] = useState(false)

  const { isSignedIn } = useAuth()
  const { isLiked, toggleLike, getLikeCount, syncLikeBase } = useLikes()
  const { getSubscriberCount, syncSubscriberBase } = useSubscriptions()
  const { isInWatchLater } = useWatchLater()

  const video = fetchData?.items?.[0]
  const channelId = video?.snippet?.channelId
  const videoId =
    (typeof video?.id === 'string' && video.id) ||
    video?.id?.videoId ||
    (typeof video?.id === 'object' ? null : video?.id)
  const catalog = getCatalogVideo(videoId)
  const liked = isLiked(videoId)

  const originalLikes = useMemo(() => {
    const api = video?.statistics?.likeCount
    if (api != null && api !== '') return Number(api)
    if (catalog?.likes != null) return Number(catalog.likes)
    return 0
  }, [video, catalog])

  const originalSubs = useMemo(() => {
    if (channelSubs != null && channelSubs !== '') return channelSubs
    if (catalog?.subscribers != null) return catalog.subscribers
    const api = video?.statistics?.subscriberCount
    if (api != null && api !== '') return api
    return 0
  }, [channelSubs, catalog, video])

  useEffect(() => {
    setdisLike(false)
    setActionError('')
    setActionOk('')
    setrevOptions(false)
  }, [videoId])

  useEffect(() => {
    setChannelSubs(null)
    setChannelLogo('')
  }, [channelId])

  useEffect(() => {
    if (videoId != null) syncLikeBase(videoId, originalLikes)
  }, [videoId, originalLikes, syncLikeBase])

  useEffect(() => {
    if (!channelId) return
    if (channelSubs == null && catalog?.subscribers == null) return
    if (originalSubs == null || originalSubs === '') return
    syncSubscriberBase(channelId, originalSubs)
  }, [channelId, originalSubs, channelSubs, catalog, syncSubscriberBase])

  useEffect(() => {
    if (catalog?.channelAvatar || video?.meta?.channelAvatar) {
      setChannelLogo(catalog?.channelAvatar || video.meta.channelAvatar)
    }
    const localChannel =
      !channelId ||
      String(channelId).startsWith('ch_') ||
      String(channelId).startsWith('uc_')
    if (localChannel) {
      if (catalog?.subscribers != null) setChannelSubs(catalog.subscribers)
      return undefined
    }
    let cancelled = false
    getChannelsByIds([channelId]).then((data) => {
      const ch = data?.items?.[0]
      if (cancelled || !ch) return
      const logo =
        ch.snippet?.thumbnails?.default?.url ||
        ch.snippet?.thumbnails?.medium?.url ||
        ch.snippet?.thumbnails?.high?.url ||
        ''
      if (logo) setChannelLogo(logo)
      if (ch.statistics?.subscriberCount != null) {
        setChannelSubs(ch.statistics.subscriberCount)
      }
    })
    return () => {
      cancelled = true
    }
  }, [channelId, catalog, video?.meta?.channelAvatar])

  const videoEntry = {
    videoId,
    title: video?.snippet?.title,
    thumbnail:
      video?.snippet?.thumbnails?.medium?.url ||
      video?.snippet?.thumbnails?.high?.url ||
      `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    channelTitle: video?.snippet?.channelTitle,
    channelId,
    channelLogo: channelLogo || catalog?.channelAvatar,
    views: video?.statistics?.viewCount || catalog?.views,
    duration: catalog?.duration || '',
    publishedAt: video?.snippet?.publishedAt || catalog?.publishedAt,
    likeCount: originalLikes,
  }

  const onLike = () => {
    setActionError('')
    setActionOk('')
    const result = toggleLike(videoEntry)
    if (result.ok && result.liked) {
      setdisLike(false)
      setActionOk('Added to Liked videos')
    } else if (result.ok && !result.liked) {
      setActionOk('Removed from Liked videos')
    }
    if (!result.ok && result.reason !== 'auth') {
      setActionError('Could not update like. Try again.')
    }
  }

  const onDownload = async () => {
    setDlError('')
    setActionOk('')
    if (!videoId) {
      setDlError('Download is not available for this video.')
      return
    }
    try {
      setDlProgress(0)
      await downloadAndSave(
        {
          videoId,
          title: video?.snippet?.title || catalog?.title || 'video',
          thumbnail:
            video?.snippet?.thumbnails?.medium?.url ||
            video?.snippet?.thumbnails?.high?.url ||
            `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          channelTitle: video?.snippet?.channelTitle,
          channelId,
          localVideoUrl: video?.meta?.localVideoUrl,
          downloadUrl: catalog?.downloadUrl,
        },
        setDlProgress
      )
      setActionOk('Saved to Downloads')
      setTimeout(() => setDlProgress(null), 600)
    } catch (err) {
      setDlProgress(null)
      setDlError(err.message || 'Download failed. Try again.')
    }
  }

  if (!video) return null

  const displayLikes = getLikeCount(videoId, originalLikes)
  const subCount = getSubscriberCount(channelId, originalSubs)
  const savedSomewhere = isInWatchLater(videoId)

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
            {isSignedIn ? (
              <span className="text-xs text-[#aaa]">
                {formatViews(subCount)} subscribers
              </span>
            ) : null}
          </div>
          <SubscribeButton
            channelId={channelId}
            title={video.snippet?.channelTitle}
            avatar={channelLogo || catalog?.channelAvatar}
            subscriberCount={originalSubs}
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
                  toggleLike(videoEntry)
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
              setActionOk('Link copied')
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

          <button
            type="button"
            onClick={() => setSaveOpen(true)}
            className={`flex items-center gap-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#eee] text-sm px-3.5 py-2 ${
              savedSomewhere ? 'ring-1 ring-[#3ea6ff]' : ''
            }`}
          >
            <i className={`fa-${savedSomewhere ? 'solid' : 'regular'} fa-bookmark`}></i>
            Save
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
              <div className="absolute right-0 top-12 z-30 bg-[#282828] rounded-xl overflow-hidden w-52 shadow-xl border border-[#3f3f3f]">
                <button
                  type="button"
                  onClick={() => {
                    setSaveOpen(true)
                    setrevOptions(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-sm text-left"
                >
                  <i className="fa-regular fa-bookmark"></i>
                  Save to playlist
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
      {actionOk ? (
        <p className="mx-2 sm:mx-4 md:ml-6 lg:ml-0 mt-2 text-sm text-[#3ea6ff]">{actionOk}</p>
      ) : null}

      <SavePlaylistModal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        video={videoEntry}
      />
    </>
  )
}

export default VideoReviewOptions
