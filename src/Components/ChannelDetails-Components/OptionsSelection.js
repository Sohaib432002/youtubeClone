import { Link, useParams } from 'react-router'

const OptionsSelection = () => {
  const { channelId } = useParams()
  const base = channelId ? `/channel/${channelId}` : '/CD'

  return (
    <div className="text-white sticky top-[56px] bg-[#0F0F0F] z-[5]">
      <ul className="flex optionsSelection overflow-x-auto scrollbar-hide gap-1">
        <li>
          <Link to={base} className="whitespace-nowrap">
            Home
          </Link>
        </li>
        <li>
          <Link to={`${base}/videolist`} className="whitespace-nowrap">
            Videos
          </Link>
        </li>
        <li>
          <Link to={`${base}/Playlist`} className="whitespace-nowrap">
            Playlist
          </Link>
        </li>
        <li>
          <Link to={`${base}/Posts`} className="whitespace-nowrap">
            Posts
          </Link>
        </li>
      </ul>
      <hr className="w-full border-[#272727]" />
    </div>
  )
}

export default OptionsSelection
