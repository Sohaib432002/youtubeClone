import React, { createContext, useCallback, useEffect, useState } from 'react'
import { CATEGORY_LIST } from '../data/mockCatalog'

export const ThemeContext = createContext()

/** Desktop/large: expanded sidebar always open (except watch pages) */
export const DESKTOP_SIDEBAR_MIN = 1024
export const SIDEBAR_WIDTH = 240
export const MINI_SIDEBAR_WIDTH = 72

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
  /** Watch/player pages use mini guide + optional overlay (YouTube-like) */
  const [watchMode, setWatchMode] = useState(false)

  const isDesktopSidebar = windowResize >= DESKTOP_SIDEBAR_MIN

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setwindowResize(w)
      if (w >= DESKTOP_SIDEBAR_MIN) {
        // Home-style pages keep expanded; watch pages keep mini unless user opened overlay
        setisShowLeftbar((prev) => (watchMode ? prev : true))
        setMiniSidebar(false)
      } else {
        setisShowLeftbar(false)
      }
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [watchMode])

  // Entering watch mode: collapse to mini guide on desktop
  useEffect(() => {
    if (watchMode) {
      if (windowResize >= DESKTOP_SIDEBAR_MIN) setisShowLeftbar(false)
    } else if (windowResize >= DESKTOP_SIDEBAR_MIN) {
      setisShowLeftbar(true)
    }
  }, [watchMode, windowResize])

  const toggleLeftbar = useCallback(() => {
    // Desktop home: sidebar stays expanded (hamburger no-op)
    if (windowResize >= DESKTOP_SIDEBAR_MIN && !watchMode) return
    setisShowLeftbar((prev) => !prev)
  }, [watchMode, windowResize])

  const categoryQuery =
    CATEGORIES.find((c) => c.id === activeCategory)?.query || 'trending'

  /**
   * Content offset for fixed sidebars:
   * - Desktop watch + overlay closed → mini 72px
   * - Desktop watch + overlay open → still 72px (overlay does not push)
   * - Desktop home → 240px
   * - Mobile → 0 (overlay only)
   */
  const contentOffsetPx = !isDesktopSidebar
    ? 0
    : watchMode
      ? MINI_SIDEBAR_WIDTH
      : SIDEBAR_WIDTH

  const showMiniGuide = isDesktopSidebar && watchMode
  const showExpandedDrawer =
    (!isDesktopSidebar && isShowLeftbar) ||
    (isDesktopSidebar && watchMode && isShowLeftbar) ||
    (isDesktopSidebar && !watchMode)

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
        watchMode,
        setWatchMode,
        contentOffsetPx,
        showMiniGuide,
        showExpandedDrawer,
        sidebarWidth: SIDEBAR_WIDTH,
        miniSidebarWidth: MINI_SIDEBAR_WIDTH,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
