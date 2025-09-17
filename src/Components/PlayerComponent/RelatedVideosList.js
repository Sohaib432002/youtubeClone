import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../Hooks/ThemeContext'
import Scrollbar from '../Navbar-Components/ScrollBar'
import RelatedVideosShel from './subComponents/RelatedVideosShel'
import RelatedVidosCard from './subComponents/RelatedVidosCard'

const RelatedVideos = ({ randomVideosData, setupdate }) => {
  const { windowResize } = useContext(ThemeContext)

  const idslistVidos =
    randomVideosData?.items?.map((item) => item?.id?.videoId).filter(Boolean) || []

  const idslistChaneels =
    randomVideosData?.items?.map((item) => item?.snippet?.channelId).filter(Boolean) || []

  const apikeyClone2 = 'AIzaSyC6eVSk2EOI3cu9SzITToFW1s0z2ns-eg0'
  const [RelatedVidoesChannelsData, setRelatedVideosChannelsData] = useState([])

  useEffect(() => {
    if (idslistChaneels.length < 1) return

    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${idslistChaneels.join(
        ','
      )}&key=${apikeyClone2}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRelatedVideosChannelsData(data)
      })
      .catch((err) => console.error('error', err))
  }, [idslistChaneels])

  return (
    <>
      {randomVideosData?.items?.length === 0 || idslistChaneels.length === 0 ? (
        <RelatedVideosShel windowResize={windowResize} />
      ) : (
        <div className={`${windowResize >= 1170 ? 'max-w-[370px]' : ''} mx-3 grid`}>
          {/* Scrollbar */}
          <div className="mx-6 overflow-hidden">
            <Scrollbar OptionsList={[1, 2, 3, 4, 5, 6, 7, 8]} />
          </div>

          {/* Videos + Channels */}
          <div
            className={`${windowResize < 1170 ? 'grid-cols-3' : ''} ${
              windowResize >= 1170 ? 'flex flex-col justify-center' : 'grid gap-3'
            } ${windowResize <= 770 ? 'grid-cols-2' : ''} ${
              windowResize <= 570 ? 'grid-cols-1' : ''
            }`}
          >
            {[...(randomVideosData?.items || []), ...(RelatedVidoesChannelsData?.items || [])].map(
              (item) => {
                const isVideo = item.id?.videoId !== undefined
                const isChannel = item.kind?.includes('youtube#channel')

                return (
                  <RelatedVidosCard
                    key={item.id?.videoId || item.id}
                    setupdate={setupdate}
                    item={item}
                    windowResize={windowResize}
                    type={isVideo ? 'video' : isChannel ? 'channel' : 'unknown'}
                  />
                )
              }
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default RelatedVideos
