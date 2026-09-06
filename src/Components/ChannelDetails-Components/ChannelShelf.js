import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const ChannelShelf = ({ title, to, icon, children }) => {
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const update = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeft(el.scrollLeft > 8)
    setShowRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 8)
  }

  const scrollX = (distance) => {
    scrollRef.current?.scrollBy({ left: distance, behavior: 'smooth' })
    setTimeout(update, 280)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined
    update()
    window.addEventListener('resize', update)
    el.addEventListener('scroll', update)
    return () => {
      window.removeEventListener('resize', update)
      el.removeEventListener('scroll', update)
    }
  }, [children])

  return (
    <section className="py-5 border-b border-[#272727]">
      <div className="flex items-center justify-between mb-3 gap-3">
        {to ? (
          <Link to={to} className="flex items-center gap-2 min-w-0 group">
            {icon ? <i className={`${icon} text-white`}></i> : null}
            <h2 className="text-white text-lg font-bold truncate group-hover:underline">{title}</h2>
            <i className="fa-solid fa-chevron-right text-sm text-[#aaa]"></i>
          </Link>
        ) : (
          <h2 className="text-white text-lg font-bold flex items-center gap-2">
            {icon ? <i className={icon}></i> : null}
            {title}
          </h2>
        )}
        <div className="flex gap-2 flex-shrink-0">
          {showLeft ? (
            <button
              type="button"
              onClick={() => scrollX(-360)}
              className="w-9 h-9 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-white"
              aria-label="Scroll left"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
          ) : null}
          {showRight ? (
            <button
              type="button"
              onClick={() => scrollX(360)}
              className="w-9 h-9 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-white"
              aria-label="Scroll right"
            >
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
          ) : null}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-3 pb-1"
      >
        {children}
      </div>
    </section>
  )
}

export default ChannelShelf
