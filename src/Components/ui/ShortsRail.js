import { Link, useNavigate } from 'react-router-dom'
import { formatViews } from '../../utils/format'
import { videoIdOf } from '../../utils/youtubeApi'
import { setShortsQueue, toPlayerShort } from '../../utils/shorts'

const ShortsRail = ({
  title = 'Shorts',
  items = [],
  query = '',
  viewAllTo = '/shorts',
  compact = false,
}) => {
  const navigate = useNavigate()
  if (!items?.length) return null

  const open = (item) => {
    const shorts = items.map(toPlayerShort).filter(Boolean)
    setShortsQueue(shorts, { query, source: 'rail' })
    const id = videoIdOf(item) || item.videoId
    if (id) navigate(`/shorts/${id}`)
  }

  const width = compact
    ? 'w-[150px] sm:w-[168px]'
    : 'w-[min(72vw,220px)] sm:w-[200px] md:w-[220px]'

  return (
    <section className="my-6 py-5 border-y border-[#222]" aria-label="Shorts">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white">
          <i className="fa-solid fa-bolt text-red-500"></i>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <Link to={viewAllTo} className="text-sm text-[#3ea6ff] hover:underline">
          View all
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory">
        {items.map((item, idx) => {
          const id = videoIdOf(item) || item.videoId
          const titleText = item.snippet?.title || item.title || 'Short'
          const views = item.meta?.views ?? item.statistics?.viewCount ?? item.views
          const thumb =
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.high?.url ||
            (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '')
          return (
            <button
              key={`${id}-${idx}`}
              type="button"
              onClick={() => open(item)}
              className={`snap-start flex-shrink-0 ${width} text-left group`}
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#272727] ring-1 ring-white/10">
                <img
                  src={thumb}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute top-2 left-2 text-[11px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Shorts
                </span>
                <div className="absolute bottom-0 p-2.5">
                  <p className="text-white text-[13px] font-medium line-clamp-2 leading-snug">
                    {titleText}
                  </p>
                  {views != null ? (
                    <p className="text-[#ccc] text-[11px] mt-1">{formatViews(views)} views</p>
                  ) : null}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ShortsRail
