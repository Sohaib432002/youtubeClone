import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useWatchHistory } from '../../Hooks/HistoryContext'

const History = () => {
  const { history, clearHistory, removeFromHistory } = useWatchHistory()
  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)

  useEffect(() => {
    setisShowScrollbar(true)
  }, [setisShowScrollbar])

  const leftPad =
    isShowLeftbar && windowResize >= 1200 ? 'md:ml-[15rem]' : 'md:ml-[5rem]'

  return (
    <div className={`min-h-screen pt-[110px] pb-20 px-3 sm:px-4 ${leftPad}`}>
      <div className="flex items-center justify-between mb-4 max-w-4xl">
        <h1 className="text-white text-xl sm:text-2xl font-semibold">Watch history</h1>
        {history.length > 0 ? (
          <button
            type="button"
            onClick={clearHistory}
            className="text-sm text-[#3ea6ff] hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {history.length === 0 ? (
        <div className="text-[#AAAAAA] py-16 text-center">
          <i className="fa-solid fa-clock-rotate-left text-4xl mb-3 opacity-50"></i>
          <p className="text-white text-lg mb-1">No watch history yet</p>
          <p className="text-sm">Videos you watch will show up here.</p>
          <Link to="/" className="inline-block mt-4 text-[#3ea6ff] text-sm hover:underline">
            Browse videos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-4xl">
          {history.map((item) => (
            <div
              key={`${item.videoId}-${item.watchedAt}`}
              className="flex gap-3 group relative"
            >
              <Link to={`/Video/${item.videoId}`} className="flex gap-3 flex-1 min-w-0">
                <div className="w-[160px] sm:w-[246px] flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-[#272727]">
                  <img
                    src={item.thumbnail || '/favicon.ico'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 py-1">
                  <p className="text-white text-sm sm:text-base line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-2 mt-2 text-[#AAAAAA] text-xs sm:text-sm">
                    {item.channelLogo ? (
                      <img src={item.channelLogo} alt="" className="w-5 h-5 rounded-full" />
                    ) : null}
                    <span className="truncate">{item.channelTitle}</span>
                  </div>
                  <p className="text-[#666] text-xs mt-1">
                    Watched {new Date(item.watchedAt).toLocaleString()}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                title="Remove"
                onClick={() => removeFromHistory(item.videoId)}
                className="opacity-0 group-hover:opacity-100 text-[#AAAAAA] hover:text-white p-2 self-start"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History
