import { useOutletContext, useParams } from 'react-router-dom'
import { PlaylistCard } from './PlaylistCard'

const Playlist = () => {
  const { channelId } = useParams()
  const { channelPlaylists = [], extrasReady = true, channelData } =
    useOutletContext() || {}

  if (!extrasReady) {
    return <p className="text-[#AAAAAA] py-8 text-center">Loading playlists...</p>
  }

  if (!channelPlaylists.length) {
    return (
      <div className="text-center py-12 text-white">
        <i className="fa-solid fa-list text-3xl text-[#555] mb-3"></i>
        <p className="mb-1">This channel has no playlists yet</p>
        <p className="text-sm text-[#aaa]">Playlists created by this channel will show up here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-5">
      {channelPlaylists.map((pl) => (
        <PlaylistCard
          key={pl.id}
          playlist={pl}
          channelId={channelId || channelData?.id}
        />
      ))}
    </div>
  )
}

export default Playlist
