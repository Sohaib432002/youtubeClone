import { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ThemeContext } from '../Hooks/ThemeContext'
import { useWatchHistory } from '../Hooks/HistoryContext'
import {
  getVideoComments,
  getVideoDetails,
  searchVideos,
} from '../utils/youtubeApi'
import {
  extractKeywords,
  getCatalogVideo,
  getRelated,
  isShortSearchItem,
  toSearchItem,
} from '../data/mockCatalog'
import Comments from './PlayerComponent/Comments'
import Player from './PlayerComponent/Player'
import RelatedVideos from './PlayerComponent/RelatedVideosList'
import VideoDescription from './PlayerComponent/subComponents/VideoDescription'

function landscapeThumb(videoId, fallback) {
  if (videoId) return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
  return fallback || ''
}

function normalizeRelatedItem(it) {
  const videoId =
    (typeof it.id === 'string' && it.id) || it.id?.videoId || it.meta?.videoId
  if (!videoId || !it.snippet) return null
  if (isShortSearchItem(it)) return null
  const thumb = landscapeThumb(
    videoId,
    it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.high?.url
  )
  return {
    ...it,
    id: { kind: 'youtube#video', videoId },
    snippet: {
      ...it.snippet,
      thumbnails: {
        default: { url: thumb },
        medium: { url: thumb },
        high: { url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` },
      },
    },
    meta: {
      ...(it.meta || {}),
      videoId,
      isShort: false,
      duration: it.meta?.duration || it.contentDetails?.duration || '',
    },
  }
}

function buildRelatedQuery(title, category) {
  const keys = extractKeywords(title).slice(0, 5)
  if (keys.length) return keys.join(' ')
  if (category) return category
  return 'tutorial'
}

const VideoPlayer = () => {
  const location = useLocation()
  const { id, text } = useParams()
  const [fetchData, setFetchData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [commentData, setCommentData] = useState({ items: [] })
  const [relatedData, setRelatedData] = useState({ items: [] })
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [relatedError, setRelatedError] = useState('')
  const [update, setUpdate] = useState(0)
  const {
    windowResize,
    setisShowScrollbar,
    setWatchMode,
    contentOffsetPx,
    isDesktopSidebar,
  } = useContext(ThemeContext)
  const { addToHistory } = useWatchHistory()

  useEffect(() => {
    setisShowScrollbar(false)
    setWatchMode(true)
    return () => setWatchMode(false)
  }, [setisShowScrollbar, setWatchMode])

  useEffect(() => {
    if (!id || id === 'undefined') {
      setNotFound(true)
      return
    }
    let cancelled = false

    const load = async () => {
      setNotFound(false)
      setRelatedLoading(true)
      setRelatedError('')
      setFetchData(null)

      let details = null

      if (location.state?.items) {
        details = location.state
        if (!cancelled) setFetchData(location.state)
      } else if (id) {
        const data = await getVideoDetails(id)
        if (cancelled) return
        if (data?.items?.length) {
          details = data
          if (!cancelled) setFetchData(data)
        } else {
          const catalog = getCatalogVideo(id)
          if (catalog) {
            const item = toSearchItem(catalog)
            details = {
              kind: 'youtube#videoListResponse',
              items: [
                {
                  kind: 'youtube#video',
                  id: catalog.videoId,
                  snippet: {
                    ...item.snippet,
                    description: catalog.description,
                  },
                  statistics: item.statistics,
                },
              ],
            }
            if (!cancelled) setFetchData(details)
          } else {
            setNotFound(true)
            setRelatedLoading(false)
            return
          }
        }
      }

      const catalog = getCatalogVideo(id)
      const snippet = details?.items?.[0]?.snippet
      const title = snippet?.title || catalog?.title || ''
      const category = catalog?.category || ''
      const description = snippet?.description || catalog?.description || ''

      if (id) {
        addToHistory({
          videoId: id,
          title,
          thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
          channelTitle: snippet?.channelTitle || catalog?.channelTitle,
          channelId: snippet?.channelId || catalog?.channelId,
          channelLogo: catalog?.channelAvatar,
        })
      }

      if (id) {
        const comments = await getVideoComments(id)
        if (!cancelled) {
          if (comments?.items?.length) setCommentData(comments)
          else if (catalog) {
            setCommentData({
              items: [
                {
                  id: 'c1',
                  snippet: {
                    topLevelComment: {
                      snippet: {
                        authorDisplayName: 'Viewer',
                        authorProfileImageUrl: 'https://i.pravatar.cc/50?u=c1',
                        textDisplay: 'Great video! Thanks for sharing.',
                        publishedAt: new Date().toISOString(),
                        likeCount: 12,
                      },
                    },
                  },
                },
              ],
            })
          }
        }
      }

      const relatedLocal = getRelated(id, 24, {
        title,
        category,
        description,
        channelId: snippet?.channelId || catalog?.channelId,
      })

      // Seed with scored catalog matches immediately
      if (!cancelled) {
        setRelatedData({ items: relatedLocal })
        setRelatedLoading(false)
      }

      const query = buildRelatedQuery(title || text, category)
      try {
        const related = await searchVideos(query, 24, { videoDuration: 'medium' })
        if (cancelled) return
        const live = (related?.items || [])
          .map(normalizeRelatedItem)
          .filter(Boolean)

        if (live.length) {
          const ids = new Set(live.map((x) => x.id.videoId))
          const merged = [
            ...live,
            ...relatedLocal.filter((r) => !ids.has(r.id?.videoId)),
          ].slice(0, 28)
          setRelatedData({ items: merged })
        } else if (!relatedLocal.length) {
          setRelatedError('No related videos found for this topic.')
        }
      } catch (_) {
        if (!cancelled && !relatedLocal.length) {
          setRelatedError('Could not load related videos.')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, id, text, location.state])

  const layoutPad = useMemo(() => {
    if (!isDesktopSidebar) return 'ml-0'
    return contentOffsetPx >= 240 ? 'lg:ml-[240px]' : 'lg:ml-[72px]'
  }, [isDesktopSidebar, contentOffsetPx])

  if (notFound) {
    return (
      <div
        className={`${layoutPad} pt-[100px] text-center text-[#aaa] min-h-[50vh] flex flex-col items-center justify-center px-4`}
      >
        <i className="fa-solid fa-circle-exclamation text-4xl text-[#555] mb-3"></i>
        <p className="text-white text-lg mb-2">Video unavailable</p>
        <p className="text-sm">This video may be private or the link is invalid.</p>
      </div>
    )
  }

  const stacked = windowResize < 1170

  return (
    <div
      className={`${layoutPad} min-h-screen bg-[#0f0f0f] text-[#aaa] pt-14 sm:pt-16 pb-20 md:pb-10 transition-[margin] duration-200`}
    >
      <div
        className={`VideoPlayer max-w-[1700px] w-full m-auto px-0 sm:px-4 lg:px-6 ${
          stacked ? 'gap-3' : 'gap-6'
        }`}
      >
        <div className="flex flex-col w-full min-w-0">
          <Player fetchData={fetchData} />
          <VideoDescription fetchData={fetchData} />
          <div className="comments-section px-3 sm:px-0">
            <Comments fetchData={fetchData} commentData={commentData} />
          </div>
        </div>

        <aside className="min-w-0 w-full">
          <RelatedVideos
            setupdate={setUpdate}
            randomVideosData={relatedData}
            loading={relatedLoading}
            error={relatedError}
          />
          <div className="comments-section-bottom mt-4 px-3 sm:px-0">
            <Comments fetchData={fetchData} commentData={commentData} />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default VideoPlayer
