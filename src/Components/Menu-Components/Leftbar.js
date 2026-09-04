import { useContext, useEffect } from 'react'
import { NavLink } from 'react-router'
import LeftBarContent from './Sub-Menu-Components/LeftBarContent'
import Logo from '../Navbar-Components/Logo'
import { ThemeContext } from '../../Hooks/ThemeContext'

const miniLinks = [
  { to: '/', label: 'Home', icon: 'fa-solid fa-house', end: true },
  { to: '/shorts', label: 'Shorts', icon: 'fa-solid fa-film' },
  { to: '/Subscriptions', label: 'Subs', icon: 'fa-solid fa-play' },
  { to: '/you', label: 'You', icon: 'fa-regular fa-circle-user' },
]

/**
 * Expanded sidebar / mini guide:
 * - Desktop home: fixed 240px under navbar — content uses margin (never overlaps player)
 * - Desktop watch: 72px mini guide; hamburger opens 240px overlay + backdrop
 * - Mobile/tablet: overlay drawer only when menu is opened
 */
const Leftbar = () => {
  const {
    isShowLeftbar,
    toggleLeftbar,
    setisShowLeftbar,
    isDesktopSidebar,
    watchMode,
    showMiniGuide,
    showExpandedDrawer,
  } = useContext(ThemeContext)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isShowLeftbar && (watchMode || !isDesktopSidebar)) {
        setisShowLeftbar(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setisShowLeftbar, isDesktopSidebar, isShowLeftbar, watchMode])

  const isOverlayDrawer = !isDesktopSidebar || watchMode

  return (
    <>
      {showMiniGuide ? (
        <aside
          className="fixed z-20 top-14 left-0 w-[72px] h-[calc(100vh-56px)] bg-[#0F0F0F] border-r border-[#272727] flex flex-col items-center pt-2 gap-1 pointer-events-auto"
          aria-label="Mini guide"
        >
          {miniLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex w-[64px] flex-col items-center rounded-xl py-3 text-white hover:bg-[#272727] ${
                  isActive ? 'bg-[#272727]' : ''
                }`
              }
            >
              <i className={`${item.icon} text-lg`}></i>
              <span className="text-[10px] mt-1 truncate max-w-[60px] text-center">
                {item.label}
              </span>
            </NavLink>
          ))}
        </aside>
      ) : null}

      {showExpandedDrawer && isOverlayDrawer ? (
        <div
          className="fixed inset-0 z-[35] bg-black/50"
          onClick={() => setisShowLeftbar(false)}
          aria-hidden
        />
      ) : null}

      {showExpandedDrawer ? (
        <aside
          className={`fixed bg-[#0F0F0F] left-0 w-[240px] max-w-[85vw] border-r border-[#272727] flex flex-col ${
            isOverlayDrawer
              ? 'z-40 top-0 h-screen shadow-2xl'
              : 'z-20 top-14 h-[calc(100vh-56px)] shadow-none'
          }`}
        >
          {isOverlayDrawer ? (
            <div className="h-14 flex items-center px-2 border-b border-[#272727] flex-shrink-0 bg-[#0F0F0F]">
              <Logo setleftBar={toggleLeftbar} leftBar={isShowLeftbar} />
            </div>
          ) : null}
          <LeftBarContent />
        </aside>
      ) : null}
    </>
  )
}

export default Leftbar
