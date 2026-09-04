import { useContext, useEffect } from 'react'
import LeftBarContent from './Sub-Menu-Components/LeftBarContent'
import Logo from '../Navbar-Components/Logo'
import { ThemeContext } from '../../Hooks/ThemeContext'

const Leftbar = () => {
  const { isShowLeftbar, toggleLeftbar, setisShowLeftbar } =
    useContext(ThemeContext)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setisShowLeftbar(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setisShowLeftbar])

  if (!isShowLeftbar) return null

  return (
    <>
      {/* Backdrop on smaller screens */}
      <div
        className="fixed inset-0 z-30 bg-black/50 lg:bg-black/40"
        onClick={() => setisShowLeftbar(false)}
      />
      <aside className="fixed z-40 bg-[#0F0F0F] h-screen w-[240px] max-w-[85vw] top-0 left-0 shadow-2xl border-r border-[#272727] flex flex-col">
        <div className="h-14 flex items-center px-2 border-b border-[#272727] flex-shrink-0">
          <Logo setleftBar={toggleLeftbar} leftBar={isShowLeftbar} />
        </div>
        <LeftBarContent />
      </aside>
    </>
  )
}

export default Leftbar
