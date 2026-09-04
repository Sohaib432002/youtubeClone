import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../Hooks/ThemeContext'
import { useAuth } from '../../Hooks/AuthContext'
import { getChannelLogoMap, searchVideos } from '../../utils/youtubeApi'

const Subscriptions = () => {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const { isSignedIn, openSignIn } = useAuth()
  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const data = await searchVideos('popular channels', 20)
      if (cancelled) return
      const items = data?.items || []
      const unique = []
      const seen = new Set()
      items.forEach((v) => {
        const id = v.snippet?.channelId
        if (id && !seen.has(id)) {
          seen.add(id)
          unique.push({
            channelId: id,
            title: v.snippet.channelTitle,
          })
        }
      })
      const logos = await getChannelLogoMap(unique.map((c) => c.channelId))
      if (!cancelled) {
        setChannels(unique.map((c) => ({ ...c, logo: logos[c.channelId] || '/favicon.ico' })))
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const leftPad =
    isShowLeftbar && windowResize >= 1200 ? 'md:ml-[15rem]' : 'md:ml-[5rem]'

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-4 ${leftPad} text-white`}>
      <h1 className="text-xl font-semibold mb-4">Subscriptions</h1>
      {!isSignedIn ? (
        <div className="mb-6 p-4 rounded-xl bg-[#212121] flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#AAAAAA]">Sign in to manage subscriptions.</p>
          <button
            type="button"
            onClick={openSignIn}
            className="border border-[#3ea6ff] text-[#3ea6ff] rounded-full px-4 py-1 text-sm"
          >
            Sign in
          </button>
        </div>
      ) : null}

      {loading ? (
        <p className="text-[#AAAAAA]">Loading channels...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {channels.map((ch) => (
            <Link
              key={ch.channelId}
              to={`/channel/${ch.channelId}`}
              className="flex flex-col items-center p-3 rounded-xl hover:bg-[#272727] text-center"
            >
              <img src={ch.logo} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" />
              <p className="mt-2 text-sm line-clamp-2">{ch.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Subscriptions
