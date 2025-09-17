import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const VideoDescription = ({ fetchData }) => {
  const [showMore, setShowMore] = useState(false)

  if (!fetchData || !fetchData.items || fetchData.items.length === 0) {
    return (
      <div className="title text-[#DDDDDD] max-w-[1227px] h-[20vh] my-3 bg-[#272727] overflow-hidden p-2 rounded-xl ml-20"></div>
    )
  }

  const video = fetchData.items[0]
  const { statistics, snippet } = video

  // Format numbers like 1.2K, 3.4M, etc.
  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return num.toString()
  }

  // Convert date to "Sep, 2025"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const views = formatNumber(statistics?.viewCount)
  const publishedAt = formatDate(snippet?.publishedAt)
  const description = snippet?.description || ''

  return (
    <div className="title text-[#DDDDDD] max-w-[1227px] my-3 bg-[#272727] overflow-hidden p-3 rounded-xl ml-20">
      <div className="flex flex-wrap items-center gap-2">
        <b>
          {views} Views • {publishedAt}
        </b>
        <Link to="#" className="hover:underline">
          {snippet?.title}
        </Link>
      </div>

      <div className="mt-2">
        {!showMore ? (
          <>
            {description.length > 400 ? description.slice(0, 400) + '...' : description}
            {description.length > 400 && (
              <p onClick={() => setShowMore(true)} className="cursor-pointer text-blue-400">
                Show more
              </p>
            )}
          </>
        ) : (
          <>
            {description}
            <p
              onClick={() => setShowMore(false)}
              className="cursor-pointer text-blue-400 font-semibold mt-2"
            >
              Show less
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default VideoDescription
