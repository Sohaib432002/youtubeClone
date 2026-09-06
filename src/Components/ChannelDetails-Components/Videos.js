import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router'
import { getChannelLogoMap, videoIdOf, dedupeByVideoId } from '../../utils/youtubeApi'
import { longformVideos, sortVideos } from '../../utils/channelContent'
import Card from '../Home-components/Card'

const SORTS = [
  { id: 'latest', label: 'Latest' },
  { id: 'popular', label: 'Popular' },
  { id: 'oldest', label: 'Oldest' },
]

const Videos = () => {
  const outlet = useOutletContext() || {}
  const channelVideosReady = outlet.channelVideosReady !== false
  const [sort, setSort] = useState('latest')
  const [logoMap, setLogoMap] = useState({})

  const list = useMemo(() => {
    const uploads = longformVideos(dedupeByVideoId(outlet.channelVideos || []))
    return sortVideos(uploads, sort)
  }, [outlet.channelVideos, sort])

  useEffect(() => {
    const ids = list.map((v) => v.snippet?.channelId).filter(Boolean)
    if (!ids.length) return undefined
    let cancelled = false
    getChannelLogoMap(ids).then((map) => {
      if (!cancelled) setLogoMap(map)
    })
    return () => {
      cancelled = true
    }
  }, [list])

  const logo =
    outlet.channelData?.snippet?.thumbnails?.default?.url ||
    logoMap[outlet.channelData?.id]

  if (!channelVideosReady) {
    return <p className="text-[#AAAAAA] py-6 text-center">Loading videos...</p>
  }

  if (!list.length) {
    return <p className="text-[#AAAAAA] py-6 text-center">No videos found for this channel.</p>
  }

  return (
    <div className="py-4">
      <div className="flex gap-2 mb-4">
        {SORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSort(s.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              sort === s.id ? 'bg-white text-black' : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="grid vidocardlist grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 px-1">
        {list.map((item) => (
          <Card
            key={item.id?.videoId || videoIdOf(item)}
            item={item}
            channelLogo={logoMap[item.snippet?.channelId] || logo}
          />
        ))}
      </div>
    </div>
  )
}

export default Videos
