import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/format'
import { itemThumb, itemVideoId } from '../../utils/channelContent'

export function PlaylistCard({ playlist, channelId, compact = false }) {
  const id = playlist?.id
  const sn = playlist?.snippet || {}
  const count = playlist?.contentDetails?.itemCount ?? playlist?._videos?.length ?? 0
  const thumb = sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || itemThumb(playlist)
  const to = channelId && id ? `/channel/${channelId}/Playlist/${id}` : '#'
  const width = compact ? 'w-[210px] flex-shrink-0' : 'w-full'

  return (
    <Link to={to} className={`${width} group`}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727]">
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#555]">
            <i className="fa-solid fa-list text-3xl"></i>
          </div>
        )}
        <div className="absolute inset-y-0 right-0 w-[38%] bg-black/75 flex flex-col items-center justify-center text-white">
          <span className="text-lg font-semibold">{formatViews(count)}</span>
          <i className="fa-solid fa-list mt-1"></i>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-sm gap-2">
          <i className="fa-solid fa-play"></i>
          Play all
        </div>
      </div>
      <p className="text-white text-sm font-medium mt-2 line-clamp-2">{sn.title || 'Playlist'}</p>
      <p className="text-[#aaa] text-xs mt-1">
        {formatViews(count)} videos
        {sn.publishedAt ? ` • ${timeAgo(sn.publishedAt)}` : ''}
        <span className="block mt-0.5 group-hover:text-white">View full playlist</span>
      </p>
    </Link>
  )
}

export function ShelfVideoCard({ item, live = false }) {
  const videoId = itemVideoId(item)
  if (!videoId || !item?.snippet) return null
  const thumb = itemThumb(item, videoId)
  const views = item.meta?.views ?? item.statistics?.viewCount
  const published = item.snippet.publishTime || item.snippet.publishedAt
  const duration = item.meta?.duration || item.contentDetails?.duration || ''
  const status = item.liveStatus || item.snippet?.liveBroadcastContent
  const isLive = live || status === 'live'
  const upcoming = status === 'upcoming'

  return (
    <Link to={`/Video/${videoId}`} className="w-[210px] sm:w-[240px] flex-shrink-0 group">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727]">
        <img
          src={thumb}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {isLive ? (
          <span className="absolute bottom-1.5 left-1.5 bg-[#c00] text-white text-[11px] font-bold px-1.5 py-0.5 rounded uppercase">
            Live
          </span>
        ) : upcoming ? (
          <span className="absolute bottom-1.5 left-1.5 bg-[#272727] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            Upcoming
          </span>
        ) : duration ? (
          <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[11px] font-medium px-1 py-0.5 rounded">
            {duration}
          </span>
        ) : null}
      </div>
      <h3 className="text-white text-sm font-medium mt-2 line-clamp-2 leading-snug">
        {item.snippet.title}
      </h3>
      <p className="text-[#aaa] text-xs mt-1">
        {views != null ? `${formatViews(views)} views` : ''}
        {published ? ` • ${timeAgo(published)}` : ''}
      </p>
    </Link>
  )
}

export function ShelfShortCard({ item, fill = false }) {
  const videoId = itemVideoId(item)
  if (!videoId) return null
  const thumb = itemThumb(item, videoId)
  const views = item.meta?.views ?? item.statistics?.viewCount
  const width = fill ? 'w-full' : 'w-[150px] sm:w-[168px] flex-shrink-0'

  return (
    <Link to={`/shorts/${videoId}`} className={`${width} group`}>
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#272727]">
        <img
          src={thumb}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 p-2.5">
          <p className="text-white text-[13px] font-medium line-clamp-2 leading-snug">
            {item.snippet?.title}
          </p>
          {views != null ? (
            <p className="text-[#ccc] text-[11px] mt-1">{formatViews(views)} views</p>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export default PlaylistCard
