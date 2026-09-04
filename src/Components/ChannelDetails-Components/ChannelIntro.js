import { useState } from 'react'
import { formatViews } from '../../utils/format'
import { useSubscriptions } from '../../Hooks/SubscriptionsContext'
import SubscribeButton from '../ui/SubscribeButton'

const ChannelIntro = ({ channelData, ChannelPic }) => {
  const [more, setmore] = useState(false)
  const { getSubscriberCount } = useSubscriptions()

  const channelId = channelData?.id
  const title =
    channelData?.snippet?.title || channelData?.brandingSettings?.channel?.title || 'Channel'
  const description = channelData?.snippet?.description || ''
  const logo =
    ChannelPic ||
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.default?.url ||
    '/favicon.ico'

  const subscriberCount = getSubscriberCount(
    channelId,
    channelData?.statistics?.subscriberCount
  )
  const videoCount = channelData?.statistics?.videoCount

  return (
    <div className="flex flex-wrap my-6 sm:my-10 gap-4 items-start">
      <div className="w-[96px] h-[96px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden flex-shrink-0 bg-[#272727] ring-1 ring-[#272727]">
        <img src={logo} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col channelIntro text-white min-w-0 flex-1">
        <h1 className="title text-2xl sm:text-[36px] font-extrabold break-words leading-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base mt-1 text-[#aaa]">
          <span className="text-[#f1f1f1]">{channelData?.snippet?.customUrl || ''}</span>
          {channelData?.snippet?.customUrl ? ' • ' : ''}
          {formatViews(subscriberCount)} subscribers
          {videoCount != null ? ` • ${formatViews(videoCount)} videos` : ''}
        </p>
        <p className="description text-[#aaa] text-sm mt-2 max-w-2xl leading-relaxed">
          {description.length > 120 ? description.slice(0, 120) + '...' : description}
          {description.length > 120 ? (
            <button
              type="button"
              className="text-white font-semibold cursor-pointer ml-1 hover:underline"
              onClick={() => setmore(true)}
            >
              more
            </button>
          ) : null}
        </p>
        <div className="my-3">
          <SubscribeButton
            channelId={channelId}
            title={title}
            handle={channelData?.snippet?.customUrl}
            avatar={logo}
            subscriberCount={subscriberCount}
            size="lg"
          />
        </div>
      </div>

      {more ? (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setmore(false)}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[480px] w-[92%] p-6 bg-[#212121] text-white rounded-xl shadow-2xl z-50 border border-[#3f3f3f]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-3">{title}</h2>
            <hr className="border-[#3f3f3f]" />
            <p className="text-sm my-3 whitespace-pre-wrap max-h-[50vh] overflow-y-auto text-[#ddd]">
              {description}
            </p>
            <button
              type="button"
              onClick={() => setmore(false)}
              className="text-[#3ea6ff] font-medium hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ChannelIntro
