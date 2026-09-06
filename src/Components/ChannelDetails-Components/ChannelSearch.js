import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { longformVideos } from '../../utils/channelContent'
import { videoIdOf } from '../../utils/youtubeApi'
import Card from '../Home-components/Card'

const ChannelSearch = () => {
  const { channelVideos = [], channelData, channelVideosReady = true } =
    useOutletContext() || {}
  const [q, setQ] = useState('')
  const logo =
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.default?.url

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    const list = longformVideos(channelVideos)
    if (!query) return list
    return list.filter((v) => {
      const hay = `${v.snippet?.title || ''} ${v.snippet?.description || ''}`.toLowerCase()
      return hay.includes(query)
    })
  }, [q, channelVideos])

  return (
    <div className="py-5">
      <div className="relative max-w-xl">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa]"></i>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${channelData?.snippet?.title || 'this channel'}`}
          className="w-full bg-[#121212] border border-[#303030] rounded-full py-2.5 pl-11 pr-4 text-white outline-none focus:border-[#3ea6ff]"
        />
      </div>

      {!channelVideosReady ? (
        <p className="text-[#aaa] py-8 text-center">Loading...</p>
      ) : (
        <>
          <p className="text-[#aaa] text-sm mt-4 mb-3">
            {q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Latest from this channel'}
          </p>
          {results.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((item) => (
                <Card key={videoIdOf(item) || item.etag} item={item} channelLogo={logo} />
              ))}
            </div>
          ) : (
            <p className="text-[#aaa] py-8 text-center">No matching videos.</p>
          )}
        </>
      )}
    </div>
  )
}

export default ChannelSearch
