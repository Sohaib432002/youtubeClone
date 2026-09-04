/**
 * YouTube Data API with multi-key fallback → Django backend → local mock.
 * Reuses the existing API keys already present in the project.
 */

const YT_API_KEYS = [
  process.env.REACT_APP_YT_KEY_1 || 'AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY',
  process.env.REACT_APP_YT_KEY_2 || 'AIzaSyCFT7jTy4t_EZtvr--ivo-NO4rrT1Dn-C0',
  process.env.REACT_APP_YT_KEY_3 || 'AIzaSyAe2cP53vZdbGJHu8m8Bj-UC3JTk00PMC8',
  process.env.REACT_APP_YT_KEY_4 || 'AIzaSyC6eVSk2EOI3cu9SzITToFW1s0z2ns-eg0',
].filter(Boolean)

export const DJANGO_API_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'

function isValidYoutubePayload(data) {
  return data && !data.error && Array.isArray(data.items)
}

async function fetchWithYoutubeKeys(buildUrl) {
  for (const key of YT_API_KEYS) {
    try {
      const res = await fetch(buildUrl(key))
      const data = await res.json()
      if (res.ok && isValidYoutubePayload(data)) {
        return data
      }
    } catch (_) {
      /* try next key */
    }
  }
  return null
}

function mapDjangoVideoToSearchItem(v) {
  return {
    kind: 'youtube#searchResult',
    id: { kind: 'youtube#video', videoId: v.video_id },
    snippet: {
      publishedAt: v.published_at,
      channelId: v.channel_id || 'local',
      title: v.title,
      description: v.description || '',
      thumbnails: {
        default: { url: v.thumbnail_url },
        medium: { url: v.thumbnail_url },
        high: { url: v.thumbnail_url },
      },
      channelTitle: v.channel_title,
      publishTime: v.published_at,
    },
  }
}

function mapDjangoVideoToDetail(v) {
  return {
    kind: 'youtube#video',
    id: v.video_id,
    snippet: {
      publishedAt: v.published_at,
      channelId: v.channel_id || 'local',
      title: v.title,
      description: v.description || '',
      thumbnails: {
        default: { url: v.thumbnail_url },
        medium: { url: v.thumbnail_url },
        high: { url: v.thumbnail_url },
      },
      channelTitle: v.channel_title,
      categoryId: String(v.category || ''),
    },
    statistics: {
      viewCount: String(v.views || 0),
      likeCount: String(v.likes || 0),
      commentCount: String(v.comment_count || 0),
    },
  }
}

function mapDjangoComment(c) {
  return {
    kind: 'youtube#commentThread',
    id: String(c.id),
    snippet: {
      topLevelComment: {
        snippet: {
          authorDisplayName: c.author || 'User',
          authorProfileImageUrl: c.author_avatar || '/favicon.ico',
          textDisplay: c.text,
          publishedAt: c.created_at,
          likeCount: c.likes || 0,
        },
      },
    },
  }
}

async function fetchDjango(path) {
  try {
    const res = await fetch(`${DJANGO_API_URL}${path}`)
    if (!res.ok) return null
    return await res.json()
  } catch (_) {
    return null
  }
}

async function localSearchMock() {
  const mod = await import('../FetchedData')
  return mod.default
}

/** Home / search listing (YouTube searchListResponse shape) */
export async function searchVideos(
  query = 'trending',
  maxResults = 24,
  { pageToken = '', videoDuration = '' } = {}
) {
  const q = query && String(query).trim() ? query : 'trending'
  const tokenPart = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
  const durationPart = videoDuration ? `&videoDuration=${videoDuration}` : ''

  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        q
      )}&maxResults=${maxResults}${tokenPart}${durationPart}&key=${key}`
  )
  if (yt) return yt

  if (!pageToken) {
    const django = await fetchDjango(`/search/?q=${encodeURIComponent(q)}`)
    if (django && Array.isArray(django.results || django)) {
      const list = django.results || django
      return {
        kind: 'youtube#searchListResponse',
        items: list.map(mapDjangoVideoToSearchItem),
        nextPageToken: undefined,
      }
    }
    return localSearchMock()
  }

  // Paginate mock/django by rotating related queries when YouTube tokens unavailable
  const alt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        `${q} video`
      )}&maxResults=${maxResults}&key=${key}`
  )
  if (alt) return alt

  return { kind: 'youtube#searchListResponse', items: [], nextPageToken: undefined }
}

export async function searchShorts(maxResults = 20, pageToken = '') {
  return searchVideos('#shorts', maxResults, { pageToken, videoDuration: 'short' })
}

/** Build channelId → logo URL map (batched) */
export async function getChannelLogoMap(channelIds = []) {
  const unique = [...new Set(channelIds.filter(Boolean))]
  const map = {}
  for (let i = 0; i < unique.length; i += 50) {
    const chunk = unique.slice(i, i + 50)
    const data = await getChannelsByIds(chunk)
    data?.items?.forEach((ch) => {
      map[ch.id] =
        ch.snippet?.thumbnails?.default?.url ||
        ch.snippet?.thumbnails?.medium?.url ||
        ch.snippet?.thumbnails?.high?.url ||
        ''
    })
  }
  return map
}

/** Video details (YouTube videos.list shape) */
export async function getVideoDetails(id) {
  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${key}`
  )
  if (yt && yt.items?.length) return yt

  const django = await fetchDjango(`/videos/${id}/`)
  if (django && django.video_id) {
    return {
      kind: 'youtube#videoListResponse',
      items: [mapDjangoVideoToDetail(django)],
    }
  }

  return { kind: 'youtube#videoListResponse', items: [] }
}

/** Comments (YouTube commentThreads shape) */
export async function getVideoComments(id, maxResults = 50) {
  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&maxResults=${maxResults}&key=${key}`
  )
  if (yt) return yt

  const django = await fetchDjango(`/videos/${id}/comments/`)
  if (django && Array.isArray(django.results || django)) {
    const list = django.results || django
    return {
      kind: 'youtube#commentThreadListResponse',
      items: list.map(mapDjangoComment),
    }
  }

  return { kind: 'youtube#commentThreadListResponse', items: [] }
}

/** Batch video stats (YouTube videos.list) */
export async function getVideosByIds(ids) {
  if (!ids?.length) return { items: [] }
  const idParam = ids.filter(Boolean).join(',')
  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${idParam}&key=${key}`
  )
  if (yt) return yt
  return { items: [] }
}

/** Batch channels (YouTube channels.list) */
export async function getChannelsByIds(ids) {
  if (!ids?.length) return { items: [] }
  const idParam = ids.filter(Boolean).join(',')
  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${idParam}&key=${key}`
  )
  if (yt) return yt
  return { items: [] }
}

export async function getMostPopular(maxResults = 50) {
  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=${maxResults}&key=${key}`
  )
  if (yt) return yt

  const django = await fetchDjango('/videos/')
  if (django && Array.isArray(django.results || django)) {
    const list = django.results || django
    return {
      kind: 'youtube#videoListResponse',
      items: list.map(mapDjangoVideoToDetail),
    }
  }

  return { items: [] }
}
