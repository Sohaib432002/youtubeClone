import { useMemo, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import PostDetialsCard from './PostDetialsCard'

const PostComments = () => {
  const { channelId, post: postId } = useParams()
  const { channelPosts = [], channelData } = useOutletContext() || {}
  const post = useMemo(
    () => (channelPosts || []).find((p) => p.id === postId) || channelPosts[0],
    [channelPosts, postId]
  )
  const [text, setText] = useState('')
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: 'Alex',
      text: 'Love this update — keep them coming.',
      at: '2 days ago',
    },
    {
      id: 'c2',
      author: 'Samira',
      text: 'Been waiting for a community post like this.',
      at: '5 days ago',
    },
  ])

  const base = channelId ? `/channel/${channelId}` : '/CD'

  if (!post) {
    return (
      <div className="text-center py-12 text-white">
        <p className="mb-3">Post not found</p>
        <Link to={`${base}/Posts`} className="text-[#3ea6ff] text-sm hover:underline">
          Back to Posts
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-[720px] mb-3">
        <Link to={`${base}/Posts`} className="text-sm text-[#3ea6ff] hover:underline">
          ← Posts
        </Link>
      </div>
      <PostDetialsCard post={post} channelData={channelData} />
      <div className="w-full max-w-[720px] mt-6 text-white">
        <h3 className="font-semibold mb-3">{comments.length} comments</h3>
        <form
          className="flex gap-2 mb-5"
          onSubmit={(e) => {
            e.preventDefault()
            const value = text.trim()
            if (!value) return
            setComments((prev) => [
              { id: `c_${Date.now()}`, author: 'You', text: value, at: 'Just now' },
              ...prev,
            ])
            setText('')
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border-b border-[#3f3f3f] py-2 text-sm outline-none focus:border-white"
          />
          <button
            type="submit"
            className="text-sm bg-[#3ea6ff] text-black font-medium rounded-full px-4 py-1.5 disabled:opacity-40"
            disabled={!text.trim()}
          >
            Comment
          </button>
        </form>
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#272727] flex items-center justify-center text-xs">
                {c.author.slice(0, 1)}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{c.author}</span>
                  <span className="text-[#aaa] ml-2">{c.at}</span>
                </p>
                <p className="text-sm mt-1 text-[#ddd]">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PostComments
