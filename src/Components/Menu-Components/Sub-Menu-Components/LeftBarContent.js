import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../../Hooks/AuthContext'
import { useContext, useState } from 'react'
import { ThemeContext } from '../../../Hooks/ThemeContext'
import { useSubscriptions } from '../../../Hooks/SubscriptionsContext'
import { useStudio } from '../../../Hooks/StudioContext'

const primary = [
  { to: '/', label: 'Home', icon: 'fa-solid fa-house', end: true },
  { to: '/shorts', label: 'Shorts', icon: 'fa-solid fa-film' },
  { to: '/Subscriptions', label: 'Subscriptions', icon: 'fa-solid fa-play' },
]

const youLinks = [
  { to: '/you', label: 'Your channel', icon: 'fa-regular fa-circle-user' },
  { to: '/history', label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
  { to: '/playlists', label: 'Playlists', icon: 'fa-solid fa-list' },
  { to: '/watch-later', label: 'Watch later', icon: 'fa-regular fa-clock' },
  { to: '/liked', label: 'Liked videos', icon: 'fa-regular fa-thumbs-up' },
  { to: '/downloads', label: 'Downloads', icon: 'fa-solid fa-download' },
]

const explore = [
  { category: 'Trending', icon: 'fa-solid fa-fire' },
  { category: 'Music', icon: 'fa-solid fa-music' },
  { category: 'Gaming', icon: 'fa-solid fa-gamepad' },
  { category: 'News', icon: 'fa-solid fa-newspaper' },
  { category: 'Sports', icon: 'fa-solid fa-trophy' },
  { category: 'Education', icon: 'fa-solid fa-graduation-cap' },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-6 px-3 py-[10px] mx-2 rounded-xl text-[14px] font-normal transition-colors ${
    isActive ? 'bg-[#272727] text-white font-medium' : 'text-[#f1f1f1] hover:bg-[#272727]'
  }`

const LeftBarContent = () => {
  const { isSignedIn, openSignIn, user } = useAuth()
  const { subscriptions } = useSubscriptions()
  const { getMyChannel } = useStudio()
  const myChannel = getMyChannel()
  const { setActiveCategory, setisShowLeftbar, windowResize } = useContext(ThemeContext)
  const navigate = useNavigate()
  const [showAllSubs, setShowAllSubs] = useState(false)
  const [showMoreYou, setShowMoreYou] = useState(false)
  const subs =
    isSignedIn && subscriptions.length
      ? subscriptions.map((s) => ({
          id: s.channelId,
          title: s.title,
          avatar: s.avatar,
          hasNew: false,
          isLive: false,
        }))
      : []
  const visibleSubs = showAllSubs ? subs : subs.slice(0, 5)
  const visibleYou = showMoreYou ? youLinks : youLinks.slice(0, 4)

  const closeOnMobile = () => {
    if (windowResize < 1024) setisShowLeftbar(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-y-auto pb-8 pr-1">
      <nav className="pt-2 pb-1">
        {primary.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={closeOnMobile}
          >
            <i className={`${item.icon} w-6 text-center text-[18px]`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <hr className="border-[#3f3f3f] my-3 mx-4" />

      <div>
        <button
          type="button"
          onClick={() => {
            navigate('/you')
            closeOnMobile()
          }}
          className="w-[calc(100%-16px)] flex items-center gap-2 px-3 py-2 mx-2 rounded-xl text-[14px] font-medium text-white hover:bg-[#272727]"
        >
          You
          <i className="fa-solid fa-chevron-right text-[10px] text-[#aaa]"></i>
        </button>
        {visibleYou.map((item) => {
          const to =
            item.label === 'Your channel'
              ? myChannel
                ? `/channel/${myChannel.id}`
                : '/studio/channel'
              : item.to
          return (
            <NavLink key={item.label} to={to} className={linkClass} onClick={closeOnMobile}>
              <i className={`${item.icon} w-6 text-center text-[18px]`}></i>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
        <button
          type="button"
          onClick={() => setShowMoreYou((v) => !v)}
          className="w-[calc(100%-16px)] flex items-center gap-6 px-3 py-[10px] mx-2 rounded-xl text-[14px] text-[#f1f1f1] hover:bg-[#272727]"
        >
          <i className={`fa-solid fa-chevron-${showMoreYou ? 'up' : 'down'} w-6 text-center`}></i>
          <span>{showMoreYou ? 'Show less' : 'Show more'}</span>
        </button>
      </div>

      <hr className="border-[#3f3f3f] my-3 mx-4" />

      {!isSignedIn ? (
        <div className="px-5 py-2">
          <p className="text-[13px] text-[#aaa] leading-snug mb-3">
            Sign in to like videos, comment, and subscribe.
          </p>
          <button
            type="button"
            onClick={openSignIn}
            className="inline-flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-3.5 py-1.5 text-sm font-medium hover:bg-[#3ea6ff]/10"
          >
            <i className="fa-regular fa-circle-user"></i>
            Sign in
          </button>
        </div>
      ) : (
        <div className="px-5 py-2 flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-[#aaa] truncate">
              @{user.email?.split('@')[0] || user.name?.toLowerCase().replace(/\s+/g, '')}
            </p>
          </div>
        </div>
      )}

      <hr className="border-[#3f3f3f] my-3 mx-4" />

      <div>
        <p className="px-5 py-2 text-[14px] font-medium text-white">Subscriptions</p>
        {!isSignedIn ? (
          <p className="px-5 py-2 text-[13px] text-[#aaa]">
            Sign in to see channels you subscribe to.
          </p>
        ) : subs.length === 0 ? (
          <p className="px-5 py-2 text-[13px] text-[#aaa]">
            No subscriptions yet. Subscribe to channels you like.
          </p>
        ) : (
          <>
            {visibleSubs.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  navigate(`/channel/${ch.id}`)
                  closeOnMobile()
                }}
                className="w-[calc(100%-16px)] flex items-center gap-4 px-3 py-2 mx-2 rounded-xl hover:bg-[#272727] text-left"
              >
                <img src={ch.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-[14px] text-[#f1f1f1] truncate flex-1">{ch.title}</span>
                {ch.isLive ? (
                  <span className="text-[10px] text-red-500 font-bold tracking-wide">LIVE</span>
                ) : ch.hasNew ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ea6ff]"></span>
                ) : null}
              </button>
            ))}
            {subs.length > 5 ? (
              <button
                type="button"
                onClick={() => setShowAllSubs((v) => !v)}
                className="w-[calc(100%-16px)] flex items-center gap-6 px-3 py-[10px] mx-2 rounded-xl text-[14px] text-[#f1f1f1] hover:bg-[#272727]"
              >
                <i className={`fa-solid fa-chevron-${showAllSubs ? 'up' : 'down'} w-6 text-center`}></i>
                <span>{showAllSubs ? 'Show less' : 'Show more'}</span>
              </button>
            ) : null}
          </>
        )}
      </div>

      <hr className="border-[#3f3f3f] my-3 mx-4" />

      <div>
        <p className="px-5 py-2 text-[14px] font-medium text-white">Explore</p>
        {explore.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => {
              setActiveCategory(item.category)
              navigate('/')
              closeOnMobile()
            }}
            className="w-[calc(100%-16px)] flex items-center gap-6 px-3 py-[10px] mx-2 rounded-xl text-[14px] text-[#f1f1f1] hover:bg-[#272727] text-left"
          >
            <i className={`${item.icon} w-6 text-center text-[18px]`}></i>
            <span>{item.category}</span>
          </button>
        ))}
      </div>

      <div className="px-5 py-4 text-[12px] text-[#aaa] leading-relaxed">
        <p>About Press Copyright Contact us Creators Advertise Developers</p>
        <p className="mt-2">Terms Privacy Policy &amp; Safety How YouTubeClone works</p>
        <p className="mt-3 text-[#717171]">© {new Date().getFullYear()} YouTubeClone</p>
      </div>
    </div>
  )
}

export default LeftBarContent
