import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { getChannelLogoMap, getMostPopular } from '../../utils/youtubeApi'
import Card from '../Home-components/Card'

const Videos = () => {
  const outlet = useOutletContext() || {}
  const [vidoelistData, setVideolistData] = useState([])
  const [logoMap, setLogoMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (outlet.channelVideos?.length) {
        setVideolistData(
          outlet.channelVideos.map((v) => ({
            ...v,
            id: v.id?.videoId || v.id,
            snippet: v.snippet,
          }))
        )
        const map = await getChannelLogoMap(
          outlet.channelVideos.map((v) => v.snippet?.channelId)
        )
        if (!cancelled) {
          setLogoMap(map)
          setLoading(false)
        }
        return
      }
      const data = await getMostPopular(48)
      if (cancelled) return
      const items = data?.items || []
      setVideolistData(items)
      const map = await getChannelLogoMap(items.map((v) => v.snippet?.channelId))
      if (!cancelled) {
        setLogoMap(map)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [outlet.channelVideos])

  if (loading) {
    return <p className="text-[#AAAAAA] py-6 text-center">Loading videos...</p>
  }

  return (
    <div className="grid vidocardlist grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 my-5 px-1">
      {vidoelistData.map((item) => {
        const normalized =
          item.id?.videoId || typeof item.id === 'string'
            ? {
                id: { videoId: item.id?.videoId || item.id },
                snippet: item.snippet,
              }
            : item
        return (
          <Card
            key={normalized.id?.videoId || item.id}
            item={normalized}
            channelLogo={logoMap[item.snippet?.channelId]}
          />
        )
      })}
    </div>
  )
}

export default Videos
