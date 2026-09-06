import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/format'

const PostDetialsCard = ({ post, channelData }) => {
  const { channelId } = useParams()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post?.likes || 0)
  if (!post) return null

  const avatar =
    post.channelAvatar ||
    channelData?.snippet?.thumbnails?.high?.url ||
    '/favicon.ico'
  const base = channelId ? `/channel/${channelId}` : '/CD'

  return (
    <article className="w-full max-w-[720px] rounded-xl border border-[#3f3f3f] bg-[#181818] p-4 sm:p-5 text-white">
      <div className="flex items-start gap-3">
        <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-[#272727]" />
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-medium">{post.channelTitle}</span>
            <span className="text-[#aaa]"> • {timeAgo(post.publishedAt)}</span>
          </p>
          <p className="text-[15px] mt-3 whitespace-pre-wrap leading-relaxed">{post.text}</p>
          {post.image ? (
            <img
              src={post.image}
              alt=""
              className="mt-3 w-full max-h-[420px] object-cover rounded-xl bg-[#272727]"
            />
          ) : null}
          {post.videoId ? (
            <Link
              to={`/Video/${post.videoId}`}
              className="inline-flex items-center gap-2 mt-3 text-sm text-[#3ea6ff] hover:underline"
            >
              <i className="fa-solid fa-play"></i>
              Watch video
            </Link>
          ) : null}
          <div className="flex items-center gap-1 mt-4 text-sm text-[#aaa]">
            <button
              type="button"
              className={`px-3 py-1.5 rounded-full hover:bg-[#272727] ${liked ? 'text-white' : ''}`}
              onClick={() => {
                setLiked((v) => !v)
                setLikes((n) => (liked ? n - 1 : n + 1))
              }}
            >
              <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up mr-2`}></i>
              {formatViews(likes)}
            </button>
            <button type="button" className="px-3 py-1.5 rounded-full hover:bg-[#272727]">
              <i className="fa-regular fa-thumbs-down"></i>
            </button>
            <Link
              to={`${base}/Posts/${post.id}`}
              className="px-3 py-1.5 rounded-full hover:bg-[#272727]"
            >
              <i className="fa-regular fa-comment mr-2"></i>
              {formatViews(post.commentCount)}
            </Link>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full hover:bg-[#272727]"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
              }}
            >
              <i className="fa-solid fa-share mr-2"></i>
              Share
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostDetialsCard
