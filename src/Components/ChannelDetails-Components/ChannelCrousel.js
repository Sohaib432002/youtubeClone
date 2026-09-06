import { useRef, useState, useEffect } from 'react'
import ChannelCard from './ChannelCard'
import { CHANNELS } from '../../data/mockCatalog'

/**
 * Horizontal list of channels.
 * Pass `channels` to show a channel's subscriptions / featured follows.
 */
const ChannelCrousel = ({ excludeChannelId, channels: channelsProp } = {}) => {
  const scrollRef = useRef(null)
  const [showLeftbtn, setShowLeftbtn] = useState(false)
  const [showRightbtn, setShowRightbtn] = useState(false)
  const channels = (channelsProp?.length
    ? channelsProp
    : CHANNELS.filter((c) => c.id !== excludeChannelId).slice(0, 8)
  ).filter((c) => c && c.id !== excludeChannelId)

  const updateButtonVisibility = () => {
    const el = scrollRef.current
    if (!el) return
    const scrollLeft = el.scrollLeft
    const scrollRight = el.scrollWidth - el.clientWidth - scrollLeft
    setShowLeftbtn(scrollLeft > 0)
    setShowRightbtn(scrollRight > 1)
  }

  const scrollX = (distance) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: distance, behavior: 'smooth' })
    setTimeout(updateButtonVisibility, 300)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined
    const check = () => {
      if (el.scrollWidth > el.clientWidth) updateButtonVisibility()
      else {
        setShowLeftbtn(false)
        setShowRightbtn(false)
      }
    }
    check()
    window.addEventListener('resize', check)
    el.addEventListener('scroll', updateButtonVisibility)
    return () => {
      window.removeEventListener('resize', check)
      el.removeEventListener('scroll', updateButtonVisibility)
    }
  }, [channels.length])

  if (!channels.length) {
    return (
      <p className="text-[#aaa] text-sm py-4">
        No subscribed channels to show yet.
      </p>
    )
  }

  return (
    <div className="relative">
      {showLeftbtn ? (
        <button
          type="button"
          onClick={() => scrollX(-240)}
          className="left-button-crousel z-20 absolute -left-2 bg-[#272727] hover:bg-[#3f3f3f] p-3 rounded-full cursor-pointer top-[70px] text-white"
          aria-label="Scroll left"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      ) : null}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-2"
      >
        {channels.map((ch) => (
          <div key={ch.id || ch.channelId} className="flex-shrink-0 w-[160px]">
            <ChannelCard
              channelId={ch.id || ch.channelId}
              title={ch.title}
              avatar={ch.avatar}
              handle={ch.handle}
              subscriberCount={ch.subscribers || ch.subscriberCount}
            />
          </div>
        ))}
      </div>

      {showRightbtn ? (
        <button
          type="button"
          onClick={() => scrollX(240)}
          className="right-button-crousel z-10 absolute -right-2 bg-[#272727] hover:bg-[#3f3f3f] p-3 rounded-full cursor-pointer top-[70px] text-white"
          aria-label="Scroll right"
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      ) : null}
    </div>
  )
}

export default ChannelCrousel
