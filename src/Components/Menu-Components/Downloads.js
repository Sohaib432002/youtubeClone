import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { timeAgo } from '../../utils/format'
import {
  clearDownloads,
  downloadAndSave,
  readDownloads,
} from '../../utils/downloads'

const Downloads = () => {
  const { setisShowScrollbar, isShowLeftbar, windowResize } = useContext(ThemeContext)
  const [items, setItems] = useState([])
  const [busyId, setBusyId] = useState('')

  const refresh = () => setItems(readDownloads())

  useEffect(() => {
    setisShowScrollbar(false)
    refresh()
  }, [setisShowScrollbar])

  const clearAll = () => {
    clearDownloads()
    setItems([])
  }

  const onRedownload = async (item) => {
    setBusyId(item.videoId)
    try {
      await downloadAndSave(item)
      refresh()
    } finally {
      setBusyId('')
    }
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
            <div
              key={`${item.videoId}-${item.downloadedAt}`}
              className="flex gap-3 hover:bg-[#1a1a1a] rounded-xl p-2"
            >
              <Link
                to={`/Video/${item.videoId}`}
                className="w-40 sm:w-56 aspect-video rounded-lg overflow-hidden bg-[#272727] flex-shrink-0"
              >
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              </Link>
              <div className="min-w-0 py-1 flex-1">
                <Link to={`/Video/${item.videoId}`} className="line-clamp-2 text-sm sm:text-base hover:underline">
                  {item.title}
                </Link>
                {item.channelTitle ? (
                  <p className="text-xs text-[#aaa] mt-1">{item.channelTitle}</p>
                ) : null}
                <p className="text-xs text-[#aaa] mt-1">
                  Downloaded {timeAgo(item.downloadedAt)}
                </p>
                <button
                  type="button"
                  onClick={() => onRedownload(item)}
                  disabled={busyId === item.videoId}
                  className="mt-2 text-sm text-[#3ea6ff] hover:underline disabled:opacity-60"
                >
                  {busyId === item.videoId ? 'Downloading…' : 'Download file'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Downloads
