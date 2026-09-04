import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../../Hooks/AuthContext'
import { useContext } from 'react'
import { ThemeContext } from '../../../Hooks/ThemeContext'

const primary = [
  { to: '/', label: 'Home', icon: 'fa-solid fa-house', end: true },
  { to: '/shorts', label: 'Shorts', icon: 'fa-solid fa-film' },
  { to: '/Subscriptions', label: 'Subscriptions', icon: 'fa-solid fa-play' },
]

const youLinks = [
  { to: '/you', label: 'You', icon: 'fa-regular fa-circle-user' },
  { to: '/history', label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
]

const explore = [
  { category: 'Music', icon: 'fa-solid fa-music' },
  { category: 'Gaming', icon: 'fa-solid fa-gamepad' },
  { category: 'News', icon: 'fa-solid fa-newspaper' },
  { category: 'Sports', icon: 'fa-solid fa-trophy' },
  { category: 'Learning', icon: 'fa-solid fa-graduation-cap' },
  { category: 'Fashion & Beauty', icon: 'fa-solid fa-shirt' },
  { category: 'Comedy', icon: 'fa-solid fa-face-smile' },
  { category: 'Technology', icon: 'fa-solid fa-microchip' },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-4 px-3 py-2.5 mx-2 rounded-xl text-sm font-medium transition-colors ${
    isActive ? 'bg-[#272727] text-white' : 'text-[#F1F1F1] hover:bg-[#272727]'
  }`

const LeftBarContent = () => {
  const { isSignedIn, openSignIn, user } = useAuth()
  const { setActiveCategory, setisShowLeftbar, windowResize } = useContext(ThemeContext)
  const navigate = useNavigate()

  const closeOnMobile = () => {
    if (windowResize < 1024) setisShowLeftbar(false)
  }

  const goCategory = (category) => {
    setActiveCategory(category)
    navigate('/')
    closeOnMobile()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-y-auto pb-8 scrollbar-hide">
      <nav className="py-2">
        {primary.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={closeOnMobile}
          >
            <i className={`${item.icon} w-5 text-center text-base`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <hr className="border-[#3F3F3F] my-2 mx-3" />

      <nav className="py-1">
        <p className="px-5 py-2 text-sm font-semibold text-white">You</p>
        {youLinks.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={closeOnMobile}>
            <i className={`${item.icon} w-5 text-center text-base`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <hr className="border-[#3F3F3F] my-2 mx-3" />

      {!isSignedIn ? (
        <div className="px-5 py-3">
          <p className="text-[13px] text-[#AAAAAA] leading-snug mb-3">
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
        <div className="px-5 py-3 flex items-center gap-3">
          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-[#AAAAAA]">Signed in</p>
          </div>
        </div>
      )}

      <hr className="border-[#3F3F3F] my-2 mx-3" />

      <div className="py-1">
        <p className="px-5 py-2 text-sm font-semibold text-white">Explore</p>
        {explore.map((item) => (
          <button
            key={item.category}
            type="button"
            onClick={() => goCategory(item.category)}
            className="w-[calc(100%-16px)] flex items-center gap-4 px-3 py-2.5 mx-2 rounded-xl text-sm font-medium text-[#F1F1F1] hover:bg-[#272727] text-left"
          >
            <i className={`${item.icon} w-5 text-center text-base`}></i>
            <span>{item.category}</span>
          </button>
        ))}
      </div>

      <hr className="border-[#3F3F3F] my-2 mx-3" />

      <div className="px-5 py-3 text-[12px] text-[#AAAAAA] leading-relaxed">
        <p className="mb-2">About Press Copyright Contact us Creators Advertise Developers</p>
        <p>Terms Privacy Policy &amp; Safety How YouTube works</p>
        <p className="mt-3 text-[#717171]">© {new Date().getFullYear()} YouTube Clone</p>
      </div>
    </div>
  )
}

export default LeftBarContent
