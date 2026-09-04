import { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ThemeContext } from '../Hooks/ThemeContext'
import { useWatchHistory } from '../Hooks/HistoryContext'
import {
  getChannelLogoMap,
  getVideoComments,
  getVideoDetails,
  searchVideos,
} from '../utils/youtubeApi'
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
    let cancelled = false

    const load = async () => {
      setNotFound(false)
      let videoPayload = null

      if (location.state?.items) {
        videoPayload = location.state
        if (!cancelled) setFetchData(location.state)
      } else if (id) {
        const data = await getVideoDetails(id)
        if (cancelled) return
        videoPayload = data
        if (data?.items?.length) setFetchData(data)
        else setNotFound(true)
      }

      const video = videoPayload?.items?.[0]
      if (video && id) {
        const channelId = video.snippet?.channelId
        let channelLogo = ''
        if (channelId) {
          const logos = await getChannelLogoMap([channelId])
          channelLogo = logos[channelId] || ''
        }
        addToHistory({
          videoId: id,
          title: video.snippet?.title,
          thumbnail:
            video.snippet?.thumbnails?.medium?.url ||
            video.snippet?.thumbnails?.default?.url,
          channelTitle: video.snippet?.channelTitle,
          channelId,
          channelLogo,
        })
      }

      if (id) {
        const comments = await getVideoComments(id)
        if (!cancelled) setCommentData(comments || { items: [] })
      }

      const relatedQuery = text || video?.snippet?.title || 'trending'
      const related = await searchVideos(relatedQuery, 25)
      if (!cancelled) setRandomVideosData(related || { items: [] })
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, id, text, location.state])

  if (notFound) {
    return (
      <div className="pt-[119px] text-center text-[#AAAAAA] min-h-[50vh] flex flex-col items-center justify-center px-4">
        <p className="text-white text-lg mb-2">Video unavailable</p>
        <p className="text-sm">This video could not be loaded right now.</p>
      </div>
    )
  }

  return (
    <div
      className={`grid text-[#AAAAAA] max-w-[1666px] w-full bg-[#0f0f0f] m-auto VideoPlayer pt-[90px] sm:pt-[100px] px-0 sm:px-4 ${
        windowResize <= 1170 ? 'gap-4' : 'gap-6'
      }`}
    >
      <div className="flex flex-col max-w-[1500px] w-full min-w-0">
        <Player fetchData={fetchData} />
        <VideoDescription fetchData={fetchData} />
        <div className="comments-section">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>

      <div className="min-w-0 w-full">
        <RelatedVideos setupdate={setUpdate} randomVideosData={randomVideosData} />
        <div className="comments-section-bottom">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
