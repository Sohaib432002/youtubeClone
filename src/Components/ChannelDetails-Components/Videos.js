import { useEffect, useState } from 'react'
import VideoCard from './subComponents/VideoCard'

const Videos = () => {
  const [vidoelistData, setVideolistData] = useState([])
  const API_KEY = 'AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY'
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=100&key=${API_KEY}`
        )
        const data = await res.json()
        setVideolistData(data.items || [])
      } catch (error) {
        console.error('Error fetching videos:', error)
      }
    }
    fetchVideos()
  }, [])
  return (
    <>
      <div className="grid vidocardlist grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-5">
        {vidoelistData.map((item)=>{
              return(
                <VideoCard item={item} />
              )
        })}
      </div>
    </>
  )
}

export default Videos
