import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SHORTS } from '../../data/mockCatalog'
import { formatViews } from '../../utils/format'
import { useWatchHistory } from '../../Hooks/HistoryContext'

const ShortsPlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToHistory } = useWatchHistory()
  const containerRef = useRef(null)
  const [active, setActive] = useState(0)
  const [likes, setLikes] = useState({})
  const [dislikes, setDislikes] = useState({})

  const startIndex = useMemo(() => {
    const idx = SHORTS.findIndex((s) => s.videoId === id || s.id === id)
    return idx >= 0 ? idx : 0
  }, [id])

  const ordered = useMemo(() => {
    if (!startIndex) return SHORTS
    return [...SHORTS.slice(startIndex), ...SHORTS.slice(0, startIndex)]
  }, [startIndex])

  useEffect(() => {
    setActive(0)
    if (containerRef.current) containerRef.current.scrollTop = 0
  }, [id])

  useEffect(() => {
    const current = ordered[active]
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
  }, [active, ordered, addToHistory, id, navigate])

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
  }, [ordered])

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
        {ordered.map((s, index) => {
          const isActive = index === active
          return (
            <section
              key={`${s.id}-${index}`}
              data-short
              data-index={index}
              className="h-screen w-full snap-start flex items-center justify-center relative"
            >
              <div className="relative h-[min(100vh,920px)] w-full max-w-[420px] bg-black overflow-hidden md:rounded-2xl">
                {isActive ? (
                  <iframe
                    title={s.title}
                    src={`https://www.youtube.com/embed/${s.videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`}
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
                    <img src={s.channelAvatar} alt="" className="w-9 h-9 rounded-full" />
                    <span className="text-white text-sm font-medium">{s.channelHandle}</span>
                    <button
                      type="button"
                      className="ml-1 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="text-white text-sm line-clamp-2 mb-1">{s.title}</p>
                  <p className="text-[#ddd] text-xs flex items-center gap-1">
                    <i className="fa-solid fa-music"></i> {s.music}
                  </p>
                </div>
              </div>

              <div className="absolute right-2 md:right-[max(12px,calc(50%-250px))] bottom-[14%] flex flex-col items-center gap-4 text-white z-10">
                <button
                  type="button"
                  onClick={() => {
                    setLikes((p) => ({ ...p, [s.id]: !p[s.id] }))
                    setDislikes((p) => ({ ...p, [s.id]: false }))
                  }}
                  className="flex flex-col items-center"
                >
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <i className={`fa-solid fa-thumbs-up ${likes[s.id] ? 'text-[#3ea6ff]' : ''}`}></i>
                  </span>
                  <span className="text-xs mt-1">{formatViews(s.likes)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDislikes((p) => ({ ...p, [s.id]: !p[s.id] }))
                    setLikes((p) => ({ ...p, [s.id]: false }))
                  }}
                  className="flex flex-col items-center"
                >
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <i className={`fa-solid fa-thumbs-down ${dislikes[s.id] ? 'text-[#3ea6ff]' : ''}`}></i>
                  </span>
                  <span className="text-xs mt-1">Dislike</span>
                </button>
                <div className="flex flex-col items-center">
                  <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <i className="fa-regular fa-comment"></i>
                  </span>
                  <span className="text-xs mt-1">{s.comments}</span>
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

export default ShortsPlayer
