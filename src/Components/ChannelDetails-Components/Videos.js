import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { getChannelLogoMap, videoIdOf, dedupeByVideoId } from '../../utils/youtubeApi'
import Card from '../Home-components/Card'

const Videos = () => {
  const outlet = useOutletContext() || {}
  const channelVideosReady = outlet.channelVideosReady !== false
  const [vidoelistData, setVideolistData] = useState([])
  const [logoMap, setLogoMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const channelVideos = outlet.channelVideos || []
    const load = async () => {
      if (!channelVideosReady) {
        setLoading(true)
        return
      }

      const list = dedupeByVideoId(channelVideos).map((v) => ({
        ...v,
        id: { videoId: videoIdOf(v) },
        snippet: v.snippet,
      })).filter((v) => v.id.videoId && v.snippet)

      setVideolistData(list)
      if (!list.length) {
        if (!cancelled) setLoading(false)
        return
      }

      const map = await getChannelLogoMap(list.map((v) => v.snippet?.channelId))
      if (!cancelled) {
        setLogoMap(map)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [outlet.channelVideos, channelVideosReady])

  if (!channelVideosReady || loading) {
    return <p className="text-[#AAAAAA] py-6 text-center">Loading videos...</p>
  }

  if (!vidoelistData.length) {
    return <p className="text-[#AAAAAA] py-6 text-center">No videos found for this channel.</p>
  }

  return (
    <div className="grid vidocardlist grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 my-5 px-1">
      {vidoelistData.map((item) => (
        <Card
          key={item.id?.videoId || item.id}
          item={item}
          channelLogo={logoMap[item.snippet?.channelId]}
        />
      ))}
    </div>
  )
}

export default Videos
