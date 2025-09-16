import React from 'react'
import { Link } from 'react-router'

const ChannelCard = () => {
  return (
    <Link>
      <div>
        <div className=" flex justify-center px-10 py-1 items-center img-otherchannel">
          <img
            src={
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D'
            }
            className="rounded-full"
            alt=""
            width={100}
          />
        </div>
        <div className="flex flex-col justify-center text-[14px] items-center text-other-Channel">
          <span>Junaid Akram Shorts</span>
          <span>61.8k Subscribers</span>
          <div className="flex justify-center items-center my-4 cursor-pointer bg-gray-100 hover:bg-gray-300 px-3 py-1 rounded-full btn-other-channel">
            <span className="text-gray-500 font-sans">Subscribe</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ChannelCard
