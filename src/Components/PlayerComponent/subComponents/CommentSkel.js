import React from 'react'

const CommentSkel = ({ commentData }) => {
  console.log('CommentData--------------', commentData)
  console.log(!Array.isArray(commentData))
  const skeletonCount = 4

  return (
    <>
      {!Array.isArray(commentData) ? (
        <div>
          <h1 className="text-white">Comments are Disabled</h1>
        </div>
      ) : (
        <div className="max-w-[1227px] player text-[20px] text-[#FFFFFF] aspect-video overflow-hidden rounded-[10px] ml-20">
          {console.log('han')}
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="flex items-center mb-3">
              <p className="w-[10%] rounded-full flex-inline m-3 bg-gray-700 h-[7vh]"></p>

              <div className="flex flex-col w-[100%]">
                <div
                  className={`bg-gray-700 h-[2vh] rounded-full ${
                    index % 2 === 0 ? 'w-[30%]' : 'w-[50%]'
                  }`}
                ></div>
                <div
                  className={`bg-gray-700 my-1 h-[2vh] rounded-full ${
                    index % 2 === 0 ? 'w-[5%]' : 'w-[10%]'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CommentSkel
