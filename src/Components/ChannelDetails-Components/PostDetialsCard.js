import React from 'react'
import { Link } from 'react-router-dom'

const PostDetialsCard = () => {
  return (
    <Link to="/post/1">
      <div className="m-10 grid [grid-template-columns:auto_1fr_auto] cursor-pointer border bg-gray-600 rounded-lg">
        {/* Left Avatar */}
        <img
          src="https://wallpapers.com/images/hd/cool-profile-picture-paper-bag-head-4co57dtwk64fb7lv.jpg"
          className="rounded-full m-2"
          alt="profile"
          width={30}
        />

        {/* Middle Content */}
        <div className="flex max-w-[500px] flex-col p-1 justify-start text-[12px]">
          <span className="cursor-pointer">Junaid Akram • 10 months ago</span>

          <p className="my-1">
            We recently hosted an impactful event on countering human smuggling and trafficking,
            shedding light on the harsh realities faced by those who undertake this terrifying
            journey. Our discussion explored the severe risks and exploitation involved, as well as
            ways to address this urgent issue. A special thanks to Good Will Karavan, along with
            Iqbal Ahmed ....
          </p>

          <img
            src="https://media.istockphoto.com/id/1285124274/photo/middle-age-man-portrait.jpg?s=612x612&w=0&k=20&c=D14m64UChVZyRhAr6MJW3guo7MKQbKvgNVdKmsgQ_1g="
            className="mx-3 rounded-lg"
            width={1000}
            alt="post"
          />

          {/* Actions */}
          <div className="flex justify-start mt-2">
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
              <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1 rounded-full">
                <i className="fa-regular fa-message mx-1"></i>
              </span>
            </span>
          </div>
        </div>

        {/* Right Menu */}
        <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1 rounded-full">
          <i className="fa-solid fa-ellipsis-vertical mx-1"></i>
        </span>
      </div>
    </Link>
  )
}

export default PostDetialsCard
