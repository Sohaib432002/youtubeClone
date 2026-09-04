import React from 'react'
import { Link } from 'react-router'

const Logo = ({ setleftBar, leftBar }) => {
  return (
    <div className="flex items-center flex-shrink-0 min-w-0">
      <button
        type="button"
        onClick={() => setleftBar(!leftBar)}
        className="hover:bg-[#222] rounded-full h-10 w-10 flex items-center justify-center"
        aria-label="Menu"
      >
        <i className="fa-solid fa-bars text-white text-xl"></i>
      </button>
      <Link to="/" className="flex items-center gap-1 ml-1" title="YouTubeClone">
        <img
          src="/Logo.svg"
          className="logo-img max-w-[150px] sm:max-w-[170px] h-auto"
          alt="YouTubeClone"
        />
        <span className="text-[10px] text-[#aaa] self-start mt-1 hidden sm:inline">PK</span>
      </Link>
    </div>
  )
}

export default Logo
