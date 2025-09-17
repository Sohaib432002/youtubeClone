import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Commenter = ({ setwriteComment, setComment, writeComment, commentData }) => {
  const [activeReplyId, setActiveReplyId] = useState(null)

  // Convert ISO date → "Sep, 2024"
  function DateConverter(currentDate) {
    const date = new Date(currentDate)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${months[date.getMonth()]}, ${date.getFullYear()}`
  }

  return (
    <>
      {commentData?.items?.map((item) => {
        const comment = item.snippet.topLevelComment.snippet
        const commentId = item.id

        return (
          <Link key={commentId} to={`/${comment.authorChannelUrl || ''}`} className="block">
            <div className="flex my-3 text-[15px]">
              {/* Author Image */}
              <div className="flex items-start mr-3">
                <img
                  alt={comment.authorDisplayName}
                  width={50}
                  className="rounded-full"
                  src={comment.authorProfileImageUrl}
                />
              </div>

              {/* Comment Body */}
              <div className="flex grow flex-col">
                {/* Header */}
                <div className="flex items-center">
                  <b className="mr-3">{comment.authorDisplayName}</b>
                  <span className="text-gray-400">{DateConverter(comment.publishedAt)}</span>
                </div>

                {/* Content */}
                <p className="ml-[10px]">{comment.textDisplay}</p>

                {/* Actions */}
                <div className="flex flex-col mx-3 my-1">
                  <div className="flex items-center">
                    {/* Like */}
                    <div title="like" className="flex items-center mx-2">
                      <i className="fa-regular fa-thumbs-up mx-1 cursor-pointer hover:text-blue-400"></i>
                      <span className="text-gray-500">{comment.likeCount}</span>
                    </div>

                    {/* Dislike */}
                    <div title="dislike" className="flex items-center mx-2">
                      <i className="fa-regular fa-thumbs-down cursor-pointer hover:text-red-400"></i>
                    </div>

                    {/* Reply Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault() // prevent Link navigation
                        setActiveReplyId(activeReplyId === commentId ? null : commentId)
                      }}
                      className="px-3 py-1 rounded-full hover:bg-[#414140]"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Reply Box */}
                  {activeReplyId === commentId && (
                    <div className="flex flex-col mt-2">
                      <div className="flex items-center">
                        <img
                          alt="You"
                          src="../../favicon.ico"
                          width={30}
                          className="rounded-full"
                        />
                        <input
                          type="text"
                          value={writeComment}
                          onChange={(e) => setwriteComment(e.target.value)}
                          className="w-full px-3 py-1 bg-transparent outline-none border-b ml-2"
                          placeholder="Write a reply..."
                        />
                      </div>

                      <div className="flex justify-end my-2">
                        <button
                          onClick={() => {
                            setwriteComment('')
                            setComment(false)
                            setActiveReplyId(null)
                          }}
                          className="px-4 py-2 mx-1 rounded-full bg-[#272727] hover:bg-[#414140]"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={!writeComment.trim()}
                          className={`px-4 py-2 mx-1 rounded-full ${
                            writeComment.trim()
                              ? 'bg-[#272727] hover:bg-[#414140] cursor-pointer'
                              : 'bg-gray-700 text-[#6C6C6C] cursor-not-allowed'
                          }`}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default Commenter
