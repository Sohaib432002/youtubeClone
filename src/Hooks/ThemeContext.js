import React, { createContext, useEffect, useState } from 'react'
import { CATEGORY_LIST } from '../data/mockCatalog'

export const ThemeContext = createContext()

/** Desktop/large: expanded sidebar always open */
export const DESKTOP_SIDEBAR_MIN = 1024

export const CATEGORIES = CATEGORY_LIST.map((id) => ({
  id,
  query: id === 'All' ? 'trending' : id.toLowerCase(),
}))

export const ThemeProvider = ({ children }) => {
  const getWidth = () =>
    typeof window !== 'undefined' ? window.innerWidth : 1280

  const [windowResize, setwindowResize] = useState(getWidth)
  const [isShowLeftbar, setisShowLeftbar] = useState(
    () => getWidth() >= DESKTOP_SIDEBAR_MIN
  )
  const [isShowScrollbar, setisShowScrollbar] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [miniSidebar, setMiniSidebar] = useState(false)

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setwindowResize(w)
      // Desktop: force expanded. Tablet/mobile: collapse drawer.
      if (w >= DESKTOP_SIDEBAR_MIN) {
        setisShowLeftbar(true)
        setMiniSidebar(false)
      } else {
        setisShowLeftbar(false)
      }
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleLeftbar = () => {
    // On desktop the sidebar stays open — hamburger only for smaller screens
    if (windowResize >= DESKTOP_SIDEBAR_MIN) return
    setisShowLeftbar((prev) => !prev)
  }

  const categoryQuery =
    CATEGORIES.find((c) => c.id === activeCategory)?.query || 'trending'

  const isDesktopSidebar = windowResize >= DESKTOP_SIDEBAR_MIN

  return (
    <ThemeContext.Provider
      value={{
        isShowLeftbar,
        toggleLeftbar,
        setisShowLeftbar,
        windowResize,
        isShowScrollbar,
        setisShowScrollbar,
        activeCategory,
        setActiveCategory,
        categoryQuery,
        categories: CATEGORIES,
        miniSidebar,
        setMiniSidebar,
        isDesktopSidebar,
        desktopSidebarMin: DESKTOP_SIDEBAR_MIN,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
