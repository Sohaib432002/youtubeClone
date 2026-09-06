import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useAuth } from '../../Hooks/AuthContext'
import { useSubscriptions } from '../../Hooks/SubscriptionsContext'
import { formatViews } from '../../utils/format'
import SubscribeButton from '../ui/SubscribeButton'

const Subscriptions = () => {
  const { isSignedIn, openSignIn } = useAuth()
  const { subscriptions, getSubscriberCount } = useSubscriptions()
  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-4 ${leftPad} text-white max-w-5xl`}>
      <h1 className="text-2xl font-semibold mb-2">Subscriptions</h1>
      <p className="text-sm text-[#aaa] mb-6">
        Channels you subscribe to — each with its own subscriber relationship.
      </p>

      {!isSignedIn ? (
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <i className="fa-solid fa-play text-4xl mb-3 text-[#555]"></i>
          <p className="text-white text-lg mb-1">Sign in to see subscriptions</p>
          <p className="text-sm text-[#aaa] mb-4">
            Subscribe to channels from any video or channel page.
          </p>
          <button
            type="button"
            onClick={openSignIn}
            className="inline-flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#3ea6ff]/10"
          >
            <i className="fa-regular fa-circle-user"></i>
            Sign in
          </button>
        </div>
      ) : !subscriptions.length ? (
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <i className="fa-solid fa-bell text-4xl mb-3 text-[#555]"></i>
          <p className="text-white text-lg mb-1">No subscriptions yet</p>
          <p className="text-sm text-[#aaa]">Channels you subscribe to will appear here.</p>
          <Link to="/" className="inline-block mt-4 text-[#3ea6ff] text-sm hover:underline">
            Browse videos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subscriptions.map((ch) => (
            <div
              key={ch.channelId}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#181818] border border-[#272727] hover:bg-[#1f1f1f]"
            >
              <Link to={`/channel/${ch.channelId}`} className="flex-shrink-0">
                <img
                  src={ch.avatar || '/favicon.ico'}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover bg-[#272727]"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/channel/${ch.channelId}`}
                  className="text-sm font-medium truncate block hover:underline"
                >
                  {ch.title}
                </Link>
                <p className="text-xs text-[#aaa] mt-0.5 truncate">
                  {ch.handle || ''}
                  {ch.handle ? ' • ' : ''}
                  {formatViews(getSubscriberCount(ch.channelId))} subscribers
                </p>
                <div className="mt-2">
                  <SubscribeButton
                    channelId={ch.channelId}
                    title={ch.title}
                    handle={ch.handle}
                    avatar={ch.avatar}
                    subscriberCount={0}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Subscriptions
