import { Link } from 'react-router-dom'

/** Inline YouTubeClone wordmark — no broken public-path / CSS clamp issues */
const Logo = ({ setleftBar, leftBar }) => {
  return (
    <div className="flex items-center flex-shrink-0">
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
        className="flex items-center gap-0.5 ml-1 min-w-0"
        title="YouTubeClone Home"
        aria-label="YouTubeClone Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 148 36"
          className="h-5 sm:h-6 w-auto"
          role="img"
          aria-label="YouTubeClone"
        >
          <rect x="0" y="4" width="40" height="28" rx="8" fill="#FF0000" />
          <path d="M15 12 L29 18 L15 24 Z" fill="#FFFFFF" />
          <text
            x="48"
            y="25"
            fontFamily="Roboto, Arial, Helvetica, sans-serif"
            fontSize="18"
            fontWeight="700"
            fill="#FFFFFF"
          >
            YouTube
            <tspan fill="#FF0000">Clone</tspan>
          </text>
        </svg>
        <span className="text-[10px] text-[#aaa] self-start mt-0.5 ml-0.5 hidden sm:inline">
          PK
        </span>
      </Link>
    </div>
  )
}

export default Logo
