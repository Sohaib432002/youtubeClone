import { NavLink, useParams, useLocation } from 'react-router-dom'

const TABS = [
  { path: '', label: 'Home', end: true },
  { path: 'videolist', label: 'Videos' },
  { path: 'shorts', label: 'Shorts' },
  { path: 'live', label: 'Live' },
  { path: 'Playlist', label: 'Playlists' },
  { path: 'Posts', label: 'Posts' },
  { path: 'about', label: 'About' },
]

const OptionsSelection = () => {
  const { channelId } = useParams()
  const location = useLocation()
  const base = channelId ? `/channel/${channelId}` : '/CD'
  const searching = location.pathname.endsWith('/search')

  return (
    <div className="text-white sticky top-[56px] bg-[#0F0F0F] z-[5] -mx-1">
      <ul className="flex optionsSelection overflow-x-auto scrollbar-hide items-end">
        {TABS.map((tab) => (
          <li key={tab.label}>
            <NavLink
              to={tab.path ? `${base}/${tab.path}` : base}
              end={Boolean(tab.end)}
              className={({ isActive }) => (isActive ? 'active-tab' : undefined)}
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to={`${base}/search`}
            className={({ isActive }) => (isActive || searching ? 'active-tab' : undefined)}
            aria-label="Search channel"
            title="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default OptionsSelection
