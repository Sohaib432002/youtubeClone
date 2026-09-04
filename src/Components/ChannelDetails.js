import { useContext, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'
import { getChannelsByIds, searchVideos } from '../utils/youtubeApi'
import { CHANNELS, VIDEOS, toSearchItem } from '../data/mockCatalog'
import ChannelBanner from './ChannelDetails-Components/ChannelBanner'
import ChannelIntro from './ChannelDetails-Components/ChannelIntro'
import OptionsSelection from './ChannelDetails-Components/OptionsSelection'

const ChannelDetails = () => {
  const { channelId } = useParams()
  const { setisShowScrollbar } = useContext(ThemeContext)
  const [channelData, setChannelData] = useState(null)
  const [channelVideos, setChannelVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  useEffect(() => {
    let cancelled = false
    const id = channelId || 'ch_campusx'

    const load = async () => {
      setLoading(true)
      const local = CHANNELS.find((c) => c.id === id)
      if (local) {
        const fake = {
          id: local.id,
          snippet: {
            title: local.title,
            customUrl: local.handle,
            description: `Welcome to ${local.title}. ${local.subscribers} subscribers.`,
            thumbnails: {
              high: { url: local.avatar },
              medium: { url: local.avatar },
              default: { url: local.avatar },
            },
          },
          statistics: {
            subscriberCount: local.subscribers,
            videoCount: String(VIDEOS.filter((v) => v.channelId === local.id).length),
          },
          brandingSettings: {
            channel: { title: local.title },
            image: {},
          },
        }
        const vids = VIDEOS.filter((v) => v.channelId === local.id).map(toSearchItem)
        if (!cancelled) {
          setChannelData(fake)
          setChannelVideos(vids)
          setLoading(false)
        }
        return
      }

      try {
        const data = await getChannelsByIds([id])
        if (cancelled) return
        if (data?.items?.length) {
          setChannelData(data.items[0])
          const title = data.items[0].snippet?.title || ''
          const videos = await searchVideos(title, 24)
          if (!cancelled) setChannelVideos(videos?.items || [])
        } else {
          setChannelData(null)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [channelId])

  if (loading) return <p className="text-white p-5 pt-24">Loading Channel Details...</p>
  if (!channelData) return <p className="text-white p-5 pt-24">No Channel Data Found</p>

  const bannerExternalUrl = channelData?.brandingSettings?.image?.bannerExternalUrl
  const ChannelPic =
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.medium?.url ||
    channelData?.snippet?.thumbnails?.default?.url

  return (
    <div className="pt-20 md:pl-20 px-3 sm:px-4 channelDetail max-w-[1300px] m-auto w-full overflow-x-hidden pb-20">
      {bannerExternalUrl ? <ChannelBanner bannerExternalUrl={bannerExternalUrl} /> : null}
      <ChannelIntro ChannelPic={ChannelPic} channelData={channelData} />
      <OptionsSelection channelId={channelId} />
      <Outlet context={{ channelData, channelVideos }} />
    </div>
  )
}

export default ChannelDetails
