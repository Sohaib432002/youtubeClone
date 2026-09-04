import React, { createContext, useEffect, useState } from 'react'
import { CATEGORY_LIST } from '../data/mockCatalog'

export const ThemeContext = createContext()

export const CATEGORIES = CATEGORY_LIST.map((id) => ({
  id,
  query: id === 'All' ? 'trending' : id.toLowerCase(),
}))

export const ThemeProvider = ({ children }) => {
  const [isShowLeftbar, setisShowLeftbar] = useState(false)
  const [windowResize, setwindowResize] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )
  const [isShowScrollbar, setisShowScrollbar] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [miniSidebar, setMiniSidebar] = useState(true)

  useEffect(() => {
    const onResize = () => setwindowResize(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleLeftbar = () => setisShowLeftbar((prev) => !prev)

  const categoryQuery =
    CATEGORIES.find((c) => c.id === activeCategory)?.query || 'trending'

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
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
