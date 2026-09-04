import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../../utils/format'

/**
 * Related video row — landscape 16:9 thumb + meta (YouTube-style).
 */
const RelatedVidosCard = ({ setupdate, item, compact = false }) => {
  const videoId =
    item?.id?.videoId ||
    (typeof item?.id === 'string' ? item.id : null) ||
    item?.meta?.videoId

  if (!videoId || !item?.snippet) return null

  // Always prefer YouTube's 16:9 mq/hq defaults (never vertical Shorts crops)
  const thumb = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`

  const views = item.statistics?.viewCount ?? item.meta?.views
  const published = item.snippet.publishedAt || item.snippet.publishTime
  const duration = item.meta?.duration || ''

  return (
    <Link
      to={`/Video/${videoId}`}
      onClick={() => {
        setupdate?.(Math.random())
        window.scrollTo(0, 0)
      }}
      className="flex w-full gap-2 sm:gap-3 py-1.5 group text-[#f1f1f1] hover:bg-[#272727]/80 rounded-xl px-1.5 transition-colors"
    >
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-lg bg-[#272727] aspect-video ${
          compact ? 'w-[168px]' : 'w-[42%] max-w-[210px] sm:w-[190px]'
        }`}
      >
        <img
          src={thumb}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
        {duration ? (
          <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[10px] font-medium px-1 py-0.5 rounded">
            {duration}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1 py-0.5 pr-1">
        <p
          className={`font-medium leading-snug line-clamp-2 text-[#f1f1f1] group-hover:text-white ${
            compact ? 'text-[13px]' : 'text-sm sm:text-[15px]'
          }`}
        >
          {item.snippet.title}
        </p>
        <p className="text-[12px] text-[#aaa] mt-1 truncate group-hover:text-[#ccc]">
          {item.snippet.channelTitle}
        </p>
        <p className="text-[11px] text-[#aaa] mt-0.5">
          {views != null ? `${formatViews(views)} views` : ''}
          {published ? `${views != null ? ' • ' : ''}${timeAgo(published)}` : ''}
        </p>
      </div>
    </Link>
  )
}

export default RelatedVidosCard
