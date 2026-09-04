import { useSubscriptions } from '../../Hooks/SubscriptionsContext'

/**
 * Channel-specific subscribe control.
 * Props: channelId, title, handle?, avatar?, subscriberCount? (base for new channels)
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
  const { isSubscribed, toggleSubscribe } = useSubscriptions()
  const subscribed = isSubscribed(channelId)

  const sizeClass =
    size === 'sm'
      ? 'text-xs px-3 py-1.5'
      : size === 'lg'
        ? 'text-sm px-5 py-2.5'
        : 'text-sm px-4 py-2'

  return (
    <button
      type="button"
      disabled={!channelId}
      onClick={() =>
        toggleSubscribe({
          channelId,
          title,
          handle,
          avatar,
          subscriberCount,
        })
      }
      className={`font-semibold rounded-full transition-colors ${sizeClass} ${
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
