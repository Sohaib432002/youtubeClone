import React from 'react'

/** YouTube-style centered "Show more" pill on a divider line */
const ShowMoreButton = ({ onClick, loading = false, label = 'Show more', collapsed = true }) => {
  return (
    <div className="relative w-full flex items-center justify-center my-6">
      <div className="absolute inset-x-0 top-1/2 border-t border-[#303030]" />
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="relative z-[1] inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#717171] bg-[#0f0f0f] text-white text-sm font-medium hover:bg-[#272727] hover:border-[#aaa] disabled:opacity-60"
      >
        {loading ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
            Loading...
          </>
        ) : (
          <>
            {collapsed ? label : 'Show less'}
            <i className={`fa-solid fa-chevron-${collapsed ? 'down' : 'up'} text-[10px]`}></i>
          </>
        )}
      </button>
    </div>
  )
}

export default ShowMoreButton
