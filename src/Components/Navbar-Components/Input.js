import React, { useState } from 'react'
import { useNavigate } from 'react-router'

const Input = ({ searchIcon, setSearchIcon }) => {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const goSearch = () => {
    const q = text.trim()
    if (!q) return
    navigate(`/result/${encodeURIComponent(q)}`)
  }

  return (
    <div
      className={`flex flex-grow items-stretch max-w-full ${
        searchIcon ? 'outline outline-1 outline-[#1c62b8] rounded-full' : ''
      }`}
    >
      <div className="flex flex-grow items-center bg-[#121212] border border-[#303030] rounded-l-full pl-4 min-w-0">
        {searchIcon ? (
          <i className="fa-solid text-[#fff] fa-magnifying-glass mr-3 opacity-90"></i>
        ) : null}
        <input
          onFocus={(e) => {
            setSearchIcon(true)
            e.stopPropagation()
          }}
          onBlur={() => setSearchIcon(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goSearch()
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          className="text-white w-full bg-transparent text-base outline-none py-[9px] placeholder:text-[#888]"
          placeholder="Search"
        />
        {text ? (
          <button
            type="button"
            onClick={() => setText('')}
            className="px-2 text-white hover:text-[#aaa]"
            aria-label="Clear"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={goSearch}
        className="px-[22px] bg-[#222222] hover:bg-[#303030] border border-l-0 border-[#303030] rounded-r-full"
        aria-label="Search"
      >
        <i className="fa-solid fa-magnifying-glass text-[#f1f1f1]"></i>
      </button>
    </div>
  )
}

export default Input
