import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/format'

/** Shared vertical list used by Liked / Watch later / Playlist detail */
const LibraryVideoList = ({
  items,
  emptyIcon = 'fa-regular fa-clock',
  emptyTitle = 'Nothing here yet',
  emptyHint = '',
  onRemove,
  removeTitle = 'Remove',
  removeIcon = 'fa-solid fa-xmark',
  dateKey = 'savedAt',
  dateLabel = 'Saved',
}) => {
  if (!items?.length) {
    return (
      <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
        <i className={`${emptyIcon} text-4xl mb-3 text-[#555]`}></i>
        <p className="text-white text-lg mb-1">{emptyTitle}</p>
        {emptyHint ? <p className="text-sm text-[#aaa]">{emptyHint}</p> : null}
        <Link to="/" className="inline-block mt-4 text-[#3ea6ff] text-sm hover:underline">
          Browse videos
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div
          key={item.videoId}
          className="group flex gap-3 sm:gap-4 hover:bg-[#1a1a1a] rounded-xl p-2 pr-3"
        >
          <span className="hidden sm:flex w-6 items-center justify-center text-[#aaa] text-sm">
            {index + 1}
          </span>
          <Link
            to={`/Video/${item.videoId}`}
            className="relative w-36 sm:w-56 aspect-video rounded-lg overflow-hidden bg-[#272727] flex-shrink-0"
          >
            <img
              src={
                item.thumbnail ||
                `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`
              }
              alt=""
              className="w-full h-full object-cover"
            />
            {item.duration ? (
              <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[11px] font-medium px-1 py-0.5 rounded">
                {item.duration}
              </span>
            ) : null}
          </Link>
          <div className="min-w-0 flex-1 py-0.5">
            <Link to={`/Video/${item.videoId}`}>
              <p className="line-clamp-2 text-sm sm:text-[15px] font-medium leading-snug">
                {item.title}
              </p>
            </Link>
            <Link
              to={item.channelId ? `/channel/${item.channelId}` : '#'}
              className="mt-1.5 text-[13px] text-[#aaa] hover:text-white truncate block"
            >
              {item.channelTitle || 'Channel'}
            </Link>
            <p className="text-[12px] text-[#aaa] mt-0.5">
              {item.views != null ? `${formatViews(item.views)} views` : ''}
              {item.publishedAt ? ` • ${timeAgo(item.publishedAt)}` : ''}
              {item[dateKey] ? ` • ${dateLabel} ${timeAgo(item[dateKey])}` : ''}
            </p>
          </div>
          {onRemove ? (
            <button
              type="button"
              title={removeTitle}
              onClick={() => onRemove(item.videoId)}
              className="self-start mt-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 w-9 h-9 rounded-full hover:bg-[#272727] text-[#aaa] hover:text-white flex-shrink-0"
            >
              <i className={removeIcon}></i>
            </button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default LibraryVideoList
