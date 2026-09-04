import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Hooks/AuthContext'
import { useWatchHistory } from '../../Hooks/HistoryContext'
import { ThemeContext } from '../../Hooks/ThemeContext'

const Self = () => {
  const { user, isSignedIn, openSignIn, signOut } = useAuth()
  const { history } = useWatchHistory()
  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    isShowLeftbar && windowResize >= 1200 ? 'md:ml-[15rem]' : 'md:ml-[5rem]'

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-4 ${leftPad} text-white max-w-3xl`}>
      <h1 className="text-2xl font-semibold mb-6">You</h1>

      {isSignedIn ? (
        <div className="flex items-center gap-4 mb-8">
          <img src={user.avatar} alt="" className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-xl font-medium">{user.name}</p>
            {user.email ? <p className="text-[#AAAAAA] text-sm">{user.email}</p> : null}
            <button
              type="button"
              onClick={signOut}
              className="mt-2 text-sm text-[#3ea6ff] hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-[#212121] flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="font-medium">Sign in to get the most out of YouTube</p>
            <p className="text-sm text-[#AAAAAA] mt-1">Save history and personalize your feed.</p>
          </div>
          <button
            type="button"
            onClick={openSignIn}
            className="flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-1.5 text-sm font-medium hover:bg-[#3ea6ff]/10"
          >
            <i className="fa-regular fa-circle-user"></i>
            Sign in
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Link
          to="/history"
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#272727]"
        >
          <i className="fa-solid fa-clock-rotate-left w-6 text-center"></i>
          <div>
            <p>History</p>
            <p className="text-xs text-[#AAAAAA]">{history.length} videos</p>
          </div>
        </Link>
        <Link to="/Subscriptions" className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#272727]">
          <i className="fa-solid fa-bell w-6 text-center"></i>
          <p>Subscriptions</p>
        </Link>
        <Link to="/shorts" className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#272727]">
          <i className="fa-solid fa-film w-6 text-center"></i>
          <p>Your Shorts</p>
        </Link>
      </div>
    </div>
  )
}

export default Self
