import React from 'react'
import { Link } from 'react-router'

const Logo = ({ setleftBar, leftBar }) => {
  return (
    <div className="flex items-center flex-shrink-0 min-w-0">
      <div className="hover:bg-[#222222] hover:cursor-pointer rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center">
        <i
          onClick={() => setleftBar(!leftBar)}
          className="fa-solid fa-bars text-white text-xl sm:text-2xl"
        ></i>
      </div>
      <div className="flex items-center">
        <Link to="/">
          <img src="/Logo.svg" className="logo-img max-w-[90px] sm:max-w-[100px] h-auto" alt="logo" />
        </Link>
      </div>
    </div>
  )
}

export default Logo
