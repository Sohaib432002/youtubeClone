import { useContext, useEffect } from 'react'
import LeftBarContent from './Sub-Menu-Components/LeftBarContent'
import Logo from '../Navbar-Components/Logo'
import { ThemeContext } from '../../Hooks/ThemeContext'

/**
 * Expanded sidebar:
 * - Desktop (lg+): always visible, fixed, no backdrop
 * - Mobile/tablet: overlay drawer when isShowLeftbar
 */
const Leftbar = () => {
  const {
    isShowLeftbar,
    toggleLeftbar,
    setisShowLeftbar,
    isDesktopSidebar,
  } = useContext(ThemeContext)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !isDesktopSidebar) setisShowLeftbar(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setisShowLeftbar, isDesktopSidebar])

  if (!isDesktopSidebar && !isShowLeftbar) return null

  return (
    <>
      {!isDesktopSidebar ? (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setisShowLeftbar(false)}
          aria-hidden
        />
      ) : null}
      <aside
        className={`fixed z-40 bg-[#0F0F0F] h-screen w-[240px] max-w-[85vw] top-0 left-0 border-r border-[#272727] flex flex-col ${
          isDesktopSidebar ? 'shadow-none' : 'shadow-2xl'
        }`}
      >
        <div className="h-14 flex items-center px-2 border-b border-[#272727] flex-shrink-0">
          <Logo setleftBar={toggleLeftbar} leftBar={isShowLeftbar} />
        </div>
        <LeftBarContent />
      </aside>
    </>
  )
}

export default Leftbar
