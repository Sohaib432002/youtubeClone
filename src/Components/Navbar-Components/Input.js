import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

const Input = ({ searchIcon, setSearchIcon, onSearchNavigate, autoFocus = false }) => {
  const [text, setText] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (!autoFocus || !inputRef.current) return undefined
    const t = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 50)
    return () => window.clearTimeout(t)
  }, [autoFocus])

  const goSearch = (e) => {
    e?.preventDefault?.()
    const q = text.trim()
    if (!q) {
      inputRef.current?.focus()
      return
    }
    navigate(`/result/${encodeURIComponent(q)}`)
    onSearchNavigate?.()
  }

  return (
    <form
      onSubmit={goSearch}
      className={`flex flex-1 items-stretch max-w-full min-w-0 ${
        searchIcon ? 'outline outline-1 outline-[#1c62b8] rounded-full' : ''
      }`}
      role="search"
    >
      <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full pl-3 sm:pl-4 min-w-0">
        <input
          ref={inputRef}
          onFocus={(e) => {
            setSearchIcon?.(true)
            e.stopPropagation()
          }}
          onBlur={() => setSearchIcon?.(false)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          className="text-white w-full bg-transparent text-base outline-none py-[10px] placeholder:text-[#888] min-w-0"
          placeholder="Search"
          aria-label="Search"
        />
        {text ? (
          <button
            type="button"
            onClick={() => {
              setText('')
              inputRef.current?.focus()
            }}
            className="px-2 text-white hover:text-[#aaa] flex-shrink-0"
            aria-label="Clear"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        ) : null}
      </div>
      <button
        type="submit"
        className="px-3.5 sm:px-[20px] bg-[#222222] active:bg-[#303030] hover:bg-[#303030] border border-l-0 border-[#303030] rounded-r-full flex-shrink-0"
        aria-label="Search"
      >
        <i className="fa-solid fa-magnifying-glass text-[#f1f1f1]"></i>
      </button>
    </form>
  )
}

export default Input
