import React from 'react'
import VideoReviewOptions from './subComponents/VideoReviewOptions'
import PlayerSkeleton from './PlayerSkeleton'
import { useParams } from 'react-router-dom'

const Player = ({ fetchData, channelData }) => {
  const { id } = useParams()

  // If no video data, show skeleton loader
  if (!fetchData) {
    return <PlayerSkeleton />
  }

  return (
    <>
      <div className="w-full player aspect-video overflow-hidden rounded-none sm:rounded-[12px] mx-auto bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={fetchData?.snippet?.title || 'YouTube video player'}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      {/* Review Options */}
      <VideoReviewOptions fetchData={fetchData} channelData={channelData} />
    </>
  )
}

export default Player
