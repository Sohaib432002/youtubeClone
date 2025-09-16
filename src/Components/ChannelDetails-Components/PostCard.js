import React from 'react'
import { Link } from 'react-router'

const PostCard = () => {
  return (
    <Link>
      <div className="w-[500px] px-3 py-1 my-3 mx-2 cursor-pointer border-[1px] bg-gray-600 rounded-lg ">
        <div className="flex justify-start text-[12px] cursor-pointer items-center ">
          {' '}
          <img
            src={
              'https://wallpapers.com/images/hd/cool-profile-picture-paper-bag-head-4co57dtwk64fb7lv.jpg'
            }
            className="rounded-full mr-2"
            alt=""
            width={50}
          />
          <span className="cursor-pointer ">Junaid Akram 10 months Ago</span>
        </div>
        <div className="flex justify-between items-center text-[13px] p-1">
          <p>
            We recently hosted an impactful event on countering human smuggling
            and trafficking, shedding light on the harsh realities faced by
            those who undertake this terrifying journey. Our discussion explored
            the severe risks and exploitation involved, as well as ways to
            address this urgent issue. A special thanks to Good Will Karavan,
            along with Iqbal Ahmed ....
          </p>
          <img
            src={
              'https://media.istockphoto.com/id/1285124274/photo/middle-age-man-portrait.jpg?s=612x612&w=0&k=20&c=D14m64UChVZyRhAr6MJW3guo7MKQbKvgNVdKmsgQ_1g='
            }
            className="mx-3 rounded-lg"
            width={200}
            alt=""
          />
        </div>
        <div className="flex justify-between">
          <span className="flex justify-between items-center">
            <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1  rounded-full">
              <i className="fa-regular   mx-1 fa-thumbs-up"></i>
            </span>
            <span>123</span>
            <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1  rounded-full">
              <i className="fa-regular   mx-1 fa-thumbs-down"></i>
            </span>
          </span>
          <span className="flex">
            <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1  rounded-full">
              <i class="fa-solid mx-1 fa-share"></i>
            </span>
            <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1  rounded-full">
              <i class="fa-regular mx-1 fa-message"></i>
            </span>
            <span className="hover:bg-gray-500 cursor-pointer mx-1 py-1  rounded-full">
              <i class="fa-solid mx-1 fa-ellipsis-vertical"></i>
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
