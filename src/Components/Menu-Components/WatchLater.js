import { useContext, useEffect } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useAuth } from '../../Hooks/AuthContext'
import { useWatchLater } from '../../Hooks/WatchLaterContext'
import LibraryVideoList from '../ui/LibraryVideoList'

const WatchLater = () => {
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
  const { isSignedIn, openSignIn } = useAuth()
  const { watchLater, removeFromWatchLater } = useWatchLater()

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`min-h-screen pt-[100px] pb-24 px-4 ${leftPad} text-white max-w-5xl`}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Watch later</h1>
        <p className="text-sm text-[#aaa] mt-1">
          {isSignedIn
            ? `${watchLater.length} video${watchLater.length === 1 ? '' : 's'}`
            : 'Sign in to save videos for later'}
        </p>
      </div>

      {!isSignedIn ? (
        <div className="text-center py-16 rounded-2xl bg-[#181818] border border-[#272727]">
          <i className="fa-regular fa-clock text-4xl mb-3 text-[#555]"></i>
          <p className="text-white text-lg mb-1">Sign in to use Watch later</p>
          <p className="text-sm text-[#aaa] mb-4">
            Save videos and come back anytime on this device.
          </p>
          <button
            type="button"
            onClick={openSignIn}
            className="inline-flex items-center gap-2 border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#3ea6ff]/10"
          >
            <i className="fa-regular fa-circle-user"></i>
            Sign in
          </button>
        </div>
      ) : (
        <LibraryVideoList
          items={watchLater}
          emptyIcon="fa-regular fa-clock"
          emptyTitle="No videos in Watch later"
          emptyHint="Save videos from the menu or player to watch them later."
          onRemove={removeFromWatchLater}
          removeTitle="Remove from Watch later"
          dateKey="savedAt"
          dateLabel="Saved"
        />
      )}
    </div>
  )
}

export default WatchLater
