import { CHANNELS, SHORTS, VIDEOS, toSearchItem } from '../data/mockCatalog'
import { isShortLikeItem } from './feed'
import { formatViews } from './format'

export function itemVideoId(item) {
  if (!item) return ''
  if (typeof item.id === 'string' && item.id) return item.id
  return item.id?.videoId || item.snippet?.resourceId?.videoId || item.meta?.videoId || ''
}

export function itemThumb(item, videoId = '') {
  const id = videoId || itemVideoId(item)
  return (
    item?.snippet?.thumbnails?.high?.url ||
    item?.snippet?.thumbnails?.medium?.url ||
    item?.snippet?.thumbnails?.default?.url ||
    (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '')
  )
}

function daysAgoIso(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function channelMeta(channelId, channelData) {
  const local = CHANNELS.find((c) => c.id === channelId)
  return {
    title:
      channelData?.snippet?.title ||
      local?.title ||
      'Channel',
    handle: channelData?.snippet?.customUrl || local?.handle || '',
    avatar:
      channelData?.snippet?.thumbnails?.high?.url ||
      channelData?.snippet?.thumbnails?.medium?.url ||
      channelData?.snippet?.thumbnails?.default?.url ||
      local?.avatar ||
      '/favicon.ico',
    description: channelData?.snippet?.description || local?.description || '',
    subscribers:
      channelData?.statistics?.subscriberCount || local?.subscribers || '0',
  }
}

function toPlaylistResource({
  id,
  title,
  channelId,
  channelTitle,
  description,
  videos,
  publishedAt,
}) {
  const first = videos[0]
  const vid = itemVideoId(first)
  const thumb = itemThumb(first, vid)
  return {
    kind: 'youtube#playlist',
    id,
    snippet: {
      publishedAt: publishedAt || first?.snippet?.publishedAt || daysAgoIso(30),
      channelId,
      title,
      description: description || `${title} from ${channelTitle}`,
      thumbnails: {
        default: { url: thumb },
        medium: { url: thumb },
        high: { url: thumb },
      },
      channelTitle,
    },
    contentDetails: { itemCount: videos.length },
    _videos: videos,
  }
}

/** Build channel playlists from that channel's videos (mock + API fallback). */
export function buildMockPlaylists(channelId, videos = [], channelTitle = '') {
  const longform = (videos || []).filter((v) => !isShortLikeItem(v))
  if (!longform.length) return []

  const title = channelTitle || longform[0]?.snippet?.channelTitle || 'Channel'
  const groups = []

  groups.push({
    title: 'Popular videos',
    videos: [...longform]
      .sort(
        (a, b) =>
          Number(b.statistics?.viewCount || b.meta?.views || 0) -
          Number(a.statistics?.viewCount || a.meta?.views || 0)
      )
      .slice(0, 12),
  })
  groups.push({
    title: 'Latest uploads',
    videos: [...longform]
      .sort(
        (a, b) =>
          new Date(b.snippet?.publishedAt || 0) - new Date(a.snippet?.publishedAt || 0)
      )
      .slice(0, 12),
  })

  const byCat = new Map()
  longform.forEach((v) => {
    const cat = v.meta?.category || ''
    if (!cat || cat === 'All') return
    const list = byCat.get(cat) || []
    list.push(v)
    byCat.set(cat, list)
  })
  byCat.forEach((list, cat) => {
    if (list.length >= 2) groups.push({ title: cat, videos: list.slice(0, 12) })
  })

  const seen = new Set()
  return groups
    .filter((g) => g.videos.length)
    .map((g, i) => {
      const slug = String(g.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .slice(0, 40)
      const id = `pl_${channelId}_${slug || i}`
      if (seen.has(id)) return null
      seen.add(id)
      return toPlaylistResource({
        id,
        title: g.title,
        channelId,
        channelTitle: title,
        videos: g.videos,
        publishedAt: g.videos[0]?.snippet?.publishedAt,
      })
    })
    .filter(Boolean)
}

export function getMockPlaylistVideos(playlistId) {
  if (!playlistId || !String(playlistId).startsWith('pl_')) return []
  const rest = String(playlistId).slice(3)
  const channel = CHANNELS.find((c) => rest.startsWith(`${c.id}_`))
  const channelId = channel?.id || (rest.startsWith('ch_') ? rest.split('_').slice(0, 2).join('_') : '')
  const vids = VIDEOS.filter((v) => v.channelId === channelId).map(toSearchItem)
  const playlists = buildMockPlaylists(channelId, vids, channel?.title)
  return playlists.find((p) => p.id === playlistId)?._videos || vids.slice(0, 12)
}

export function mockChannelShorts(channelId) {
  return SHORTS.filter((s) => s.channelId === channelId).map(toSearchItem)
}

export function mockChannelLive(videos = [], channelId = '') {
  const tagged = (videos || []).filter((v) =>
    /live|livestream|stream|highlight/i.test(v.snippet?.title || '')
  )
  if (tagged.length) {
    return tagged.slice(0, 10).map((v) => ({ ...v, liveStatus: 'completed' }))
  }
  return (videos || []).slice(0, 3).map((v, i) => ({
    ...v,
    liveStatus: i === 0 && channelId ? 'completed' : 'completed',
    snippet: {
      ...v.snippet,
      title: `${v.snippet?.title || 'Live stream'} (Past livestream)`,
    },
  }))
}

export function buildChannelPosts(channelData, videos = []) {
  const channelId = channelData?.id || videos[0]?.snippet?.channelId || 'channel'
  const meta = channelMeta(channelId, channelData)
  const thumbs = videos.map((v) => itemThumb(v)).filter(Boolean)
  const videoIds = videos.map((v) => itemVideoId(v)).filter(Boolean)
  const subs = formatViews(meta.subscribers)

  const templates = [
    {
      text: `New upload is live on the channel. Tap through and tell us what you think.\n\n#${(meta.title || 'youtube').replace(/\s+/g, '')}`,
      image: thumbs[0] || '',
      videoId: videoIds[0] || '',
    },
    {
      text:
        (meta.description || `Welcome to ${meta.title}.`).slice(0, 320) +
        (meta.description?.length > 320 ? '…' : ''),
      image: thumbs[1] || '',
    },
    {
      text: `${subs} subscribers and counting — thank you for being here. What should we make next?`,
    },
    {
      text: 'Community check-in: drop a comment with the topic you want this week.',
      image: thumbs[2] || '',
    },
    {
      text: 'Shorts are going up this week. Follow the channel so you don’t miss them.',
      image: thumbs[3] || '',
    },
    {
      text: 'Throwback to one of our most-watched videos. Still holds up.',
      image: thumbs[4] || thumbs[0] || '',
      videoId: videoIds[4] || videoIds[0] || '',
    },
  ]

  return templates.map((t, i) => ({
    id: `post_${channelId}_${i + 1}`,
    channelId,
    channelTitle: meta.title,
    channelHandle: meta.handle,
    channelAvatar: meta.avatar,
    text: t.text,
    image: t.image || '',
    videoId: t.videoId || '',
    likes: 180 + i * 137 + ((channelId.length * 17) % 900),
    commentCount: 8 + i * 5,
    publishedAt: daysAgoIso(3 + i * 11),
  }))
}

export function longformVideos(videos = []) {
  return (videos || []).filter((v) => itemVideoId(v) && !isShortLikeItem(v))
}

export function sortVideos(videos = [], sort = 'latest') {
  const list = [...videos]
  if (sort === 'popular') {
    return list.sort(
      (a, b) =>
        Number(b.statistics?.viewCount || b.meta?.views || 0) -
        Number(a.statistics?.viewCount || a.meta?.views || 0)
    )
  }
  if (sort === 'oldest') {
    return list.sort(
      (a, b) =>
        new Date(a.snippet?.publishedAt || 0) - new Date(b.snippet?.publishedAt || 0)
    )
  }
  return list.sort(
    (a, b) =>
      new Date(b.snippet?.publishedAt || b.snippet?.publishTime || 0) -
      new Date(a.snippet?.publishedAt || a.snippet?.publishTime || 0)
  )
}

/**
 * Featured Home shelves. Uses YouTube channelSections when present,
 * otherwise the standard Home layout (Videos / Shorts / Playlists / Posts).
 */
export function buildHomeShelves({
  videos = [],
  shorts = [],
  playlists = [],
  posts = [],
  live = [],
  sections = [],
  channelId = '',
} = {}) {
  const uploads = longformVideos(videos)
  const popular = sortVideos(uploads, 'popular').slice(0, 12)
  const latest = sortVideos(uploads, 'latest').slice(0, 12)
  const shelves = []

  const push = (shelf) => {
    if (!shelf) return
    if (shelf.type === 'channels') {
      shelves.push(shelf)
      return
    }
    if (!shelf.items?.length) return
    shelves.push(shelf)
  }

  const byType = {
    recentUploads: () => ({
      type: 'videos',
      title: 'Videos',
      items: latest,
      href: 'videolist',
    }),
    popularUploads: () => ({
      type: 'videos',
      title: 'Popular videos',
      items: popular,
      href: 'videolist',
    }),
    singlePlaylist: (section) => {
      const pid = section.contentDetails?.playlists?.[0]
      const pl = playlists.find((p) => p.id === pid)
      if (pl) {
        return {
          type: 'playlists',
          title: pl.snippet?.title || 'Playlist',
          items: [pl],
          href: 'Playlist',
        }
      }
      return {
        type: 'playlists',
        title: section.snippet?.title || 'Playlist',
        items: playlists.slice(0, 8),
        href: 'Playlist',
      }
    },
    multiplePlaylists: (section) => ({
      type: 'playlists',
      title: section.snippet?.title || 'Created playlists',
      items: playlists.slice(0, 12),
      href: 'Playlist',
    }),
    allPlaylists: () => ({
      type: 'playlists',
      title: 'Created playlists',
      items: playlists.slice(0, 12),
      href: 'Playlist',
    }),
    recentPosts: () => ({
      type: 'posts',
      title: 'Posts',
      items: posts.slice(0, 8),
      href: 'Posts',
    }),
    liveEvents: () => ({
      type: 'videos',
      title: 'Live',
      items: live.slice(0, 12),
      href: 'live',
      live: true,
    }),
    upcomingEvents: () => ({
      type: 'videos',
      title: 'Upcoming live streams',
      items: live.filter((v) => v.liveStatus === 'upcoming').slice(0, 8),
      href: 'live',
      live: true,
    }),
    multipleChannels: (section) => ({
      type: 'channels',
      title: section.snippet?.title || 'Featured channels',
      items: [],
      href: '',
    }),
    recentActivity: () => ({
      type: 'videos',
      title: 'For you',
      items: latest,
      href: 'videolist',
    }),
  }

  if (uploads[0]) {
    push({
      type: 'featured',
      title: 'Featured',
      items: [uploads[0]],
    })
  }

  if (sections?.length) {
    sections.forEach((section) => {
      const type = section.snippet?.type
      const builder = byType[type]
      if (builder) push(builder(section))
    })
    if (shorts.length && !shelves.some((s) => s.type === 'shorts')) {
      push({
        type: 'shorts',
        title: 'Shorts',
        items: shorts.slice(0, 14),
        href: 'shorts',
      })
    }
    if (posts.length && !shelves.some((s) => s.type === 'posts')) {
      push({
        type: 'posts',
        title: 'Posts',
        items: posts.slice(0, 8),
        href: 'Posts',
      })
    }
    if (!shelves.some((s) => s.type === 'channels')) {
      push({ type: 'channels', title: 'Featured channels', items: [], href: '' })
    }
    return shelves
  }

  push({ type: 'videos', title: 'Videos', items: latest, href: 'videolist' })
  push({
    type: 'shorts',
    title: 'Shorts',
    items: shorts.slice(0, 14),
    href: 'shorts',
  })
  push({
    type: 'playlists',
    title: 'Created playlists',
    items: playlists.slice(0, 12),
    href: 'Playlist',
  })
  push({
    type: 'videos',
    title: 'Popular videos',
    items: popular,
    href: 'videolist',
  })
  push({
    type: 'videos',
    title: 'Live',
    items: live.slice(0, 10),
    href: 'live',
    live: true,
  })
  push({
    type: 'posts',
    title: 'Posts',
    items: posts.slice(0, 8),
    href: 'Posts',
  })
  push({ type: 'channels', title: 'Featured channels', items: [], href: '' })
  return shelves
}
