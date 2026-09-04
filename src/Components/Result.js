import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'
import { searchCatalog } from '../data/mockCatalog'
import { searchVideos } from '../utils/youtubeApi'
import Card from './Home-components/Card'

const Result = () => {
  const params = useParams()
  const query = decodeURIComponent(params.text || '')
  const { setisShowScrollbar, activeCategory, isShowLeftbar, windowResize } =
    useContext(ThemeContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      const local = searchCatalog(query, activeCategory)
      let list = local.items
      try {
        const live = await searchVideos(query || 'videos', 30)
        if (live?.items?.length) {
          const ids = new Set(live.items.map((i) => i.id?.videoId))
          list = [
            ...live.items.map((it) => ({
              ...it,
              meta: { channelAvatar: null, duration: '', views: undefined },
            })),
            ...local.items.filter((x) => !ids.has(x.id?.videoId)),
          ]
        }
      } catch (_) {
        /* local only */
      }
      if (!cancelled) {
        setItems(list)
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [query, activeCategory])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-3 sm:px-6 ${leftPad}`}>
      <h1 className="text-white text-lg mb-4">
        Results for <span className="font-semibold">&quot;{query}&quot;</span>
        {activeCategory !== 'All' ? (
          <span className="text-[#aaa] text-sm"> in {activeCategory}</span>
        ) : null}
      </h1>

      {loading ? (
        <p className="text-[#aaa]">Searching...</p>
      ) : !items.length ? (
        <div className="text-center py-20 text-[#aaa]">
          <i className="fa-solid fa-magnifying-glass text-4xl mb-3 opacity-40"></i>
          <p className="text-white text-lg mb-1">No results found</p>
          <p className="text-sm">Try different keywords or another category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-5xl">
          {items.map((item, idx) => (
            <div key={`${item.id?.videoId}-${idx}`} className="sm:max-w-none">
              <div className="hidden sm:block">
                <ResultRow item={item} />
              </div>
              <div className="sm:hidden">
                <Card item={item} channelLogo={item.meta?.channelAvatar} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ResultRow = ({ item }) => {
  const videoId = item.id?.videoId
  const thumb =
    item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.high?.url
  return (
    <Link to={`/Video/${videoId}`} className="flex gap-4 group">
      <div className="relative w-[360px] max-w-[45%] aspect-video rounded-xl overflow-hidden bg-[#272727] flex-shrink-0">
        <img src={thumb} alt="" className="w-full h-full object-cover" />
        {item.meta?.duration ? (
          <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded text-white">
            {item.meta.duration}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 pt-1 text-[#f1f1f1]">
        <h3 className="text-lg font-medium line-clamp-2 group-hover:text-white">
          {item.snippet?.title}
        </h3>
        <p className="text-xs text-[#aaa] mt-1">{item.snippet?.channelTitle}</p>
        <p className="text-sm text-[#aaa] mt-2 line-clamp-2">{item.snippet?.description}</p>
      </div>
    </Link>
  )
}

export default Result
