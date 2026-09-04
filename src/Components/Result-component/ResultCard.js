import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CallContext } from '../../Hooks/CallingCotext'
import { getVideosByIds } from '../../utils/youtubeApi'

const listIcons = ['fa-indent', 'fa-arrow-down', 'fa-share']
const listIconsName = ['Add to queue', 'Download', 'Share']

const ResultCard = ({ item, allitems, index }) => {
  const [videoOptions, setvideoOptions] = useState(false)
  const [DataStats, setDataStats] = useState(null)
  const fetched = useRef(false)
  const { setdirectSearch } = useContext(CallContext)

  useEffect(() => {
    setdirectSearch(true)
  }, [setdirectSearch])

  useEffect(() => {
    if (fetched.current || !allitems?.length) return
    fetched.current = true
    const ids = allitems.map((v) => v.id?.videoId).filter(Boolean)
    getVideosByIds(ids).then((data) => setDataStats(data))
  }, [allitems])

  function formatNumber(num) {
    if (!num) return '0'
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return num.toString()
  }

  function DateConverter(currentDate) {
    const date = new Date(currentDate)
    const now = new Date()
    const diff = now - date
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    if (seconds < 60) return `${seconds} seconds ago`
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    if (days < 30) return `${days} days ago`
    if (months < 12) return `${months} months ago`
    return `${years} years ago`
  }

  const videoId = item?.id?.videoId
  if (!videoId) return null

  const statsItem = DataStats?.items?.find((v) => v.id === videoId) || DataStats?.items?.[index]
  const thumb =
    item.snippet?.thumbnails?.medium?.url ||
    item.snippet?.thumbnails?.high?.url ||
    item.snippet?.thumbnails?.default?.url

  return (
    <Link
      to={`/Video/${videoId}`}
      className="flex flex-col sm:flex-row gap-3 p-2 sm:p-4 hover:cursor-pointer w-full text-[#F0F0F0] relative rounded-sm min-w-0"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div className="w-full sm:w-[40%] md:w-[360px] flex-shrink-0">
        <div className="aspect-video overflow-hidden rounded-xl bg-[#272727]">
          <img src={thumb} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      <div className="flex justify-between w-full min-w-0 p-1 sm:p-2">
        <div className="min-w-0 flex-1">
          <p className="text-base sm:text-xl line-clamp-2">{item.snippet.title}</p>
          <div className="text-[12px] text-gray-500 mt-1">
            {statsItem
              ? `${formatNumber(statsItem.statistics?.viewCount)} views · `
              : ''}
            {DateConverter(item.snippet.publishTime || item.snippet.publishedAt)}
          </div>
          <div className="flex items-center mt-2 min-w-0">
            <img
              src="/favicon.ico"
              className="overflow-hidden mx-2 rounded-full flex-shrink-0"
              width={36}
              height={36}
              alt=""
            />
            <span className="flex text-[12px] sm:text-sm items-center text-[#AAAAAA] truncate">
              {item.snippet.channelTitle}
              <i className="fa-solid fa-circle-check mx-1 text-gray-600"></i>
            </span>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <i
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setvideoOptions(!videoOptions)
            }}
            className="fa-solid fa-ellipsis-vertical p-2"
          ></i>
          {videoOptions ? (
            <div className="absolute right-0 rounded bg-[#282828] z-10 text-[14px] text-[#F1F1F1] overflow-hidden w-[200px]">
              {listIconsName.map((label, i) => (
                <div key={i} className="hover:bg-[#3E3E3E] p-2">
                  <i className={`fa-solid text-[18px] m-2 ${listIcons[i]}`}></i>
                  {label}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export default ResultCard
