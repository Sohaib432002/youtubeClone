import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getChannelLogoMap } from '../../../utils/youtubeApi'
import { getCatalogVideo } from '../../../data/mockCatalog'
import { downloadVideoFile, formatViews } from '../../../utils/format'

const VideoReviewOptions = ({ fetchData }) => {
  const [Like, setLike] = useState(false)
  const [disLike, setdisLike] = useState(false)
  const [revOptions, setrevOptions] = useState(false)
  const [Saved, setSaved] = useState(false)
  const [channelLogo, setChannelLogo] = useState('')
  const [dlProgress, setDlProgress] = useState(null)
  const [dlError, setDlError] = useState('')

  const video = fetchData?.items?.[0]
  const channelId = video?.snippet?.channelId
  const videoId = typeof video?.id === 'string' ? video.id : video?.id
  const catalog = getCatalogVideo(videoId)

  useEffect(() => {
    if (catalog?.channelAvatar) {
      setChannelLogo(catalog.channelAvatar)
      return
    }
    if (!channelId || String(channelId).startsWith('ch_')) return
    getChannelLogoMap([channelId]).then((map) => {
      setChannelLogo(map[channelId] || '')
    })
  }, [channelId, catalog])

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
      // persist to local downloads list
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

  const likes = video.statistics?.likeCount || catalog?.likes

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
              alt="channel"
              className="w-10 h-10 rounded-full object-cover"
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
              {formatViews(video.statistics?.viewCount || catalog?.views)} views
            </span>
          </div>
          <button
            type="button"
            className="ml-2 font-semibold bg-white text-black hover:bg-[#d9d9d9] text-sm rounded-full py-2 px-4"
          >
            Subscribe
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-full bg-[#272727] text-[#eee] text-sm">
            <button
              type="button"
              onClick={() => {
                setLike(!Like)
                if (!Like) setdisLike(false)
              }}
              className="flex items-center gap-1 px-3 py-2 hover:bg-[#3f3f3f] border-r border-[#3f3f3f]"
            >
              <i className={`fa-${Like ? 'solid' : 'regular'} fa-thumbs-up`}></i>
              {formatViews(likes)}
            </button>
            <button
              type="button"
              onClick={() => {
                setdisLike(!disLike)
                if (!disLike) setLike(false)
              }}
              className="px-3 py-2 hover:bg-[#3f3f3f]"
            >
              <i className={`fa-${disLike ? 'solid' : 'regular'} fa-thumbs-down`}></i>
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#eee] text-sm px-3 py-2"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href)
              alert('Link copied')
            }}
          >
            <i className="fa-solid fa-share"></i>
            Share
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#eee] text-sm px-3 py-2"
            onClick={() => alert('Ask AI about this video (demo).')}
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            Ask
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={dlProgress !== null}
            className="flex items-center gap-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-[#eee] text-sm px-3 py-2 disabled:opacity-60"
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
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            {revOptions ? (
              <div className="absolute right-0 top-12 z-30 bg-[#282828] rounded-xl overflow-hidden w-48 shadow-xl">
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
    </>
  )
}

export default VideoReviewOptions
