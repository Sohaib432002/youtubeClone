import { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ThemeContext } from '../Hooks/ThemeContext'
import { useWatchHistory } from '../Hooks/HistoryContext'
import {
  getVideoComments,
  getVideoDetails,
  searchVideos,
} from '../utils/youtubeApi'
import {
  getCatalogVideo,
  getRelated,
  toSearchItem,
} from '../data/mockCatalog'
import Comments from './PlayerComponent/Comments'
import Player from './PlayerComponent/Player'
import RelatedVideos from './PlayerComponent/RelatedVideosList'
import VideoDescription from './PlayerComponent/subComponents/VideoDescription'

const VideoPlayer = () => {
  const location = useLocation()
  const { id, text } = useParams()
  const [fetchData, setFetchData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [commentData, setCommentData] = useState({ items: [] })
  const [randomVideosData, setRandomVideosData] = useState({ items: [] })
  const [update, setUpdate] = useState(0)
  const { windowResize, setisShowScrollbar } = useContext(ThemeContext)
  const { addToHistory } = useWatchHistory()

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  useEffect(() => {
    if (!id || id === 'undefined') {
      setNotFound(true)
      return
    }
    let cancelled = false

    const load = async () => {
      setNotFound(false)

      // Prefer live YouTube / Django details so real titles match the video id
      if (location.state?.items) {
        if (!cancelled) setFetchData(location.state)
      } else if (id) {
        const data = await getVideoDetails(id)
        if (cancelled) return
        if (data?.items?.length) {
          if (!cancelled) setFetchData(data)
        } else {
          const catalog = getCatalogVideo(id)
          if (catalog) {
            const item = toSearchItem(catalog)
            if (!cancelled) {
              setFetchData({
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
              })
            }
          } else {
            setNotFound(true)
          }
        }
      }

      const catalog = getCatalogVideo(id)
      const video = catalog || null
      if (id) {
        addToHistory({
          videoId: id,
          title: video?.title || fetchData?.items?.[0]?.snippet?.title,
          thumbnail: video?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
          channelTitle: video?.channelTitle,
          channelId: video?.channelId,
          channelLogo: video?.channelAvatar,
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

      const relatedLocal = { items: getRelated(id, 24) }
      try {
        const related = await searchVideos(text || video?.title || 'trending', 20)
        if (!cancelled) {
          setRandomVideosData(
            related?.items?.length
              ? {
                  items: [
                    ...related.items,
                    ...relatedLocal.items.filter(
                      (r) => !related.items.some((x) => x.id?.videoId === r.id?.videoId)
                    ),
                  ],
                }
              : relatedLocal
          )
        }
      } catch (_) {
        if (!cancelled) setRandomVideosData(relatedLocal)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, id, text, location.state])

  if (notFound) {
    return (
      <div className="pt-[119px] text-center text-[#aaa] min-h-[50vh] flex flex-col items-center justify-center px-4">
        <p className="text-white text-lg mb-2">Video unavailable</p>
      </div>
    )
  }

  return (
    <div
      className={`grid text-[#aaa] max-w-[1700px] w-full bg-[#0f0f0f] m-auto VideoPlayer pt-[64px] sm:pt-[80px] pb-20 md:pb-8 px-0 sm:px-4 ${
        windowResize <= 1170 ? 'gap-4' : 'gap-6'
      }`}
    >
      <div className="flex flex-col max-w-[1500px] w-full min-w-0 overflow-x-hidden">
        <Player fetchData={fetchData} />
        <VideoDescription fetchData={fetchData} />
        <div className="comments-section">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>
      <div className="min-w-0 w-full overflow-x-hidden">
        <RelatedVideos setupdate={setUpdate} randomVideosData={randomVideosData} />
        <div className="comments-section-bottom mt-4">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
