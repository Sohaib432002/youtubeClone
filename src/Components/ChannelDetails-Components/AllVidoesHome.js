import { useEffect, useState } from 'react'
import ChannelCrousel from './ChannelCrousel'
import Crousel from './Crousel'
import PostCrousel from './PostCrousel'

const AllVideosHome = () => {
  const [videolistData, setVideolistData] = useState([])
  const [forYouVideolistData, setForYouVideolistData] = useState([])
  const [otherChannelistData, setOtherChannelistData] = useState([])
  const [postslistData, setPostslistData] = useState([])
  const API_KEY = 'AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY'
  const MAIN_CHANNEL = useEffect(() => {
    // 🔹 Fetch "For You" videos (latest from main channel)
    const fetchForYouVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${MAIN_CHANNEL}&part=snippet,id&order=date&maxResults=10`
        )
        const data = await res.json()
        setForYouVideolistData(data.items || [])
      } catch (error) {
        console.error('Error fetching for you videos:', error)
      }
    }

    // 🔹 Fetch "Videos" (trending / popular)
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

    const fetchPosts = async () => {
      setPostslistData([
        { id: 1, title: 'Post 1', content: 'This is a sample post.' },
        { id: 2, title: 'Post 2', content: 'Another post example.' },
      ])
    }

    fetchForYouVideos()
    fetchVideos()
    fetchPosts()
  }, [])
  console.log('FOR-YOU-VIDEOLIST', forYouVideolistData)
  console.log('VIDEOLIST', videolistData)
  console.log('otherChannelistData', otherChannelistData)
  return (
    <div className="text-white">
      <h1 className="font-extrabold text-[20px] my-4 font-sans">For you</h1>
      <Crousel videos={forYouVideolistData} />

      <hr />
      <h1 className="font-extrabold text-[20px] my-4 font-sans">Videos</h1>
      <Crousel videos={videolistData} />

      <hr />
      <div className="flex justify-between items-center my-3 mx-2">
        <h1 className="font-extrabold text-[20px] my-4 font-sans">Other Channels</h1>
        <div className="btn-channel px-3 py-3 hover:bg-blue-300 text-blue-600 font-sans font-bold rounded-full cursor-pointer text-[14px] flex justify-center items-center">
          <span>View All</span>
        </div>
      </div>
      <ChannelCrousel channels={otherChannelistData} />

      <hr />
      <h1 className="font-extrabold text-[20px] my-4 font-sans">Posts</h1>
      <PostCrousel posts={postslistData} />
    </div>
  )
}

export default AllVideosHome
