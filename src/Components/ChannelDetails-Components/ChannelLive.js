import { useOutletContext } from 'react-router-dom'
import { itemVideoId } from '../../utils/channelContent'
import Card from '../Home-components/Card'

const ChannelLive = () => {
  const { channelLive = [], extrasReady = true, channelData } = useOutletContext() || {}
  const logo =
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.default?.url

  if (!extrasReady) {
    return <p className="text-[#AAAAAA] py-8 text-center">Loading live streams...</p>
  }

  if (!channelLive.length) {
    return (
      <div className="text-center py-12 text-white">
        <i className="fa-solid fa-tower-broadcast text-3xl text-[#555] mb-3"></i>
        <p className="mb-1">No live streams</p>
        <p className="text-sm text-[#aaa]">Live and past livestreams from this channel will show here.</p>
      </div>
    )
  }

  const liveNow = channelLive.filter((v) => v.liveStatus === 'live')
  const upcoming = channelLive.filter((v) => v.liveStatus === 'upcoming')
  const past = channelLive.filter((v) => v.liveStatus !== 'live' && v.liveStatus !== 'upcoming')

  const Section = ({ title, items }) => {
    if (!items.length) return null
    return (
      <section className="py-4">
        <h2 className="text-white text-lg font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card
              key={itemVideoId(item) || item.etag}
              item={item}
              channelLogo={logo}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="py-4">
      <Section title="Live now" items={liveNow} />
      <Section title="Upcoming" items={upcoming} />
      <Section title="Past livestreams" items={past} />
    </div>
  )
}

export default ChannelLive
