import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CallContext } from '../../Hooks/CallingCotext'

const listIcons = ['fa-indent', 'fa-arrow-down', 'fa-share']
const listIconsName = ['Add to queue', 'Download', 'Share']

const Card = ({ item, channelLogo }) => {
  const [videoOptions, setvideoOptions] = useState(false)
  const { setdirectSearch } = useContext(CallContext)

  useEffect(() => {
    setdirectSearch(false)
  }, [setdirectSearch])

  function DateConverter(currentDate) {
    const date = new Date(currentDate)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${months[date.getMonth()]}, ${date.getFullYear()}`
  }

  const videoId = item?.id?.videoId || (typeof item?.id === 'string' ? item.id : null)
  if (!videoId || !item?.snippet) return null

  const thumb =
    item.snippet.thumbnails?.medium?.url ||
    item.snippet.thumbnails?.high?.url ||
    item.snippet.thumbnails?.default?.url

  const channelId = item.snippet.channelId
  const logo = channelLogo || '/favicon.ico'

  return (
    <div className="flex text-[#F0F0F0] relative flex-col rounded-sm w-full min-w-0">
      <Link to={`/Video/${videoId}`} className="hover:cursor-pointer">
        <div className="w-full aspect-video overflow-hidden rounded-xl bg-[#272727]">
          <img src={thumb} className="w-full h-full object-cover" alt="" />
        </div>
      </Link>

      <div className="flex justify-start items-start p-2 gap-2">
        <Link
          to={channelId ? `/channel/${channelId}` : '#'}
          className="flex-shrink-0 rounded-full my-1 w-9 h-9 overflow-hidden bg-[#272727]"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={logo} className="w-full h-full object-cover" alt="" />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/Video/${videoId}`}>
            <p className="text-sm sm:text-[15px] font-medium line-clamp-2 leading-snug hover:cursor-pointer">
              {item.snippet.title}
            </p>
          </Link>
          <Link
            to={channelId ? `/channel/${channelId}` : '#'}
            className="flex items-center text-sm text-[#AAAAAA] mt-1 truncate hover:text-white"
          >
            {item.snippet.channelTitle}
            <i className="fa-solid fa-circle-check mx-1 text-gray-600 text-xs"></i>
          </Link>
          <div className="text-xs sm:text-sm text-[#AAAAAA]">
            {DateConverter(item.snippet.publishTime || item.snippet.publishedAt)}
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <i
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setvideoOptions(!videoOptions)
            }}
            className="fa-solid fa-ellipsis-vertical p-2 cursor-pointer"
          ></i>
          {videoOptions ? (
            <div className="absolute right-0 rounded bg-[#282828] z-10 text-[14px] text-[#F1F1F1] overflow-hidden w-[200px] sm:w-[250px]">
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
    </div>
  )
}

export default Card
