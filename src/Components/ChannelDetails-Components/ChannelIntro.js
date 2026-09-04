import { useState } from 'react'

const ChannelIntro = ({ channelData, ChannelPic }) => {
  const [more, setmore] = useState(false)

  function formatNumber(num) {
    if (!num) return '0'
    const n = Number(num)
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return String(n)
  }

  const title =
    channelData?.snippet?.title || channelData?.brandingSettings?.channel?.title || 'Channel'
  const description = channelData?.snippet?.description || ''
  const logo =
    ChannelPic ||
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.default?.url ||
    '/favicon.ico'

  return (
    <div className="flex flex-wrap my-6 sm:my-10 gap-4 items-start">
      <div className="w-[96px] h-[96px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden flex-shrink-0 bg-[#272727]">
        <img src={logo} alt="channel" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col channelIntro text-white min-w-0 flex-1">
        <h1 className="title text-2xl sm:text-[36px] font-extrabold break-words">{title}</h1>
        <p className="text-sm sm:text-base mt-1">
          {channelData?.snippet?.customUrl || ''}
          <span className="text-gray-400">
            {' '}
            • {formatNumber(channelData?.statistics?.subscriberCount)} subscribers •{' '}
            {formatNumber(channelData?.statistics?.videoCount)} videos
          </span>
        </p>
        <p className="description text-gray-400 text-sm mt-2 max-w-2xl">
          {description.length > 80 ? description.slice(0, 80) + '...' : description}
          {description.length > 80 ? (
            <span
              className="text-white font-bold cursor-pointer ml-1"
              onClick={() => setmore(true)}
            >
              more
            </span>
          ) : null}
        </p>
        <div className="my-3">
          <button
            type="button"
            className="px-4 font-sans py-2 bg-slate-50 text-black font-semibold hover:bg-slate-300 rounded-full"
          >
            Subscribe
          </button>
        </div>
      </div>

      {more ? (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setmore(false)}>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[480px] w-[92%] p-6 bg-[#212121] text-white rounded-xl shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-3">{title}</h2>
            <hr className="border-[#3f3f3f]" />
            <p className="text-sm my-3 whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
              {description}
            </p>
            <button
              type="button"
              onClick={() => setmore(false)}
              className="text-[#3ea6ff] font-medium"
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
