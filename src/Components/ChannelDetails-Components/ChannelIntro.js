import { useState } from 'react'

const ChannelIntro = ({ channelData }) => {
  const [more, setmore] = useState(false)
  function formatNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
  }
  return (
    <>
      <div className="flex  flex-wrap my-[50px] ">
        <div className="flex  channelintroDetails">
          <div className="w-[200px] channelintroDetailsImg h-[200px] rounded-full overflow-hidden flex justify-center ">
            <img
              src={channelData.brandingSettings.image.bannerExternalUrl}
              alt="channelPic"
              className="rounded-full"
            />
          </div>
          <div className="flex mx-4 flex-col channelIntro text-white">
            <div className="title text-[37px] font-sans font-extrabold ">
              {channelData.brandingSettings.channel.title}
            </div>
            <p>
              {channelData.snippet.customUrl}
              <span className="text-gray-400">
                • &nbsp;{formatNumber(channelData.statistics.subscriberCount)}{' '}
                &nbsp;subscribers&nbsp;•&nbsp;
                {formatNumber(channelData.statistics.videoCount)} videos
              </span>
            </p>
            <p className="descipriton text-gray-400 ">
              {channelData.snippet.description.length > 50
                ? channelData.snippet.description.slice(0, 50) + '....'
                : channelData.snippet.description}
              <span className="opacity-[0.4] "> </span>
              <span
                className="text-white font-bold cursor-pointer "
                onClick={() => {
                  setmore(true)
                }}
              >
                showmore
              </span>
              {more ? (
                <>
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40">
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  max-w-[400px] w-full p-6
                  bg-gray-800 text-white rounded-xl shadow-lg z-50"
                    >
                      <div>
                        <h1 className="text-[20px] my-4 font-extrabold ">
                          {channelData.brandingSettings.channel.title}
                        </h1>
                        <hr />
                        <p className="text-[16px] my-2">{channelData.snippet.description}</p>
                        <div>
                          <button onClick={() => setmore(false)}>CLose</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
              <div className="my-3 btn-subscribe-pc  justify-start">
                <div className="px-4 font-sans py-2 bg-slate-50 text-black bold hover:bg-slate-300 rounded-full cursor-pointer ">
                  <p>Subscribe</p>
                </div>
              </div>
            </p>
          </div>
        </div>
        <div className="my-3 btn-subscribe-mobile   ">
          <div className="px-4 font-sans py-2 bg-slate-50 text-black bold hover:bg-slate-300 rounded-full cursor-pointer ">
            <p>Subscribe</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChannelIntro
