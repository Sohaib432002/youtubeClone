import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ThemeContext } from '../Hooks/ThemeContext'
import { useWatchHistory } from '../Hooks/HistoryContext'
import { useStudio, studioVideoToDetails, studioVideoToSearchItem } from '../Hooks/StudioContext'
import { getVideoComments, getVideoDetails, getRelatedVideos, videoIdOf } from '../utils/youtubeApi'
import { getCatalogVideo, getRelated, isShortSearchItem, toSearchItem } from '../data/mockCatalog'
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
  const customThumb =
    it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.medium?.url
  const thumb = it.meta?.isStudio
    ? customThumb || landscapeThumb(videoId)
    : landscapeThumb(videoId, customThumb)
  return {
    ...it,
    id: { kind: 'youtube#video', videoId },
    snippet: {
      ...it.snippet,
      thumbnails: {
        default: { url: thumb },
        medium: { url: thumb },
        high: { url: it.meta?.isStudio ? thumb : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` },
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

function mergeRelatedItems(incoming, prevItems, currentId, reset) {
  const live = (incoming || []).map(normalizeRelatedItem).filter(Boolean)
  const seen = new Set(
    reset ? [currentId] : [currentId, ...(prevItems || []).map((r) => r.id?.videoId)]
  )
  const extra = live.filter((r) => {
    const vid = r.id?.videoId
    if (!vid || seen.has(vid)) return false
    seen.add(vid)
    return true
  })
  return { items: reset ? extra : [...(prevItems || []), ...extra], added: extra.length }
}

const VideoPlayer = () => {
  const location = useLocation()
  const { id, text } = useParams()
  const [fetchData, setFetchData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [commentData, setCommentData] = useState({ items: [] })
  const [relatedData, setRelatedData] = useState({ items: [] })
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [relatedLoadingMore, setRelatedLoadingMore] = useState(false)
  const [relatedHasMore, setRelatedHasMore] = useState(false)
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
  const { getVideo, getVideosByChannel } = useStudio()

  const relatedMetaRef = useRef({ title: '', description: '', channelId: '', stage: 0, token: '' })
  const relatedBusyRef = useRef(false)
  const relatedItemsRef = useRef([])

  useEffect(() => {
    relatedItemsRef.current = relatedData.items || []
  }, [relatedData.items])

  useEffect(() => {
    setisShowScrollbar(false)
    setWatchMode(true)
    return () => setWatchMode(false)
  }, [setisShowScrollbar, setWatchMode])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [id])

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
      setRelatedData({ items: [] })
      setRelatedHasMore(false)
      relatedMetaRef.current = { title: '', description: '', channelId: '', stage: 0, token: '' }
      setFetchData(null)

      let details = null
      const studioVid = getVideo(id)

      if (studioVid) {
        details = studioVideoToDetails(studioVid)
        if (!cancelled) setFetchData(details)
      } else if (location.state?.items) {
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
      const title = snippet?.title || catalog?.title || studioVid?.title || text || ''
      const description = snippet?.description || catalog?.description || studioVid?.description || ''
      const channelId = snippet?.channelId || catalog?.channelId || studioVid?.channelId || ''

      relatedMetaRef.current = { title, description, channelId, stage: 0, token: '' }

      if (id) {
        addToHistory({
          videoId: id,
          title,
          thumbnail:
            studioVid?.thumbnail || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
          channelTitle: snippet?.channelTitle || catalog?.channelTitle || studioVid?.channelTitle,
          channelId,
          channelLogo: catalog?.channelAvatar || studioVid?.channelAvatar,
        })
      }

      if (id && !studioVid) {
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
          } else {
            setCommentData({ items: [] })
          }
        }
      } else if (!cancelled) {
        setCommentData({ items: [] })
      }

      try {
        let relatedItems = []
        if (studioVid) {
          relatedItems = getVideosByChannel(studioVid.channelId)
            .filter((v) => v.videoId !== id)
            .map(studioVideoToSearchItem)
            .filter(Boolean)
        }

        const related = await getRelatedVideos(
          { videoId: id, title, description, channelId },
          24
        )
        if (cancelled) return

        const live = [...relatedItems, ...(related?.items || [])]
        let added = 0
        setRelatedData((prev) => {
          const next = mergeRelatedItems(live, prev.items, id, true)
          added = next.added
          return { items: next.items }
        })

        relatedMetaRef.current.token = related?.nextPageToken || ''
        relatedMetaRef.current.stage = related?.stage || 0
        setRelatedHasMore(Boolean(related?.hasMore))

        if (!added && catalog) {
          const local = getRelated(id, 24, {
            title,
            category: catalog.category,
            description,
            channelId,
          })
          setRelatedData((prev) => ({
            items: mergeRelatedItems(local, prev.items, id, true).items,
          }))
          setRelatedHasMore(false)
        } else if (!added) {
          setRelatedError('No related videos found for this topic.')
        }
      } catch (_) {
        if (!cancelled) {
          const relatedLocal = catalog
            ? getRelated(id, 24, {
                title,
                category: catalog.category,
                description,
                channelId,
              })
            : []
          if (relatedLocal.length) {
            setRelatedData((prev) => ({
              items: mergeRelatedItems(relatedLocal, prev.items, id, true).items,
            }))
          } else setRelatedError('Could not load related videos.')
          setRelatedHasMore(false)
        }
      } finally {
        if (!cancelled) setRelatedLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, id, text, location.state])

  const loadMoreRelated = useCallback(async () => {
    if (relatedBusyRef.current || !relatedHasMore || relatedLoading) return
    relatedBusyRef.current = true
    setRelatedLoadingMore(true)
    const meta = relatedMetaRef.current
    const excludeIds = (relatedItemsRef.current || []).map((it) => videoIdOf(it)).filter(Boolean)
    try {
      const more = await getRelatedVideos(
        {
          videoId: id,
          title: meta.title,
          description: meta.description,
          channelId: meta.channelId,
        },
        24,
        {
          pageToken: meta.token,
          excludeIds: [id, ...excludeIds],
          stage: meta.stage,
        }
      )
      setRelatedData((prev) => ({
        items: mergeRelatedItems(more?.items || [], prev.items, id, false).items,
      }))
      relatedMetaRef.current.token = more?.nextPageToken || ''
      relatedMetaRef.current.stage = more?.stage || meta.stage + 1
      setRelatedHasMore(Boolean(more?.hasMore && (more.items || []).length))
      if (!(more?.items || []).length) setRelatedHasMore(false)
    } catch (_) {
      setRelatedHasMore(false)
    } finally {
      relatedBusyRef.current = false
      setRelatedLoadingMore(false)
    }
  }, [id, relatedHasMore, relatedLoading])

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
          {stacked ? (
            <div className="px-3 sm:px-0">
              <Comments fetchData={fetchData} commentData={commentData} collapsed />
            </div>
          ) : (
            <div className="comments-section px-3 sm:px-0">
              <Comments fetchData={fetchData} commentData={commentData} />
            </div>
          )}
        </div>

        <aside className="min-w-0 w-full">
          <RelatedVideos
            setupdate={setUpdate}
            randomVideosData={relatedData}
            loading={relatedLoading}
            loadingMore={relatedLoadingMore}
            error={relatedError}
            hasMore={relatedHasMore}
            onLoadMore={loadMoreRelated}
          />
        </aside>
      </div>
    </div>
  )
}

export default VideoPlayer
