import React, { useState } from 'react'
import Commenter from './subComponents/Commenter'
import CommentSkel from './subComponents/CommentSkel'

const Comments = ({ fetchData, commentData }) => {
  const [isCommenting, setIsCommenting] = useState(false)
  const [sortOptions, setSortOptions] = useState(false)
  const [writeComment, setWriteComment] = useState('')
  const [commentContent, setCommentContent] = useState('')

  // Format numbers (1.2K, 3.4M, etc.)
  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return num.toString()
  }

  // Show skeleton if no data
  if (!commentData || !commentData.items || commentData.items.length === 0) {
    return <CommentSkel commentData={commentData} />
  }

  return (
    <div className="max-w-[1227px] player text-[20px] text-white rounded-[10px] ml-20">
      {/* Header with sort */}
      <div className="flex relative text-[16px] font-black p-5 items-center">
        <h1 className="mr-5 text-[20px]">
          {formatNumber(fetchData?.items?.[0]?.statistics?.commentCount)} Comments
        </h1>

        <span
          className="cursor-pointer flex items-center"
          onClick={() => setSortOptions(!sortOptions)}
        >
          <i className="fa-solid fa-align-left text-[16px] mx-2"></i>
          Sort by
        </span>

        {sortOptions && (
          <div className="absolute z-30 left-[171px] top-[55px] bg-[#272727] rounded-lg shadow-lg">
            <div className="flex flex-col cursor-pointer my-2">
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 flex items-center hover:bg-[#414140]"
              >
                <p>Top Comment</p>
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 flex items-center hover:bg-[#414140]"
              >
                <p>Newest Comment</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comment Input Section */}
      <div className="flex flex-col text-[14px]">
        {isCommenting ? (
          <div>
            <b>Commenting as</b>
            <div className="commenterIdentity my-3 flex items-center">
              <img alt="profile" src="../../favicon.ico" width={50} className="rounded-full" />
              <div className="flex mx-3 flex-col">
                <b>Sohaib Maqsood</b>
                <b>@ChannelId</b>
              </div>
              <div
                onClick={() => alert('Sorry, this feature is under development.')}
                className="edit p-3 mx-2 cursor-pointer rounded-full hover:bg-[#414140]"
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>

            <input
              type="text"
              value={writeComment}
              onChange={(e) => setWriteComment(e.target.value)}
              className="w-full px-3 py-1 bg-transparent outline-none border-b"
              placeholder="Write a comment..."
            />

            <div className="flex justify-end my-2">
              <button
                onClick={() => {
                  setWriteComment('')
                  setIsCommenting(false)
                }}
                className="px-4 py-2 mx-1 rounded-full bg-[#272727] hover:bg-[#414140]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (writeComment.trim()) {
                    setCommentContent(writeComment)
                    setWriteComment('')
                    setIsCommenting(false)
                  }
                }}
                className={`px-4 py-2 mx-1 rounded-full ${
                  writeComment.trim()
                    ? 'bg-[#272727] hover:bg-[#414140] cursor-pointer'
                    : 'bg-gray-700 text-[#6C6C6C] cursor-not-allowed'
                }`}
              >
                Comment
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <img alt="profile" src="../../favicon.ico" className="rounded-full" width={50} />
            <span
              onClick={() => setIsCommenting(true)}
              className="bg-transparent cursor-pointer ml-5 border-b w-full outline-none text-gray-400"
            >
              Add a comment
            </span>
          </div>
        )}
      </div>

      {/* Comment List */}
      <Commenter
        commentContent={commentContent}
        setWriteComment={setWriteComment}
        setComment={setIsCommenting}
        writeComment={writeComment}
        commentData={commentData}
      />
    </div>
  )
}

export default Comments
