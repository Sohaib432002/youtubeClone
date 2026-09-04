import { useContext, useEffect, useRef } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'

const ScrollBar = ({ leftBar, OptionsList }) => {
  const { activeCategory, setActiveCategory, categories, isShowLeftbar } =
    useContext(ThemeContext)
  const scrollerRef = useRef(null)

  const chips =
    OptionsList?.length > 0
      ? OptionsList.map((label) => ({
          id: String(label).replace(/&amp;/g, '&'),
          query: String(label),
        }))
      : categories

  useEffect(() => {
    // ensure active chip is visible when category changes externally
    const el = scrollerRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeCategory])

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  const pad = isShowLeftbar || leftBar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`relative h-12 flex items-center ${pad}`}>
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => scrollBy(-1)}
        className="hidden sm:flex absolute left-0 z-[2] h-8 w-8 items-center justify-center rounded-full bg-[#0F0F0F] text-white hover:bg-[#272727]"
      >
        <i className="fa-solid fa-chevron-left text-xs"></i>
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-8 sm:px-10 py-1 w-full"
      >
        {chips.map((chip) => {
          const id = chip.id || chip
          const active = activeCategory === id
          return (
            <button
              key={id}
              type="button"
              data-active={active ? 'true' : 'false'}
              onClick={() => setActiveCategory(id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white text-[#0F0F0F]'
                  : 'bg-[#272727] text-[#F1F1F1] hover:bg-[#3F3F3F]'
              }`}
            >
              {id}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => scrollBy(1)}
        className="hidden sm:flex absolute right-0 z-[2] h-8 w-8 items-center justify-center rounded-full bg-[#0F0F0F] text-white hover:bg-[#272727]"
      >
        <i className="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
  )
}

export default ScrollBar
