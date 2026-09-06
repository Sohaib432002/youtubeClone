import { useEffect, useMemo, useRef, useState, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatViews } from '../../utils/format'
import { useWatchHistory } from '../../Hooks/HistoryContext'
import { useLikes } from '../../Hooks/LikesContext'
import { ThemeContext } from '../../Hooks/ThemeContext'
import SubscribeButton from '../ui/SubscribeButton'
import { searchShorts, videoIdOf } from '../../utils/youtubeApi'
import {
  getShortsQueue,
  setShortsQueue,
  inspectVideoIsShort,
  toPlayerShort,
} from '../../utils/shorts'

const ShortsPlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToHistory } = useWatchHistory()
  const { isLiked, toggleLike, getLikeCount, syncLikeBase } = useLikes()
  const { setWatchMode } = useContext(ThemeContext)
  const containerRef = useRef(null)
  const [active, setActive] = useState(0)
  const [dislikes, setDislikes] = useState({})
  const [ordered, setOrdered] = useState([])
  const [blocked, setBlocked] = useState(false)
  const queryRef = useRef('')
  const orderedRef = useRef([])

  useEffect(() => {
    setWatchMode(true)
    return () => setWatchMode(false)
  }, [setWatchMode])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const existingIdx = orderedRef.current.findIndex((s) => s.videoId === id)
      if (existingIdx >= 0) {
        setActive(existingIdx)
        return
      }

      setBlocked(false)
      const stored = getShortsQueue()
      queryRef.current = stored?.query || ''
      let queue = (stored?.items || []).filter((s) => s?.videoId)

      const current = await inspectVideoIsShort(id)
      if (cancelled) return
      if (!current.ok) {
        setBlocked(true)
        navigate(`/Video/${id}`, { replace: true })
        return
      }

      const head = current.playerShort
      const rest = queue.filter((s) => s.videoId !== head.videoId)
      let next = [head, ...rest]

      const needMore = next.length < 8
      if (needMore) {
        const topic = queryRef.current || head.title || ''
        const extra = await searchShorts(topic, 16, {
          excludeIds: next.map((s) => s.videoId),
        })
        const more = (extra.items || [])
          .map(toPlayerShort)
          .filter((s) => s && s.videoId !== head.videoId)
        next = dedupeShorts([...next, ...more])
      }

      setShortsQueue(next, { query: queryRef.current, source: 'player' })
      if (!cancelled) {
        orderedRef.current = next
        setOrdered(next)
        setActive(0)
        if (containerRef.current) containerRef.current.scrollTop = 0
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id, navigate])

  const uniqueOrdered = useMemo(() => {
    const list = dedupeShorts(ordered)
    orderedRef.current = list
    return list
  }, [ordered])

  useEffect(() => {
    const current = uniqueOrdered[active]
    if (!current) return
    addToHistory({
      videoId: current.videoId,
      title: current.title,
      thumbnail: `https://i.ytimg.com/vi/${current.videoId}/mqdefault.jpg`,
      channelTitle: current.channelTitle,
      channelId: current.channelId,
      channelLogo: current.channelAvatar,
    })
    if (current.videoId !== id) {
      navigate(`/shorts/${current.videoId}`, { replace: true })
    }
  }, [active, uniqueOrdered, addToHistory, id, navigate])

  useEffect(() => {
    uniqueOrdered.forEach((s) => {
      if (s.videoId != null && s.likes != null) syncLikeBase(s.videoId, s.likes)
    })
  }, [uniqueOrdered, syncLikeBase])

  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined
    const sections = root.querySelectorAll('[data-short]')
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const idx = Number(visible.target.getAttribute('data-index'))
        if (!Number.isNaN(idx)) setActive(idx)
      },
      { root, threshold: 0.65 }
    )
    sections.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [uniqueOrdered])

  if (blocked) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex">
      <div className="hidden md:flex w-[72px] flex-col items-center pt-4 gap-5 text-white bg-[#0f0f0f]">
        <Link to="/" className="hover:text-red-500" title="Home">
          <i className="fa-solid fa-house text-xl"></i>
        </Link>
        <Link to="/shorts" className="text-white" title="Shorts">
          <i className="fa-solid fa-film text-xl"></i>
        </Link>
      </div>

      <div
        ref={containerRef}
        className="flex-1 h-screen overflow-y-auto snap-y snap-mandatory"
      >
        {uniqueOrdered.map((s, index) => {
          const isActive = index === active
          return (
            <section
              key={`${s.videoId}-${index}`}
              data-short
              data-index={index}
              className="h-screen w-full snap-start flex items-center justify-center relative"
            >
              <div className="relative h-[min(100vh,920px)] w-full max-w-[420px] bg-black overflow-hidden md:rounded-2xl">
                {isActive ? (
                  <iframe
                    title={s.title}
                    src={`https://www.youtube.com/embed/${s.videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${s.videoId}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={`https://i.ytimg.com/vi/${s.videoId}/hqdefault.jpg`}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/35 to-transparent">
                  <div className="pointer-events-auto flex items-center gap-2 mb-2">
                    <Link to={`/channel/${s.channelId}`}>
                      <img src={s.channelAvatar || '/favicon.ico'} alt="" className="w-9 h-9 rounded-full" />
                    </Link>
                    <Link
                      to={`/channel/${s.channelId}`}
                      className="text-white text-sm font-medium hover:underline"
                    >
                      {s.channelHandle || s.channelTitle}
                    </Link>
                    <SubscribeButton
                      channelId={s.channelId}
                      title={s.channelTitle}
                      handle={s.channelHandle}
                      avatar={s.channelAvatar}
                      size="sm"
                      className="ml-1 !py-1"
                    />
                  </div>
                  <p className="text-white text-sm line-clamp-2 mb-1">{s.title}</p>
                  <p className="text-[#ddd] text-xs flex items-center gap-1">
                    <i className="fa-solid fa-music"></i> {s.music || 'Original Audio'}
                  </p>
                </div>
              </div>

              <div className="absolute right-2 md:right-[max(12px,calc(50%-250px))] bottom-[14%] flex flex-col items-center gap-4 text-white z-10">
                <button
                  type="button"
                  onClick={() => {
                    toggleLike({
                      videoId: s.videoId,
                      title: s.title,
                      thumbnail: `https://i.ytimg.com/vi/${s.videoId}/mqdefault.jpg`,
                      channelTitle: s.channelTitle,
                      channelId: s.channelId,
                      channelLogo: s.channelAvatar,
                      views: s.views,
                      duration: s.duration,
                      publishedAt: s.publishedAt,
                      likeCount: s.likes,
                    })
                    setDislikes((p) => ({ ...p, [s.videoId]: false }))
                  }}
                  className="flex flex-col items-center"
                >
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <i
                      className={`fa-solid fa-thumbs-up ${
                        isLiked(s.videoId) ? 'text-[#3ea6ff]' : ''
                      }`}
                    ></i>
                  </span>
                  <span className="text-xs mt-1">
                    {formatViews(getLikeCount(s.videoId, s.likes))}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDislikes((p) => ({ ...p, [s.videoId]: !p[s.videoId] }))
                    if (!dislikes[s.videoId] && isLiked(s.videoId)) {
                      toggleLike({
                        videoId: s.videoId,
                        title: s.title,
                        thumbnail: `https://i.ytimg.com/vi/${s.videoId}/mqdefault.jpg`,
                        channelTitle: s.channelTitle,
                        channelId: s.channelId,
                      })
                    }
                  }}
                  className="flex flex-col items-center"
                >
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <i className={`fa-solid fa-thumbs-down ${dislikes[s.videoId] ? 'text-[#3ea6ff]' : ''}`}></i>
                  </span>
                  <span className="text-xs mt-1">Dislike</span>
                </button>
                <div className="flex flex-col items-center">
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <i className="fa-regular fa-comment"></i>
                  </span>
                  <span className="text-xs mt-1">{s.comments || 0}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <i className="fa-solid fa-share"></i>
                  </span>
                  <span className="text-xs mt-1">Share</span>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate('/shorts')}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 z-20"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  )
}

function dedupeShorts(list = []) {
  const seen = new Set()
  const out = []
  for (const s of list) {
    const id = s?.videoId || videoIdOf(s)
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(s)
  }
  return out
}

export default ShortsPlayer
