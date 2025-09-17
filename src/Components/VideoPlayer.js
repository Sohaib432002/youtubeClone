import { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CallContext } from '../Hooks/CallingCotext'
import { ThemeContext } from '../Hooks/ThemeContext'
import Comments from './PlayerComponent/Comments'
import Player from './PlayerComponent/Player'
import RelatedVideos from './PlayerComponent/RelatedVideosList'
import VideoDescription from './PlayerComponent/subComponents/VideoDescription'

const VideoPlayer = () => {
  const location = useLocation()
  const { id, text } = useParams()

  const [fetchData, setFetchData] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [commentData, setCommentData] = useState([])
  const [randomVideosData, setRandomVideosData] = useState([])
  const [update, setUpdate] = useState(Math.random())

  const apikey = 'AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY'

  const { isShowLeftbar, windowResize, setisShowScrollbar } = useContext(ThemeContext)
  const { directSearch } = useContext(CallContext)

  useEffect(() => {
    setisShowScrollbar(false)

    if (location.state) {
      // Agar state already available hai to use karo
      setFetchData(location.state)
      return
    }

    // 1) Fetch Video Data
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${apikey}`
    )
      .then((res) => res.json())
      .then((data) => setFetchData(data))
      .catch(() => setNotFound(true))

    // 2) Fetch Comments
    fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&maxResults=50&key=${apikey}`
    )
      .then((res) => res.json())
      .then((data) => setCommentData(data))
      .catch(() => setNotFound(true))

    // 3) Fetch Related Videos
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${text}&maxResults=25&key=${apikey}`
    )
      .then((res) => res.json())
      .then((data) => setRandomVideosData(data))
      .catch(() => setNotFound(true))
  }, [update, id, text, location, apikey, setisShowScrollbar])

  console.log('Direct Search Check:', directSearch)

  return (
    <div
      className={`grid text-[#AAAAAA] max-w-[1666px] bg-[#0f0f0f] m-auto VideoPlayer pt-[119px]`}
    >
      <div className={`flex flex-col ${windowResize <= 1170 ? ' grid-rows-3' : ''} max-w-[1500px]`}>
        <Player fetchData={fetchData} />
        <VideoDescription fetchData={fetchData} />
        <div className="comments-section">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>

      <div>
        <RelatedVideos setupdate={setUpdate} randomVideosData={randomVideosData} />
        <div className="comments-section-bottom">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
