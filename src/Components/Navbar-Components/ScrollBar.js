import { useContext, useEffect, useRef } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'

const ScrollBar = ({ leftBar }) => {
  const { activeCategory, setActiveCategory, categories, isDesktopSidebar } =
    useContext(ThemeContext)
  const scrollerRef = useRef(null)

  useEffect(() => {
    const el = scrollerRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeCategory])

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' })
  }

  const pad = isDesktopSidebar || leftBar ? 'lg:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`relative h-12 flex items-center ${pad} pr-2`}>
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => scrollBy(-1)}
        className="hidden sm:flex absolute left-1 z-[2] h-8 w-8 items-center justify-center rounded-full bg-[#0f0f0f] text-white hover:bg-[#272727] border border-[#272727]"
      >
        <i className="fa-solid fa-chevron-left text-xs"></i>
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-8 sm:px-10 py-1 w-full"
      >
        {categories.map((chip) => {
          const active = activeCategory === chip.id
          return (
            <button
              key={chip.id}
              type="button"
              data-active={active ? 'true' : 'false'}
              onClick={() => setActiveCategory(chip.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-white text-[#0f0f0f]'
                  : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f]'
              }`}
            >
              {chip.id}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        aria-label="Next categories"
        onClick={() => scrollBy(1)}
        className="hidden sm:flex absolute right-1 z-[2] h-8 w-8 items-center justify-center rounded-full bg-[#0f0f0f] text-white hover:bg-[#272727] border border-[#272727]"
      >
        <i className="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
  )
}

export default ScrollBar
