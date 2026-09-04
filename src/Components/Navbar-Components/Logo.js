import { Link } from 'react-router-dom'

/** Full YouTubeClone wordmark — icon + text (no clipped SVG text) */
const Logo = ({ setleftBar, leftBar }) => {
  return (
    <div className="flex items-center flex-shrink-0 max-w-[min(100%,220px)] sm:max-w-none">
      <button
        type="button"
        onClick={() => setleftBar(!leftBar)}
        className="hover:bg-[#222] rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0"
        aria-label="Menu"
      >
        <i className="fa-solid fa-bars text-white text-xl"></i>
      </button>
      <Link
        to="/"
        className="flex items-center gap-1.5 ml-1 min-w-0"
        title="YouTubeClone Home"
        aria-label="YouTubeClone Home"
      >
        <span
          className="relative flex-shrink-0 w-[34px] h-[24px] sm:w-[36px] sm:h-[26px] rounded-[6px] bg-[#FF0000] flex items-center justify-center"
          aria-hidden
        >
          <svg viewBox="0 0 12 12" className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="#fff">
            <path d="M2.5 1.5 L10 6 L2.5 10.5 Z" />
          </svg>
        </span>
        <span className="text-white font-bold text-[15px] sm:text-[18px] leading-none tracking-tight whitespace-nowrap">
          YouTube<span className="text-[#FF0000]">Clone</span>
        </span>
        <span className="text-[9px] text-[#aaa] self-start mt-0.5 hidden sm:inline">PK</span>
      </Link>
    </div>
  )
}

export default Logo
