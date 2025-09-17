import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const listbtnIcons = ['flag']
const listbtnNames = ['Report']

const PostDetialsCard = () => {
  const [options, setOptions] = useState(false)

  return (
    <div className="flex items-center justify-center my-7">
      <div className="m-1 flex items-start max-w-[800px] justify-between cursor-pointer border bg-gray-600 rounded-lg">
        <div className="flex justify-center p-2 items-start">
          <Link to="/profile">
            <img
              src="https://wallpapers.com/images/hd/cool-profile-picture-paper-bag-head-4co57dtwk64fb7lv.jpg"
              className="rounded-full m-2"
              alt="profile"
              width={70}
            />
          </Link>
        </div>

        <div className="flex p-3  flex-col  justify-start font-sans text-white text-[16px]">
          <Link to="/user/junaid">
            <span className="cursor-pointer">Junaid Akram • 10 months ago</span>
          </Link>

          <p className="my-1">
            We recently hosted an impactful event on countering human smuggling and trafficking...
          </p>

          <img
            src="https://media.istockphoto.com/id/1285124274/photo/middle-age-man-portrait.jpg?s=612x612&w=0&k=20&c=D14m64UChVZyRhAr6MJW3guo7MKQbKvgNVdKmsgQ_1g="
            className="rounded-lg"
            width={1000}
            alt="post"
          />

          <div className="flex justify-start items-center mt-2">
            <span className="flex items-center">
              <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1 rounded-full">
                <i className="fa-regular fa-thumbs-up mx-1"></i>
              </span>
              <span>123</span>
              <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1 rounded-full">
                <i className="fa-regular fa-thumbs-down mx-1"></i>
              </span>
            </span>

            <span className="flex ml-4">
              <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1 rounded-full">
                <i className="fa-solid fa-share mx-1"></i>
              </span>
              <Link to={'./1'}>
                <span className="hover:bg-gray-500 cursor-pointer mx-1 p-1 rounded-full">
                  <i className="fa-regular fa-message mx-1"></i>
                  <span>23</span>
                </span>
              </Link>
            </span>
          </div>
        </div>

        <span
          onClick={(e) => {
            e.stopPropagation()
            setOptions(!options)
          }}
          className="hover:bg-gray-500 relative cursor-pointer m-2 p-2 rounded-full"
        >
          <i className="fa-solid fa-ellipsis-vertical mx-1"></i>

          {options && (
            <div className="z-30 right-[20px] top-[20px] text-[16px] overflow-hidden w-[210px] bg-[#272727] rounded-lg absolute">
              {listbtnNames.map((item, i) => {
                return (
                  <div key={i} className="flex flex-col">
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        alert(`${item}, we are working on it`)
                      }}
                      className="px-4 hover:bg-[#414140] flex items-center py-2"
                    >
                      <i className={`fa-solid mx-2 fa-${listbtnIcons[i]}`}></i>
                      <p>{item}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </span>
      </div>
    </div>
  )
}

export default PostDetialsCard
