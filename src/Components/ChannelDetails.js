import { useContext, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'
import { getChannelsByIds, searchVideos } from '../utils/youtubeApi'
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
    const id = channelId || 'UC_x5XG1OV2P6uZZ5FSM9Ttw'

    const load = async () => {
      setLoading(true)
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
