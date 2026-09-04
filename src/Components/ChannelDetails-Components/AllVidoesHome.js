import { useOutletContext } from 'react-router'
import { useEffect, useState } from 'react'
import { getChannelLogoMap } from '../../utils/youtubeApi'
import Card from '../Home-components/Card'

const AllVideosHome = () => {
  const { channelVideos = [], channelData } = useOutletContext() || {}
  const [logoMap, setLogoMap] = useState({})

  useEffect(() => {
    const ids = channelVideos.map((v) => v.snippet?.channelId).filter(Boolean)
    if (!ids.length && channelData?.id) ids.push(channelData.id)
    getChannelLogoMap(ids).then(setLogoMap)
  }, [channelVideos, channelData])

  const logo =
    channelData?.snippet?.thumbnails?.default?.url ||
    logoMap[channelData?.id] ||
    '/favicon.ico'

  if (!channelVideos.length) {
    return <p className="text-[#AAAAAA] py-8 text-center">No videos found for this channel.</p>
  }

  return (
    <div className="text-white py-4">
      <h2 className="font-extrabold text-lg my-3">Uploads</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {channelVideos.map((item) => (
          <Card
            key={item.id?.videoId || item.etag}
            item={item}
            channelLogo={logoMap[item.snippet?.channelId] || logo}
          />
        ))}
      </div>
    </div>
  )
}

export default AllVideosHome
