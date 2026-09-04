import React, { useEffect, useState } from 'react'
import Commenter from './subComponents/Commenter'
import CommentSkel from './subComponents/CommentSkel'
import { useAuth } from '../../Hooks/AuthContext'
import { formatViews } from '../../utils/format'

const Comments = ({ fetchData, commentData }) => {
  const { user, isSignedIn, openSignIn } = useAuth()
  const [isCommenting, setIsCommenting] = useState(false)
  const [sortOptions, setSortOptions] = useState(false)
  const [sortBy, setSortBy] = useState('top')
  const [writeComment, setWriteComment] = useState('')
  const [localComments, setLocalComments] = useState([])

  useEffect(() => {
    setLocalComments([])
  }, [fetchData?.items?.[0]?.id])

  const channelName = user?.name || 'YouTubeClone User'
  const channelId = user?.handle || `@${(user?.name || 'user').toLowerCase().replace(/\s+/g, '')}`

  const baseItems = commentData?.items || []
  const mergedItems = [
    ...localComments,
    ...baseItems,
  ]

  const sortedItems = [...mergedItems].sort((a, b) => {
    if (sortBy === 'newest') {
      const da = new Date(a.snippet?.topLevelComment?.snippet?.publishedAt || 0)
      const db = new Date(b.snippet?.topLevelComment?.snippet?.publishedAt || 0)
      return db - da
    }
    const la = a.snippet?.topLevelComment?.snippet?.likeCount || 0
    const lb = b.snippet?.topLevelComment?.snippet?.likeCount || 0
    return lb - la
  })

  const startComment = () => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    setIsCommenting(true)
  }

  const postComment = () => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    if (!writeComment.trim()) return
    const entry = {
      id: `local_${Date.now()}`,
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: channelName,
            authorProfileImageUrl: user.avatar,
            textDisplay: writeComment.trim(),
            publishedAt: new Date().toISOString(),
            likeCount: 0,
            authorChannelId: channelId,
          },
        },
      },
    }
    setLocalComments((prev) => [entry, ...prev])
    setWriteComment('')
    setIsCommenting(false)
  }

  if (!commentData) {
    return <CommentSkel commentData={commentData} />
  }

  const count =
    Number(fetchData?.items?.[0]?.statistics?.commentCount || 0) + localComments.length

  return (
    <div className="max-w-[1227px] player text-white rounded-[10px] mx-2 sm:mx-4 md:ml-6 lg:ml-0 mt-4">
      <div className="flex relative text-[16px] p-1 sm:p-2 items-center gap-4">
        <h2 className="text-xl font-bold">{formatViews(count)} Comments</h2>
        <button
          type="button"
          className="cursor-pointer flex items-center gap-2 text-sm font-medium"
          onClick={() => setSortOptions(!sortOptions)}
        >
          <i className="fa-solid fa-align-left"></i>
          Sort by
        </button>
        {sortOptions ? (
          <div className="absolute z-30 left-28 top-10 bg-[#282828] rounded-xl shadow-lg overflow-hidden min-w-[180px]">
            <button
              type="button"
              className={`w-full text-left px-4 py-2.5 hover:bg-[#3f3f3f] ${
                sortBy === 'top' ? 'bg-[#3f3f3f]' : ''
              }`}
              onClick={() => {
                setSortBy('top')
                setSortOptions(false)
              }}
            >
              Top comments
            </button>
            <button
              type="button"
              className={`w-full text-left px-4 py-2.5 hover:bg-[#3f3f3f] ${
                sortBy === 'newest' ? 'bg-[#3f3f3f]' : ''
              }`}
              onClick={() => {
                setSortBy('newest')
                setSortOptions(false)
              }}
            >
              Newest first
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col text-sm mt-4">
        {isCommenting && isSignedIn ? (
          <div>
            <p className="text-[#aaa] text-xs mb-2">Commenting as</p>
            <div className="flex items-center gap-3 mb-3">
              <img
                alt="profile"
                src={user.avatar}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-base">{channelName}</span>
                <span className="text-[#aaa] text-xs">{channelId}</span>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[#272727] text-[#aaa]"
                title="Edit profile"
                onClick={openSignIn}
              >
                <i className="fa-solid fa-pencil text-sm"></i>
              </button>
            </div>

            <input
              type="text"
              value={writeComment}
              onChange={(e) => setWriteComment(e.target.value)}
              className="w-full px-1 py-2 bg-transparent outline-none border-b border-[#3f3f3f] focus:border-white text-base"
              placeholder="Write a comment..."
              autoFocus
            />

            <div className="flex justify-end gap-2 my-3">
              <button
                type="button"
                onClick={() => {
                  setWriteComment('')
                  setIsCommenting(false)
                }}
                className="px-4 py-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={postComment}
                disabled={!writeComment.trim()}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  writeComment.trim()
                    ? 'bg-[#3ea6ff] text-black hover:bg-[#65b8ff]'
                    : 'bg-[#272727] text-[#717171] cursor-not-allowed'
                }`}
              >
                Comment
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img
              alt="profile"
              src={isSignedIn ? user.avatar : '/favicon.ico'}
              className="rounded-full object-cover w-10 h-10"
            />
            <button
              type="button"
              onClick={startComment}
              className="bg-transparent text-left cursor-pointer border-b border-[#3f3f3f] w-full outline-none text-[#aaa] py-2 hover:border-[#717171]"
            >
              {isSignedIn ? 'Add a comment...' : 'Sign in to comment'}
            </button>
          </div>
        )}
      </div>

      {sortedItems.length === 0 ? (
        <p className="text-[#aaa] text-sm py-8">No comments yet. Be the first to comment.</p>
      ) : (
        <Commenter
          commentContent={''}
          setWriteComment={setWriteComment}
          setComment={setIsCommenting}
          writeComment={writeComment}
          commentData={{ items: sortedItems }}
        />
      )}
    </div>
  )
}

export default Comments
