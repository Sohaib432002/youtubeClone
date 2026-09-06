import { Link, useOutletContext, useParams } from 'react-router-dom'
import { formatViews, timeAgo } from '../../utils/format'
import { buildHomeShelves, itemThumb, itemVideoId } from '../../utils/channelContent'
import ChannelCrousel from './ChannelCrousel'
import ChannelShelf from './ChannelShelf'
import { PlaylistCard, ShelfShortCard, ShelfVideoCard } from './PlaylistCard'
import PostCard from './PostCard'

const FeaturedVideo = ({ item, logo }) => {
  const videoId = itemVideoId(item)
  if (!videoId || !item?.snippet) return null
  const thumb = itemThumb(item, videoId)
  const views = item.meta?.views ?? item.statistics?.viewCount
  const published = item.snippet.publishTime || item.snippet.publishedAt
  const desc = item.snippet.description || ''

  return (
    <Link
      to={`/Video/${videoId}`}
      className="flex flex-col md:flex-row gap-4 py-5 border-b border-[#272727] group"
    >
      <div className="relative w-full md:w-[58%] aspect-video rounded-xl overflow-hidden bg-[#272727] flex-shrink-0">
        <img
          src={thumb}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="w-14 h-14 rounded-full bg-black/70 flex items-center justify-center text-white text-xl">
            <i className="fa-solid fa-play ml-1"></i>
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug line-clamp-2">
          {item.snippet.title}
        </h2>
        <div className="flex items-center gap-2 mt-3 text-sm text-[#aaa]">
          {logo ? (
            <img src={logo} alt="" className="w-6 h-6 rounded-full object-cover" />
          ) : null}
          <span className="truncate">{item.snippet.channelTitle}</span>
        </div>
        <p className="text-[#aaa] text-sm mt-1">
          {views != null ? `${formatViews(views)} views` : ''}
          {published ? ` • ${timeAgo(published)}` : ''}
        </p>
        {desc ? (
          <p className="text-[#aaa] text-sm mt-3 line-clamp-4 leading-relaxed whitespace-pre-wrap">
            {desc}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

const AllVideosHome = () => {
  const { channelId } = useParams()
  const {
    channelVideos = [],
    channelData,
    channelVideosReady = true,
    channelPlaylists = [],
    channelShorts = [],
    channelLive = [],
    channelPosts = [],
    channelSections = [],
    extrasReady = true,
  } = useOutletContext() || {}

  const logo =
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.medium?.url ||
    channelData?.snippet?.thumbnails?.default?.url

  if (!channelVideosReady) {
    return <p className="text-[#AAAAAA] py-8 text-center">Loading channel...</p>
  }

  const shelves = buildHomeShelves({
    videos: channelVideos,
    shorts: channelShorts,
    playlists: channelPlaylists,
    posts: channelPosts,
    live: channelLive,
    sections: channelSections,
    channelId,
  })

  if (!shelves.length) {
    return <p className="text-[#AAAAAA] py-8 text-center">No videos found for this channel.</p>
  }

  const tabBase = channelId ? `/channel/${channelId}` : '/CD'

  return (
    <div className="text-white pb-8">
      {!extrasReady ? (
        <p className="text-[#aaa] text-sm py-2">Loading featured sections...</p>
      ) : null}

      {shelves.map((shelf, idx) => {
        if (shelf.type === 'featured') {
          return <FeaturedVideo key={`featured-${idx}`} item={shelf.items[0]} logo={logo} />
        }
        if (shelf.type === 'channels') {
          return (
            <section key={`channels-${idx}`} className="py-5">
              <h2 className="text-white text-lg font-bold mb-3">{shelf.title}</h2>
              <ChannelCrousel excludeChannelId={channelData?.id} />
            </section>
          )
        }

        const to = shelf.href ? `${tabBase}/${shelf.href}` : undefined
        return (
          <ChannelShelf
            key={`${shelf.type}-${shelf.title}-${idx}`}
            title={shelf.title}
            to={to}
            icon={
              shelf.type === 'shorts'
                ? 'fa-solid fa-bolt text-white'
                : shelf.live
                  ? 'fa-solid fa-tower-broadcast text-red-500'
                  : undefined
            }
          >
            {shelf.type === 'shorts'
              ? shelf.items.map((item) => (
                  <ShelfShortCard key={itemVideoId(item) || item.etag} item={item} />
                ))
              : null}
            {shelf.type === 'playlists'
              ? shelf.items.map((pl) => (
                  <PlaylistCard
                    key={pl.id}
                    playlist={pl}
                    channelId={channelId || channelData?.id}
                    compact
                  />
                ))
              : null}
            {shelf.type === 'posts'
              ? shelf.items.map((post) => <PostCard key={post.id} post={post} />)
              : null}
            {shelf.type === 'videos'
              ? shelf.items.map((item) => (
                  <ShelfVideoCard
                    key={itemVideoId(item) || item.etag}
                    item={item}
                    live={Boolean(shelf.live)}
                  />
                ))
              : null}
          </ChannelShelf>
        )
      })}
    </div>
  )
}

export default AllVideosHome
