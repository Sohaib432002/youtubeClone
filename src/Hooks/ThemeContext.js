import React, { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export const CATEGORIES = [
  { id: 'All', query: 'trending' },
  { id: 'Music', query: 'music' },
  { id: 'Live', query: 'live stream' },
  { id: 'Gaming', query: 'gaming' },
  { id: 'News', query: 'news' },
  { id: 'Sports', query: 'sports' },
  { id: 'Learning', query: 'education tutorial' },
  { id: 'Fashion & Beauty', query: 'fashion beauty' },
  { id: 'Comedy', query: 'comedy funny' },
  { id: 'Technology', query: 'technology' },
  { id: 'Movies', query: 'movie trailer' },
]

export const ThemeProvider = ({ children }) => {
  const [isShowLeftbar, setisShowLeftbar] = useState(false)
  const [windowResize, setwindowResize] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )
  const [isShowScrollbar, setisShowScrollbar] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const onResize = () => setwindowResize(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleLeftbar = () => {
    setisShowLeftbar((prev) => !prev)
  }

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
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
