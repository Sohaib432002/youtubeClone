/**
 * YouTube Data API with multi-key fallback → Django (query-filtered) → empty.
 *
 * Each surface has its own function so Home / Search / Channel / Related
 * never share one generic payload:
 *   getHomeVideos()      → home feed
 *   searchVideos(q)      → search page (requires q)
 *   getChannelVideos(id) → uploads for that channelId
 *   getRelatedVideos()   → videos related to the current title/video
 *
 * Failed live requests NEVER fall back to FetchedData or an unfiltered catalog.
 */

const YT_API_KEYS = [
  process.env.REACT_APP_YT_KEY_1 || 'AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY',
  process.env.REACT_APP_YT_KEY_2 || 'AIzaSyCFT7jTy4t_EZtvr--ivo-NO4rrT1Dn-C0',
  process.env.REACT_APP_YT_KEY_3 || 'AIzaSyAe2cP53vZdbGJHu8m8Bj-UC3JTk00PMC8',
  process.env.REACT_APP_YT_KEY_4 || 'AIzaSyC6eVSk2EOI3cu9SzITToFW1s0z2ns-eg0',
].filter(Boolean)

export const DJANGO_API_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api'

const FETCH_TIMEOUT_MS = 8000

/** YouTube `videos.list?chart=mostPopular` category IDs for home chips. */
const YT_CATEGORY_IDS = {
  Music: '10',
  Gaming: '20',
  News: '25',
  Sports: '17',
  Movies: '1',
  Comedy: '23',
  Education: '27',
  Technology: '28',
  Science: '28',
  Entertainment: '24',
  Travel: '19',
}

export function videoIdOf(item) {
  if (!item) return ''
  if (typeof item.id === 'string' && item.id) return item.id
  return (
    item.id?.videoId ||
    item.snippet?.resourceId?.videoId ||
    item.meta?.videoId ||
    ''
  )
}

export function dedupeByVideoId(items = []) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    const id = videoIdOf(item)
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(item)
  }
  return out
}

function emptySearch(extra = {}) {
  return {
    kind: 'youtube#searchListResponse',
    items: [],
    nextPageToken: undefined,
    ...extra,
  }
}

async function fetchJson(url, { timeout = FETCH_TIMEOUT_MS } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    const data = await res.json().catch(() => null)
    return { res, data }
  } finally {
    clearTimeout(timer)
  }
}

function isValidYoutubePayload(data) {
  return data && !data.error && Array.isArray(data.items)
}

async function fetchWithYoutubeKeys(buildUrl) {
  for (const key of YT_API_KEYS) {
    try {
      const { res, data } = await fetchJson(buildUrl(key))
      if (res.ok && isValidYoutubePayload(data)) {
        return data
      }
    } catch (_) {
      /* try next key / timeout */
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

function mapVideoListToSearchItem(v) {
  const videoId = typeof v.id === 'string' ? v.id : v.id?.videoId
  if (!videoId || !v.snippet) return null
  return {
    kind: 'youtube#searchResult',
    id: { kind: 'youtube#video', videoId },
    snippet: v.snippet,
    statistics: v.statistics,
    contentDetails: v.contentDetails,
  }
}

function mapPlaylistItemToSearchItem(item) {
  const videoId = item?.snippet?.resourceId?.videoId
  const title = item?.snippet?.title || ''
  if (!videoId || !item?.snippet) return null
  if (title === 'Private video' || title === 'Deleted video') return null
  return {
    kind: 'youtube#searchResult',
    id: { kind: 'youtube#video', videoId },
    snippet: {
      publishedAt: item.snippet.publishedAt,
      channelId: item.snippet.channelId,
      title,
      description: item.snippet.description || '',
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle,
      publishTime: item.snippet.publishedAt,
    },
  }
}

async function fetchDjango(path) {
  try {
    const { res, data } = await fetchJson(`${DJANGO_API_URL}${path}`, {
      timeout: 2500,
    })
    if (!res.ok) return null
    return data
  } catch (_) {
    return null
  }
}

function clampMax(n, fallback = 24) {
  const v = Number(n)
  if (!Number.isFinite(v) || v < 1) return fallback
  return Math.min(50, Math.round(v))
}

function buildSearchUrl(key, { q, channelId, type, order, maxResults, pageToken, videoDuration, eventType }) {
  const params = new URLSearchParams({
    part: 'snippet',
    type: type || 'video',
    maxResults: String(clampMax(maxResults)),
    key,
  })
  if (q) params.set('q', q)
  if (channelId) params.set('channelId', channelId)
  if (order) params.set('order', order)
  if (pageToken) params.set('pageToken', pageToken)
  if (videoDuration) params.set('videoDuration', videoDuration)
  if (eventType) params.set('eventType', eventType)
  return `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
}

/**
 * Search page + shared query search.
 * Requires a text query and/or a channelId. Never returns a generic dump.
 */
export async function searchVideos(
  query = '',
  maxResults = 24,
  {
    pageToken = '',
    videoDuration = '',
    order = 'relevance',
    channelId = '',
    eventType = '',
    type = 'video',
  } = {}
) {
  const q = query && String(query).trim() ? String(query).trim() : ''
  if (!q && !channelId) return emptySearch()

  const yt = await fetchWithYoutubeKeys((key) =>
    buildSearchUrl(key, {
      q,
      channelId,
      type,
      order,
      maxResults,
      pageToken,
      videoDuration,
      eventType,
    })
  )
  if (yt) {
    let items = dedupeByVideoId(yt.items || [])
    if (channelId) {
      items = items.filter(
        (it) => !it.snippet?.channelId || it.snippet.channelId === channelId
      )
    }
    return {
      kind: 'youtube#searchListResponse',
      items,
      nextPageToken: yt.nextPageToken || undefined,
    }
  }

  // Django search is query-filtered. Never use /videos/?category= for arbitrary q.
  if (!pageToken && q && !channelId) {
    const django = await fetchDjango(`/search/?q=${encodeURIComponent(q)}`)
    if (django && Array.isArray(django.results || django)) {
      const list = django.results || django
      return {
        kind: 'youtube#searchListResponse',
        items: dedupeByVideoId(list.map(mapDjangoVideoToSearchItem)),
        nextPageToken: undefined,
      }
    }
  }

  return emptySearch()
}

export async function searchShorts(
  query = '',
  maxResults = 20,
  { pageToken = '', excludeIds = [] } = {}
) {
  const q = query && String(query).trim() ? String(query).trim() : ''
  const searchQ = q ? `${q} #shorts` : '#shorts'
  const yt = await searchVideos(searchQ, maxResults, {
    pageToken,
    videoDuration: 'short',
    order: 'relevance',
    type: 'video',
  })
  const { keepOnlyShorts } = await import('./shorts')
  let items = await keepOnlyShorts(yt?.items || [], excludeIds, { lenient: true })

  if (!items.length && !pageToken) {
    const { searchCatalogShorts } = await import('../data/mockCatalog')
    const local = searchCatalogShorts(q)
    items = await keepOnlyShorts(local, excludeIds)
  }

  return {
    kind: 'youtube#searchListResponse',
    items: dedupeByVideoId(items),
    nextPageToken: yt?.nextPageToken || undefined,
  }
}

/**
 * Home feed. Independent from search/channel/related.
 * All / Trending / mapped chips → mostPopular; others → category search.
 */
export async function getHomeVideos(
  category = 'All',
  maxResults = 24,
  { pageToken = '' } = {}
) {
  const cat = category || 'All'
  const mapPopular = (payload) => {
    if (!payload?.items?.length) return null
    return {
      kind: 'youtube#searchListResponse',
      items: dedupeByVideoId(payload.items.map(mapVideoListToSearchItem).filter(Boolean)),
      nextPageToken: payload.nextPageToken || undefined,
    }
  }

  if (cat === 'All' || cat === 'Trending') {
    const popular = await getMostPopular(maxResults, { pageToken })
    const mapped = mapPopular(popular)
    if (mapped) return mapped
  } else if (cat === 'Live') {
    const live = await searchVideos('live', maxResults, {
      pageToken,
      eventType: 'live',
      order: 'date',
    })
    if (live.items?.length) return live
  } else if (cat === 'Recently Uploaded') {
    const recent = await searchVideos('new videos this week', maxResults, {
      pageToken,
      order: 'date',
    })
    if (recent.items?.length) return recent
  } else if (YT_CATEGORY_IDS[cat]) {
    const popular = await getMostPopular(maxResults, {
      pageToken,
      videoCategoryId: YT_CATEGORY_IDS[cat],
    })
    const mapped = mapPopular(popular)
    if (mapped) return mapped
  }

  if (cat !== 'All' && cat !== 'Trending') {
    const searched = await searchVideos(cat, maxResults, {
      pageToken,
      order: 'relevance',
    })
    if (searched.items?.length) return searched
  }

  return emptySearch()
}

/**
 * Videos uploaded by this channel (channelId), not a generic name search.
 * Prefers the channel uploads playlist, then search?channelId=.
 */
export async function getChannelVideos(
  channelId,
  maxResults = 32,
  { pageToken = '' } = {}
) {
  if (!channelId) return emptySearch()

  if (String(channelId).startsWith('ch_')) {
    const { VIDEOS, toSearchItem } = await import('../data/mockCatalog')
    const items = (VIDEOS || [])
      .filter((v) => v.channelId === channelId)
      .map(toSearchItem)
    return { ...emptySearch(), items: dedupeByVideoId(items) }
  }

  const channelPayload = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(
        channelId
      )}&key=${key}`
  )
  const uploadsId =
    channelPayload?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || ''

  if (uploadsId) {
    const tokenPart = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
    const pl = await fetchWithYoutubeKeys(
      (key) =>
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(
          uploadsId
        )}&maxResults=${clampMax(maxResults)}${tokenPart}&key=${key}`
    )
    if (pl?.items?.length) {
      const items = dedupeByVideoId(
        pl.items
          .map(mapPlaylistItemToSearchItem)
          .filter(Boolean)
          .filter((it) => !it.snippet?.channelId || it.snippet.channelId === channelId)
      )
      if (items.length) {
        return {
          kind: 'youtube#searchListResponse',
          items,
          nextPageToken: pl.nextPageToken || undefined,
        }
      }
    }
  }

  const searched = await searchVideos('', maxResults, {
    channelId,
    pageToken,
    order: 'date',
    type: 'video',
  })
  return {
    kind: 'youtube#searchListResponse',
    items: (searched.items || []).filter(
      (it) => !it.snippet?.channelId || it.snippet.channelId === channelId
    ),
    nextPageToken: searched.nextPageToken,
  }
}

function relatedKeywordQuery(title = '') {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 6)
    .join(' ')
}

/**
 * Related videos for the watch page: search by the current video's title,
 * never a generic home dump. Excludes the current video id.
 */
export async function getRelatedVideos(
  { videoId = '', title = '', channelId = '', description = '' } = {},
  maxResults = 24
) {
  const { isShortLikeItem } = await import('./feed')
  const exclude = new Set([videoId].filter(Boolean))
  const topic = String(title || '').trim()

  const take = (list) =>
    dedupeByVideoId(list)
      .filter((it) => {
        const id = videoIdOf(it)
        if (!id || exclude.has(id)) return false
        if (isShortLikeItem(it)) return false
        return true
      })
      .slice(0, maxResults)

  if (topic) {
    const primary = await searchVideos(topic, maxResults, { order: 'relevance' })
    let items = take(primary.items || [])
    if (items.length >= 8) {
      return { kind: 'youtube#searchListResponse', items, nextPageToken: primary.nextPageToken }
    }

    const keys = relatedKeywordQuery(`${topic} ${description || ''}`)
    if (keys && keys !== topic.toLowerCase()) {
      const secondary = await searchVideos(keys, maxResults, { order: 'relevance' })
      items = take([...items, ...(secondary.items || [])])
    }
    if (items.length) {
      return { kind: 'youtube#searchListResponse', items }
    }
  }

  if (channelId) {
    const fromCh = await getChannelVideos(channelId, maxResults)
    const items = take(fromCh.items || [])
    if (items.length) return { kind: 'youtube#searchListResponse', items }
  }

  return emptySearch()
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

export async function getMostPopular(
  maxResults = 50,
  { pageToken = '', videoCategoryId = '' } = {}
) {
  const tokenPart = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
  const catPart = videoCategoryId ? `&videoCategoryId=${encodeURIComponent(videoCategoryId)}` : ''
  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=${clampMax(
        maxResults
      )}${tokenPart}${catPart}&key=${key}`
  )
  if (yt) return yt

  if (!pageToken && !videoCategoryId) {
    const django = await fetchDjango('/videos/')
    if (django && Array.isArray(django.results || django)) {
      const list = django.results || django
      return {
        kind: 'youtube#videoListResponse',
        items: list.map(mapDjangoVideoToDetail),
      }
    }
  }

  return { items: [] }
}

function emptyPlaylistList() {
  return { kind: 'youtube#playlistListResponse', items: [] }
}

/** Channel playlists (YouTube playlists.list). Falls back to grouped uploads. */
export async function getChannelPlaylists(channelId, maxResults = 24) {
  if (!channelId) return emptyPlaylistList()

  if (String(channelId).startsWith('ch_')) {
    const { VIDEOS, toSearchItem } = await import('../data/mockCatalog')
    const { buildMockPlaylists } = await import('./channelContent')
    const items = (VIDEOS || [])
      .filter((v) => v.channelId === channelId)
      .map(toSearchItem)
    const title = items[0]?.snippet?.channelTitle || ''
    return { ...emptyPlaylistList(), items: buildMockPlaylists(channelId, items, title) }
  }

  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${encodeURIComponent(
        channelId
      )}&maxResults=${clampMax(maxResults)}&key=${key}`
  )
  if (yt?.items?.length) {
    return { kind: 'youtube#playlistListResponse', items: yt.items }
  }

  const uploads = await getChannelVideos(channelId, 24)
  const { buildMockPlaylists } = await import('./channelContent')
  const title = uploads.items?.[0]?.snippet?.channelTitle || ''
  return {
    ...emptyPlaylistList(),
    items: buildMockPlaylists(channelId, uploads.items || [], title),
  }
}

/** Videos inside a playlist (YouTube playlistItems.list). */
export async function getPlaylistVideos(playlistId, maxResults = 32) {
  if (!playlistId) return emptySearch()

  if (String(playlistId).startsWith('pl_')) {
    const { getMockPlaylistVideos } = await import('./channelContent')
    return { ...emptySearch(), items: getMockPlaylistVideos(playlistId) }
  }

  const pl = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(
        playlistId
      )}&maxResults=${clampMax(maxResults)}&key=${key}`
  )
  if (pl?.items?.length) {
    return {
      kind: 'youtube#searchListResponse',
      items: dedupeByVideoId(pl.items.map(mapPlaylistItemToSearchItem).filter(Boolean)),
      nextPageToken: pl.nextPageToken || undefined,
    }
  }
  return emptySearch()
}

/** Channel Shorts. */
export async function getChannelShorts(channelId, maxResults = 24) {
  if (!channelId) return emptySearch()

  if (String(channelId).startsWith('ch_')) {
    const { mockChannelShorts } = await import('./channelContent')
    return { ...emptySearch(), items: mockChannelShorts(channelId) }
  }

  const { keepOnlyShorts } = await import('./shorts')
  const searched = await searchVideos('#shorts', maxResults, {
    channelId,
    order: 'date',
    videoDuration: 'short',
    type: 'video',
  })
  let items = await keepOnlyShorts(
    (searched.items || []).filter(
      (it) => !it.snippet?.channelId || it.snippet.channelId === channelId
    ),
    [],
    { lenient: true }
  )
  if (items.length) {
    return { kind: 'youtube#searchListResponse', items: dedupeByVideoId(items) }
  }

  const fallback = await searchVideos('', maxResults, {
    channelId,
    order: 'date',
    videoDuration: 'short',
    type: 'video',
  })
  items = await keepOnlyShorts(
    (fallback.items || []).filter(
      (it) => !it.snippet?.channelId || it.snippet.channelId === channelId
    ),
    [],
    { lenient: false }
  )
  return {
    kind: 'youtube#searchListResponse',
    items: dedupeByVideoId(items),
  }
}

/** Live / upcoming / completed streams for a channel. */
export async function getChannelLiveVideos(channelId, maxResults = 16) {
  if (!channelId) return emptySearch()

  if (String(channelId).startsWith('ch_')) {
    const uploads = await getChannelVideos(channelId, 24)
    const { mockChannelLive } = await import('./channelContent')
    return { ...emptySearch(), items: mockChannelLive(uploads.items || [], channelId) }
  }

  const tag = (payload, status) =>
    (payload?.items || [])
      .filter((it) => !it.snippet?.channelId || it.snippet.channelId === channelId)
      .map((it) => ({
        ...it,
        liveStatus: it.snippet?.liveBroadcastContent || status,
      }))

  const [live, upcoming, completed] = await Promise.all([
    searchVideos('', maxResults, { channelId, eventType: 'live', order: 'date', type: 'video' }),
    searchVideos('', maxResults, {
      channelId,
      eventType: 'upcoming',
      order: 'date',
      type: 'video',
    }),
    searchVideos('', maxResults, {
      channelId,
      eventType: 'completed',
      order: 'date',
      type: 'video',
    }),
  ])

  const items = dedupeByVideoId([
    ...tag(live, 'live'),
    ...tag(upcoming, 'upcoming'),
    ...tag(completed, 'completed'),
  ])
  return { kind: 'youtube#searchListResponse', items }
}

/** Featured channel sections (YouTube channelSections.list). */
export async function getChannelSections(channelId) {
  if (!channelId || String(channelId).startsWith('ch_')) return { items: [] }
  const yt = await fetchWithYoutubeKeys(
    (key) =>
      `https://www.googleapis.com/youtube/v3/channelSections?part=snippet,contentDetails&channelId=${encodeURIComponent(
        channelId
      )}&key=${key}`
  )
  return { items: yt?.items || [] }
}
