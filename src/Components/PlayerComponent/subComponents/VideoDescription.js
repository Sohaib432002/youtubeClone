import React, { useState } from 'react'
import { formatViews, timeAgo } from '../../../utils/format'
import ShowMoreButton from '../../ui/ShowMoreButton'

const VideoDescription = ({ fetchData }) => {
  const [showMore, setShowMore] = useState(false)

  if (!fetchData || !fetchData.items || fetchData.items.length === 0) {
    return (
      <div className="max-w-[1280px] h-24 my-3 bg-[#272727] rounded-xl mx-2 sm:mx-0 animate-pulse" />
    )
  }

  const video = fetchData.items[0]
  const { statistics, snippet } = video
  const description = snippet?.description || ''
  const shortText = description.slice(0, 120)

  return (
    <div className="max-w-[1280px] my-3 bg-[#272727] overflow-hidden p-3 rounded-xl mx-2 sm:mx-0 text-[#f1f1f1]">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span>{formatViews(statistics?.viewCount)} views</span>
        <span>{timeAgo(snippet?.publishedAt)}</span>
        {snippet?.tags?.slice?.(0, 3)?.map?.((t) => (
          <span key={t} className="text-[#3ea6ff]">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-2 text-sm whitespace-pre-wrap text-[#d9d9d9]">
        {showMore ? description : shortText}
        {!showMore && description.length > 120 ? '...' : ''}
      </div>

      {description.length > 120 ? (
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="mt-2 text-sm font-semibold text-white hover:underline"
        >
          {showMore ? 'Show less' : '...more'}
        </button>
      ) : null}

      {showMore ? (
        <div className="mt-2">
          <ShowMoreButton
            collapsed={false}
            label="Show more"
            onClick={() => setShowMore(false)}
          />
        </div>
      ) : null}
    </div>
  )
}

export default VideoDescription
