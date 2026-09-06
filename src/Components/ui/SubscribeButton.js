import { Link } from 'react-router-dom'
import { useAuth } from '../../Hooks/AuthContext'
import { useStudio } from '../../Hooks/StudioContext'
import { useSubscriptions } from '../../Hooks/SubscriptionsContext'

/**
 * Always visible Subscribe control.
 * Guests see the button and are prompted to sign in on click.
 */
const SubscribeButton = ({
  channelId,
  title,
  handle = '',
  avatar = '/favicon.ico',
  subscriberCount = 0,
  className = '',
  size = 'md',
}) => {
  const { isSignedIn, openSignIn } = useAuth()
  const { getMyChannel } = useStudio()
  const { isSubscribed, toggleSubscribe } = useSubscriptions()
  const subscribed = isSubscribed(channelId)
  const mine = getMyChannel()

  const sizeClass =
    size === 'sm'
      ? 'text-xs px-3 py-1.5'
      : size === 'lg'
        ? 'text-sm px-5 py-2.5'
        : 'text-sm px-4 py-2'

  if (mine && mine.id === channelId) {
    return (
      <Link
        to="/studio/channel"
        className={`inline-flex items-center justify-center font-semibold rounded-full bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f] ${sizeClass} ${className}`}
      >
        Customize channel
      </Link>
    )
  }

  const onClick = () => {
    if (!channelId) return
    if (!isSignedIn) {
      openSignIn()
      return
    }
    toggleSubscribe({
      channelId,
      title,
      handle,
      avatar,
      subscriberCount,
    })
  }

  return (
    <button
      type="button"
      disabled={!channelId}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-semibold rounded-full transition-colors ${sizeClass} ${
        subscribed
          ? 'bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f]'
          : 'bg-white text-black hover:bg-[#d9d9d9]'
      } ${className}`}
      aria-pressed={subscribed}
    >
      {subscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  )
}

export default SubscribeButton
