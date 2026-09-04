import { Link } from 'react-router-dom'
import { formatViews } from '../../utils/format'
import { useSubscriptions } from '../../Hooks/SubscriptionsContext'
import SubscribeButton from '../ui/SubscribeButton'

/** Related / other-channel card with channel-specific subscribe count */
const ChannelCard = ({
  channelId,
  title = 'Channel',
  avatar,
  handle = '',
  subscriberCount,
}) => {
  const { getSubscriberCount } = useSubscriptions()
  const count = getSubscriberCount(channelId, subscriberCount)
  const logo = avatar || '/favicon.ico'
  const to = channelId ? `/channel/${channelId}` : '#'

  return (
    <div className="flex flex-col items-center text-center px-4 py-3">
      <Link to={to} className="block">
        <img
          src={logo}
          className="rounded-full w-[88px] h-[88px] object-cover bg-[#272727]"
          alt=""
        />
      </Link>
      <Link to={to} className="mt-3 text-[14px] text-white font-medium line-clamp-2 hover:underline">
        {title}
      </Link>
      <span className="text-[12px] text-[#aaa] mt-1">{formatViews(count)} subscribers</span>
      <div className="mt-3">
        <SubscribeButton
          channelId={channelId}
          title={title}
          handle={handle}
          avatar={logo}
          subscriberCount={count}
          size="sm"
        />
      </div>
    </div>
  )
}

export default ChannelCard
