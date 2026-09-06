import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { getPlaylistVideos, videoIdOf } from '../../utils/youtubeApi'
import { formatViews } from '../../utils/format'
import Card from '../Home-components/Card'

const ChannelPlaylistVideos = () => {
  const { channelId, playlistId } = useParams()
  const { channelPlaylists = [], channelData } = useOutletContext() || {}
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const playlist = (channelPlaylists || []).find((p) => p.id === playlistId)
  const logo =
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.default?.url

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      if (playlist?._videos?.length) {
        if (!cancelled) {
          setItems(playlist._videos)
          setLoading(false)
        }
        return
      }
      const data = await getPlaylistVideos(playlistId, 40)
      if (!cancelled) {
        setItems(data.items || [])
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [playlistId, playlist])

  const title = playlist?.snippet?.title || 'Playlist'
  const count = playlist?.contentDetails?.itemCount ?? items.length
  const base = channelId ? `/channel/${channelId}` : '/CD'

  return (
    <div className="py-5 text-white">
      <Link to={`${base}/Playlist`} className="text-sm text-[#3ea6ff] hover:underline">
        ← Playlists
      </Link>
      <h1 className="text-2xl font-bold mt-3">{title}</h1>
      <p className="text-sm text-[#aaa] mt-1">
        {formatViews(count)} {count === 1 ? 'video' : 'videos'}
        {playlist?.snippet?.channelTitle ? ` • ${playlist.snippet.channelTitle}` : ''}
      </p>
      {playlist?.snippet?.description ? (
        <p className="text-sm text-[#aaa] mt-2 max-w-3xl line-clamp-3">
          {playlist.snippet.description}
        </p>
      ) : null}

      {loading ? (
        <p className="text-[#aaa] py-8 text-center">Loading playlist...</p>
      ) : !items.length ? (
        <p className="text-[#aaa] py-8 text-center">This playlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {items.map((item) => (
            <Card key={videoIdOf(item) || item.etag} item={item} channelLogo={logo} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ChannelPlaylistVideos
