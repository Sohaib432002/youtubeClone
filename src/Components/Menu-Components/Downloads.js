import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { timeAgo } from '../../utils/format'

const Downloads = () => {
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
  const [items, setItems] = useState([])

  useEffect(() => {
    setisShowScrollbar(false)
    try {
      setItems(JSON.parse(localStorage.getItem('yt_clone_downloads') || '[]'))
    } catch {
      setItems([])
    }
  }, [setisShowScrollbar])

  const clearAll = () => {
    localStorage.removeItem('yt_clone_downloads')
    setItems([])
  }

  const leftPad =
    windowResize < 768 ? 'ml-0' : isShowLeftbar ? 'md:ml-[240px]' : 'md:ml-[72px]'

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-4 ${leftPad} text-white max-w-4xl`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Downloads</h1>
        {items.length ? (
          <button type="button" onClick={clearAll} className="text-sm text-[#3ea6ff]">
            Clear all
          </button>
        ) : null}
      </div>

      {!items.length ? (
        <div className="text-center py-16 text-[#aaa]">
          <i className="fa-solid fa-download text-4xl mb-3 opacity-40"></i>
          <p className="text-white text-lg mb-1">No downloads yet</p>
          <p className="text-sm">Videos you download will appear here.</p>
          <Link to="/" className="inline-block mt-4 text-[#3ea6ff] text-sm">
            Browse videos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Link
              key={`${item.videoId}-${item.downloadedAt}`}
              to={`/Video/${item.videoId}`}
              className="flex gap-3 hover:bg-[#1a1a1a] rounded-xl p-2"
            >
              <div className="w-40 sm:w-56 aspect-video rounded-lg overflow-hidden bg-[#272727] flex-shrink-0">
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 py-1">
                <p className="line-clamp-2 text-sm sm:text-base">{item.title}</p>
                <p className="text-xs text-[#aaa] mt-2">
                  Downloaded {timeAgo(item.downloadedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Downloads
