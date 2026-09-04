import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../../utils/format'

/**
 * Related video row — always one full-width line (thumb + meta).
 * Desktop sidebar: compact horizontal. Mobile/tablet: same row, larger thumb.
 */
const RelatedVidosCard = ({ setupdate, item, compact = false }) => {
  const videoId =
    item?.id?.videoId ||
    (typeof item?.id === 'string' ? item.id : null) ||
    item?.meta?.videoId

  if (!videoId || !item?.snippet) return null

  const thumb =
    item.snippet.thumbnails?.medium?.url ||
    item.snippet.thumbnails?.high?.url ||
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`

  const views = item.statistics?.viewCount ?? item.meta?.views
  const published = item.snippet.publishedAt || item.snippet.publishTime

  return (
    <Link
      to={`/Video/${videoId}`}
      onClick={() => {
        setupdate?.(Math.random())
        window.scrollTo(0, 0)
      }}
      className="flex w-full gap-2.5 sm:gap-3 py-1.5 group text-[#f1f1f1] hover:bg-[#1a1a1a] rounded-lg px-1"
    >
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-lg bg-[#272727] aspect-video ${
          compact ? 'w-[168px]' : 'w-[42%] max-w-[200px] sm:w-[180px]'
        }`}
      >
        <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {item.meta?.duration ? (
          <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] px-1 rounded text-white">
            {item.meta.duration}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p
          className={`font-medium leading-snug line-clamp-2 group-hover:text-white ${
            compact ? 'text-sm' : 'text-[15px] sm:text-base'
          }`}
        >
          {item.snippet.title}
        </p>
        <p className="text-[12px] sm:text-[13px] text-[#aaa] mt-1 truncate">
          {item.snippet.channelTitle}
        </p>
        <p className="text-[11px] sm:text-[12px] text-[#aaa] mt-0.5">
          {views != null ? `${formatViews(views)} views` : ''}
          {published ? `${views != null ? ' • ' : ''}${timeAgo(published)}` : ''}
        </p>
      </div>
    </Link>
  )
}

export default RelatedVidosCard
