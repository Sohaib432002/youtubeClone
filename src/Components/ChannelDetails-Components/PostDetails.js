import { useOutletContext } from 'react-router-dom'
import PostDetialsCard from './PostDetialsCard'

const PostDetails = () => {
  const { channelPosts = [], extrasReady = true, channelData } = useOutletContext() || {}

  if (!extrasReady) {
    return <p className="text-[#AAAAAA] py-8 text-center">Loading posts...</p>
  }

  if (!channelPosts.length) {
    return (
      <div className="text-center py-12 text-white">
        <i className="fa-regular fa-newspaper text-3xl text-[#555] mb-3"></i>
        <p className="mb-1">No posts yet</p>
        <p className="text-sm text-[#aaa]">Community posts from this channel will appear here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-6 gap-4">
      {channelPosts.map((post) => (
        <PostDetialsCard key={post.id} post={post} channelData={channelData} />
      ))}
    </div>
  )
}

export default PostDetails
