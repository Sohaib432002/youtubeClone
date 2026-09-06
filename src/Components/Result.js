import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'
import { searchCatalog } from '../data/mockCatalog'
import { searchVideos, searchShorts, videoIdOf, dedupeByVideoId } from '../utils/youtubeApi'
import { isShortLikeItem } from '../utils/feed'
import Card from './Home-components/Card'
import ShortsRail from './ui/ShortsRail'
import ShowMoreButton from './ui/ShowMoreButton'
import { formatViews, timeAgo } from '../utils/format'

function safeDecode(value = '') {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const PRE_SHORTS = 5

const Result = () => {
  const params = useParams()
  const query = safeDecode(params.text || '').trim()
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
  const [items, setItems] = useState([])
  const [shorts, setShorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [usedFallback, setUsedFallback] = useState(false)
  const [nextPageToken, setNextPageToken] = useState('')
  const loadingMoreRef = useRef(false)
  const queryRef = useRef(query)
  const tokenRef = useRef('')

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  useEffect(() => {
    queryRef.current = query
  }, [query])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      setUsedFallback(false)
      setItems([])
      setShorts([])
      setNextPageToken('')
      tokenRef.current = ''

      if (!query) {
        if (!cancelled) {
          setItems([])
          setLoading(false)
        }
        return
      }

      let list = []
      let liveFailed = false
      let apiError = ''
      try {
        const live = await searchVideos(query, 24, { order: 'relevance' })
        if (cancelled || queryRef.current !== query) return
        list = dedupeByVideoId(live?.items || []).filter((it) => !isShortLikeItem(it))
        tokenRef.current = live?.nextPageToken || ''
        setNextPageToken(tokenRef.current)
        if (!list.length && (live?.apiError || live?.source === 'none')) {
          liveFailed = true
          apiError = live?.apiError || ''
        }
      } catch (_) {
        liveFailed = true
      }

      if (!list.length) {
        const local = searchCatalog(query, 'All')
        list = dedupeByVideoId(local.items || []).filter((it) => !isShortLikeItem(it))
        if (list.length) {
          if (!cancelled) setUsedFallback(true)
        } else if (liveFailed && !cancelled) {
          setError(
            apiError === 'quotaExceeded'
              ? 'YouTube search quota is used up. Try again later.'
              : 'Search could not reach YouTube. Try again in a moment.'
          )
        }
        tokenRef.current = ''
        setNextPageToken('')
      }

      const excludeIds = list.map((it) => videoIdOf(it)).filter(Boolean)
      let shortItems = []
      try {
        const related = await searchShorts(query, 16, { excludeIds })
        shortItems = (related?.items || []).filter((it) => !excludeIds.includes(videoIdOf(it)))
      } catch (_) {
        shortItems = []
      }

      if (!cancelled && queryRef.current === query) {
        setItems(list)
        setShorts(shortItems)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [query])

  const loadMore = async () => {
    if (loadingMoreRef.current || !tokenRef.current || !query) return
    loadingMoreRef.current = true
    setLoadingMore(true)
    const forQuery = query
    try {
      const more = await searchVideos(forQuery, 24, {
        order: 'relevance',
        pageToken: tokenRef.current,
      })
      if (queryRef.current !== forQuery) return
      const extra = dedupeByVideoId(more?.items || []).filter((it) => !isShortLikeItem(it))
      const shortIds = new Set(shorts.map((s) => videoIdOf(s)))
      setItems((prev) => {
        const seen = new Set(prev.map((v) => videoIdOf(v)))
        return [
          ...prev,
          ...extra.filter((v) => {
            const id = videoIdOf(v)
            return id && !seen.has(id) && !shortIds.has(id)
          }),
        ]
      })
      tokenRef.current = more?.nextPageToken || ''
      setNextPageToken(tokenRef.current)
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  const topVideos = items.slice(0, PRE_SHORTS)
  const restVideos = items.slice(PRE_SHORTS)

  const renderRow = (item, idx) => {
    const vid = videoIdOf(item)
    return (
      <div key={`${vid || idx}-${idx}`} className="sm:max-w-none">
        <div className="hidden sm:block">
          <ResultRow item={item} />
        </div>
        <div className="sm:hidden">
          <Card item={item} channelLogo={item.meta?.channelAvatar} />
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen pt-[100px] pb-24 px-3 sm:px-6 ${leftPad} overflow-x-hidden`}>
      <h1 className="text-white text-base sm:text-lg mb-2 break-words">
        Results for <span className="font-semibold">&quot;{query}&quot;</span>
      </h1>
      {usedFallback ? (
        <p className="text-xs text-[#aaa] mb-3">Showing catalog results (live search unavailable).</p>
      ) : null}
      {error ? <p className="text-sm text-amber-400 mb-3">{error}</p> : null}

      {loading ? (
        <div className="flex flex-col gap-4 max-w-5xl animate-pulse" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-40 sm:w-[360px] aspect-video rounded-xl bg-[#272727] flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-[#272727] rounded w-4/5" />
                <div className="h-3 bg-[#272727] rounded w-1/3" />
                <div className="h-3 bg-[#272727] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !items.length && !shorts.length ? (
        <div className="text-center py-20 text-[#aaa]">
          <i className="fa-solid fa-magnifying-glass text-4xl mb-3 opacity-40"></i>
          <p className="text-white text-lg mb-1">No results found</p>
          <p className="text-sm">Try different keywords or another category.</p>
          <Link to="/" className="inline-block mt-4 text-[#3ea6ff] text-sm hover:underline">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-5xl">
          <p className="text-xs text-[#aaa]">
            {items.length} video{items.length === 1 ? '' : 's'}
            {shorts.length ? ` • ${shorts.length} Shorts` : ''}
          </p>
          {topVideos.map((item, idx) => renderRow(item, idx))}
          {shorts.length ? (
            <ShortsRail
              title={`Shorts for “${query}”`}
              items={shorts}
              query={query}
            />
          ) : null}
          {restVideos.map((item, idx) => renderRow(item, idx + PRE_SHORTS))}
          {nextPageToken ? (
            <ShowMoreButton onClick={loadMore} loading={loadingMore} label="Show more" />
          ) : null}
        </div>
      )}
    </div>
  )
}

const ResultRow = ({ item }) => {
  const videoId = videoIdOf(item)
  const channelId = item.snippet?.channelId
  const thumb =
    item.snippet?.thumbnails?.medium?.url ||
    item.snippet?.thumbnails?.high?.url ||
    (videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : '')
  const views = item.meta?.views ?? item.statistics?.viewCount
  const published = item.snippet?.publishTime || item.snippet?.publishedAt

  return (
    <div className="flex gap-4 group">
      <Link to={`/Video/${videoId}`} className="relative w-[360px] max-w-[45%] aspect-video rounded-xl overflow-hidden bg-[#272727] flex-shrink-0">
        <img src={thumb} alt="" className="w-full h-full object-cover" />
        {item.meta?.duration ? (
          <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded text-white">
            {item.meta.duration}
          </span>
        ) : null}
      </Link>
      <div className="min-w-0 flex-1 text-white py-1">
        <Link to={`/Video/${videoId}`}>
          <p className="text-lg font-medium line-clamp-2 group-hover:text-[#f1f1f1]">
            {item.snippet?.title}
          </p>
        </Link>
        <p className="text-xs text-[#aaa] mt-1">
          {views != null ? `${formatViews(views)} views` : ''}
          {published ? ` • ${timeAgo(published)}` : ''}
        </p>
        {channelId ? (
          <Link to={`/channel/${channelId}`} className="text-sm text-[#aaa] mt-2 inline-block hover:text-[#f1f1f1]">
            {item.snippet?.channelTitle}
          </Link>
        ) : (
          <p className="text-sm text-[#aaa] mt-2">{item.snippet?.channelTitle}</p>
        )}
        <p className="text-xs text-[#aaa] mt-2 line-clamp-2 hidden md:block">
          {item.snippet?.description}
        </p>
      </div>
    </div>
  )
}

export default Result
