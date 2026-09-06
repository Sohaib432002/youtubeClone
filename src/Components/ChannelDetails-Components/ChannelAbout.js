import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../Hooks/AuthContext'
import { formatViews, timeAgo } from '../../utils/format'

const ChannelAbout = () => {
  const { isSignedIn } = useAuth()
  const { channelData } = useOutletContext() || {}
  if (!channelData) {
    return <p className="text-[#AAAAAA] py-8 text-center">No channel details.</p>
  }

  const sn = channelData.snippet || {}
  const st = channelData.statistics || {}
  const branding = channelData.brandingSettings?.channel || {}
  const joined = sn.publishedAt
  const country = sn.country || branding.country
  const description = sn.description || branding.description || ''
  const keywords = String(branding.keywords || '')
    .replace(/"/g, ' ')
    .split(/\s+/)
    .filter((k) => k.length > 1)
    .slice(0, 12)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 py-6 text-white">
      <div>
        <h2 className="text-lg font-bold mb-3">Description</h2>
        <p className="text-sm text-[#ddd] whitespace-pre-wrap leading-relaxed">
          {description || 'No description provided.'}
        </p>
        {keywords.length ? (
          <div className="flex flex-wrap gap-2 mt-5">
            {keywords.map((k) => (
              <span
                key={k}
                className="text-xs px-3 py-1 rounded-full bg-[#272727] text-[#aaa]"
              >
                {k}
              </span>
            ))}
          </div>
        ) : null}
        {sn.customUrl ? (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Links</h3>
            <p className="text-[#3ea6ff] text-sm">{sn.customUrl}</p>
          </div>
        ) : null}
      </div>

      <aside className="text-sm">
        <h2 className="text-lg font-bold mb-3">Stats</h2>
        <ul className="divide-y divide-[#272727] border-y border-[#272727]">
          {joined ? (
            <li className="py-3 text-[#aaa]">Joined {timeAgo(joined)}</li>
          ) : null}
          {st.viewCount != null ? (
            <li className="py-3">{formatViews(st.viewCount)} views</li>
          ) : null}
          {isSignedIn && st.subscriberCount != null ? (
            <li className="py-3">{formatViews(st.subscriberCount)} subscribers</li>
          ) : !isSignedIn ? (
            <li className="py-3 text-[#aaa]">Sign in to see subscribers</li>
          ) : null}
          {st.videoCount != null ? (
            <li className="py-3">{formatViews(st.videoCount)} videos</li>
          ) : null}
          {country ? <li className="py-3 text-[#aaa]">{country}</li> : null}
        </ul>
      </aside>
    </div>
  )
}

export default ChannelAbout
