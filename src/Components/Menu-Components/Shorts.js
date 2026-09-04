import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useWatchHistory } from '../../Hooks/HistoryContext'
import { getChannelLogoMap, searchShorts } from '../../utils/youtubeApi'

const Shorts = () => {
  const [items, setItems] = useState([])
  const [logoMap, setLogoMap] = useState({})
  const [nextPageToken, setNextPageToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)
  const { addToHistory } = useWatchHistory()
  const sentinelRef = useRef(null)
  const loadingMoreRef = useRef(false)

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      const data = await searchShorts(12)
      if (cancelled) return
      setItems(data?.items || [])
      setNextPageToken(data?.nextPageToken || '')
      const ids = (data?.items || []).map((v) => v.snippet?.channelId)
      const map = await getChannelLogoMap(ids)
      if (!cancelled) setLogoMap(map)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!nextPageToken || loadingMoreRef.current) return
    loadingMoreRef.current = true
    setLoadingMore(true)
    try {
      const data = await searchShorts(12, nextPageToken)
      const newItems = data?.items || []
      setItems((prev) => [...prev, ...newItems])
      setNextPageToken(data?.nextPageToken || '')
      const map = await getChannelLogoMap(newItems.map((v) => v.snippet?.channelId))
      setLogoMap((prev) => ({ ...prev, ...map }))
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }, [nextPageToken])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '300px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadMore, items.length])

  const leftPad =
    isShowLeftbar && windowResize >= 1200 ? 'md:ml-[15rem]' : 'md:ml-[5rem]'

  if (loading) {
    return (
      <div className={`pt-[90px] pb-20 ${leftPad} flex justify-center text-[#AAAAAA]`}>
        Loading Shorts...
      </div>
    )
  }

  return (
    <div className={`pt-[80px] pb-20 px-3 ${leftPad} min-h-screen`}>
      <h1 className="text-white text-xl font-semibold mb-4 px-1">Shorts</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {items.map((item) => {
          const id = item.id?.videoId
          if (!id) return null
          const thumb =
            item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.high?.url
          const logo = logoMap[item.snippet?.channelId] || '/favicon.ico'
          return (
            <Link
              key={id}
              to={`/Video/${id}`}
              onClick={() =>
                addToHistory({
                  videoId: id,
                  title: item.snippet?.title,
                  thumbnail: thumb,
                  channelTitle: item.snippet?.channelTitle,
                  channelId: item.snippet?.channelId,
                  channelLogo: logo,
                })
              }
              className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-[#272727]"
            >
              <img src={thumb} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs sm:text-sm line-clamp-2 font-medium">
                  {item.snippet?.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <img src={logo} alt="" className="w-5 h-5 rounded-full" />
                  <span className="text-[#CCCCCC] text-[10px] sm:text-xs truncate">
                    {item.snippet?.channelTitle}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-4">
        {loadingMore ? <p className="text-[#AAAAAA] text-sm">Loading more Shorts...</p> : null}
      </div>
    </div>
  )
}

export default Shorts
