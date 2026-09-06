import React from 'react'
import VideoReviewOptions from './subComponents/VideoReviewOptions'
import PlayerSkeleton from './PlayerSkeleton'
import { useParams } from 'react-router-dom'

const Player = ({ fetchData, channelData }) => {
  const { id } = useParams()
  const localUrl = fetchData?.items?.[0]?.meta?.localVideoUrl
  const title = fetchData?.items?.[0]?.snippet?.title || 'YouTube video player'

  if (!fetchData) {
    return <PlayerSkeleton />
  }

  return (
    <>
      <div className="w-full player aspect-video overflow-hidden rounded-none sm:rounded-xl mx-auto bg-black shadow-lg ring-1 ring-white/5">
        {localUrl ? (
          <video
            className="w-full h-full"
            src={localUrl}
            controls
            playsInline
            poster={
              fetchData?.items?.[0]?.snippet?.thumbnails?.high?.url ||
              fetchData?.items?.[0]?.snippet?.thumbnails?.medium?.url
            }
          />
        ) : (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}?rel=0`}
            title={title}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        )}
      </div>

      <VideoReviewOptions fetchData={fetchData} channelData={channelData} />
    </>
  )
}

export default Player
