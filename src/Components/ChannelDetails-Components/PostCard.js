import { Link } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/format'

const PostCard = ({ post, to }) => {
  if (!post) return null
  const href = to || (post.channelId ? `/channel/${post.channelId}/Posts/${post.id}` : '#')

  return (
    <Link
      to={href}
      className="flex-shrink-0 w-[320px] sm:w-[380px] rounded-xl border border-[#3f3f3f] bg-[#181818] p-4 hover:bg-[#1f1f1f] text-white"
    >
      <div className="flex items-center gap-2 text-[13px] text-[#aaa]">
        <img
          src={post.channelAvatar || '/favicon.ico'}
          alt=""
          className="w-8 h-8 rounded-full object-cover bg-[#272727]"
        />
        <span className="text-[#f1f1f1] font-medium truncate">{post.channelTitle}</span>
        <span>•</span>
        <span className="whitespace-nowrap">{timeAgo(post.publishedAt)}</span>
      </div>
      <p className="text-sm mt-3 whitespace-pre-wrap line-clamp-4 leading-relaxed">{post.text}</p>
      {post.image ? (
        <img
          src={post.image}
          alt=""
          className="mt-3 w-full max-h-44 object-cover rounded-lg bg-[#272727]"
        />
      ) : null}
      <div className="flex items-center gap-4 mt-3 text-[#aaa] text-sm">
        <span className="flex items-center gap-1.5">
          <i className="fa-regular fa-thumbs-up"></i>
          {formatViews(post.likes)}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="fa-regular fa-thumbs-down"></i>
        </span>
        <span className="flex items-center gap-1.5">
          <i className="fa-regular fa-comment"></i>
          {formatViews(post.commentCount)}
        </span>
      </div>
    </Link>
  )
}

export default PostCard
