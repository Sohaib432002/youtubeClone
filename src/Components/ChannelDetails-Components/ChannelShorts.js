import { useOutletContext } from 'react-router-dom'
import { itemVideoId } from '../../utils/channelContent'
import { ShelfShortCard } from './PlaylistCard'

const ChannelShorts = () => {
  const { channelShorts = [], extrasReady = true } = useOutletContext() || {}

  if (!extrasReady) {
    return <p className="text-[#AAAAAA] py-8 text-center">Loading Shorts...</p>
  }

  if (!channelShorts.length) {
    return (
      <div className="text-center py-12 text-white">
        <i className="fa-solid fa-bolt text-3xl text-[#555] mb-3"></i>
        <p className="mb-1">No Shorts yet</p>
        <p className="text-sm text-[#aaa]">Shorts from this channel will appear here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 py-5">
      {channelShorts.map((item) => (
        <div key={itemVideoId(item) || item.etag} className="min-w-0">
          <ShelfShortCard item={item} fill />
        </div>
      ))}
    </div>
  )
}

export default ChannelShorts
