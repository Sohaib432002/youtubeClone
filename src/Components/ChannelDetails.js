import { useContext, useEffect, useState } from 'react'
import { data, Outlet } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'
import ChannelBanner from './ChannelDetails-Components/ChannelBanner'
import ChannelIntro from './ChannelDetails-Components/ChannelIntro'
import OptionsSelection from './ChannelDetails-Components/OptionsSelection'

const ChannelDetails = () => {
  const { setisShowScrollbar } = useContext(ThemeContext)
  setisShowScrollbar(false)

  const [more, setmore] = useState(false)
  const [channelData, setChannelData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Replace with your own API KEY + Channel ID
  const API_KEY = 'AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY'
  const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw' // Example: Google Developers

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,statistics&id=${CHANNEL_ID}&key=${API_KEY}`
        )
        const data = await res.json()

        if (data.items && data.items.length > 0) {
          setChannelData(data.items[0]) // Save first item
        }
      } catch (err) {
        console.error('Error fetching channel data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchChannelData()
  }, [])
  console.log(channelData)
  if (loading) return <p className="text-white p-5">Loading Channel Details...</p>
  if (!channelData) return <p className="text-white p-5">No Channel Data Found</p>

  const bannerExternalUrl = channelData?.brandingSettings?.image?.bannerExternalUrl
  const ChannelPic = channelData?.snippet?.thumbnails?.high?.url

  return (
    <>
      <div className="pt-20 pl-20 channelDetail max-w-[1300px] m-[auto]">
        {bannerExternalUrl && <ChannelBanner bannerExternalUrl={bannerExternalUrl} />}
        {ChannelPic && (
          <ChannelIntro ChannelPic={ChannelPic} channelData={channelData} setmore={setmore} />
        )}
        <OptionsSelection />
        <Outlet />
      </div>
    </>
  )
}

export default ChannelDetails
