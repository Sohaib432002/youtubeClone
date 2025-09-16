import { useRef, useState, useEffect } from 'react'
import ChannelCard from './ChannelCard'
const ChannelCrousel = () => {
  const scrollRef = useRef(null)
  const [showLeftbtn, setShowLeftbtn] = useState(false)
  const [showRightbtn, setShowRightbtn] = useState(false)

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
    if (!el) return

    const check = () => {
      if (el.scrollWidth > el.clientWidth) {
        updateButtonVisibility()
      } else {
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
  }, [])

  return (
    <div className="relative">
      {showLeftbtn && (
        <div
          onClick={() => scrollX(-200)}
          className="left-button-crousel z-20 bg-gray-500/75 absolute -left-6 bg-gray-700 p-3 rounded-full cursor-pointer top-[100px]"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-4"
      >
        <ChannelCard />
      </div>

      {showRightbtn && (
        <div
          onClick={() => scrollX(200)}
          className="right-button-crousel z-10 bg-gray-500/75 absolute -right-2 bg-gray-700 p-3 rounded-full cursor-pointer top-[100px]"
        >
          <i className="fa-solid fa-arrow-right"></i>
        </div>
      )}
    </div>
  )
}
export default ChannelCrousel
