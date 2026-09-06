import { getVideosByIds, videoIdOf, dedupeByVideoId } from './youtubeApi'
import { parseIsoDuration, clockFromSeconds } from './format'

const QUEUE_KEY = 'ytclone_shorts_queue'
const MAX_SHORT_SEC = 180

export function looksLikeShort(item, durationSec = 0) {
  if (!item && !durationSec) return false
  if (item?.meta?.isShort) return true
  const title = `${item?.snippet?.title || item?.title || ''}`.toLowerCase()
  const desc = `${item?.snippet?.description || item?.description || ''}`.toLowerCase()
  const text = `${title} ${desc}`
  const tagged =
    text.includes('#shorts') ||
    text.includes('#short') ||
    text.includes('youtubeshorts') ||
    text.includes('trendingshorts') ||
    text.includes('#shortvideo') ||
    text.includes('shortvideo') ||
    text.includes('ytshorts') ||
    /\bshorts\b/.test(text)
  const sec = durationSec || item?.meta?.durationSec || 0
  if (tagged && (!sec || sec <= MAX_SHORT_SEC)) return true
  if (sec > 0 && sec <= 60) return true
  return false
}

export function toPlayerShort(item) {
  if (!item) return null
  const videoId = item.videoId || videoIdOf(item)
  if (!videoId) return null
  const sn = item.snippet || {}
  const views = item.views ?? item.meta?.views ?? item.statistics?.viewCount
  const likes = item.likes ?? item.statistics?.likeCount ?? item.meta?.likes
  const comments = item.comments ?? item.statistics?.commentCount ?? 0
  return {
    id: item.catalogId || item.id || videoId,
    videoId,
    title: item.title || sn.title || 'Short',
    description: item.description || sn.description || '',
    channelTitle: item.channelTitle || sn.channelTitle || 'Channel',
    channelId: item.channelId || sn.channelId || '',
    channelAvatar:
      item.channelAvatar ||
      item.meta?.channelAvatar ||
      '/favicon.ico',
    channelHandle: item.channelHandle || sn.customUrl || item.channelTitle || sn.channelTitle || '',
    views,
    likes,
    comments,
    publishedAt: item.publishedAt || sn.publishedAt || sn.publishTime,
    duration: item.duration || item.meta?.duration || clockFromSeconds(item.meta?.durationSec || 0),
    durationSec: item.durationSec || item.meta?.durationSec || 0,
    music: item.music || 'Original Audio',
    isShort: true,
  }
}

export function setShortsQueue(items = [], { query = '', source = 'feed' } = {}) {
  const shorts = (items || []).map(toPlayerShort).filter(Boolean)
  try {
    sessionStorage.setItem(
      QUEUE_KEY,
      JSON.stringify({
        items: shorts,
        query,
        source,
        savedAt: Date.now(),
      })
    )
  } catch (_) {
    /* ignore quota */
  }
  return shorts
}

export function getShortsQueue() {
  try {
    const raw = sessionStorage.getItem(QUEUE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!Array.isArray(data?.items)) return null
    return data
  } catch (_) {
    return null
  }
}

export async function keepOnlyShorts(items = [], excludeIds = [], { lenient = false } = {}) {
  const exclude = new Set((excludeIds || []).filter(Boolean))
  const unique = dedupeByVideoId(items || []).filter((it) => {
    const id = videoIdOf(it)
    return id && !exclude.has(id)
  })
  if (!unique.length) return []

  const stamp = (it, d, sec) => {
    const id = videoIdOf(it)
    return {
      ...it,
      snippet: { ...it.snippet, ...(d?.snippet || {}) },
      statistics: d?.statistics || it.statistics,
      contentDetails: d?.contentDetails || it.contentDetails,
      id: { kind: 'youtube#video', videoId: id },
      meta: {
        ...(it.meta || {}),
        videoId: id,
        isShort: true,
        durationSec: sec || it.meta?.durationSec || 0,
        duration: sec ? clockFromSeconds(sec) : it.meta?.duration || '',
        views: d?.statistics?.viewCount ?? it.statistics?.viewCount ?? it.meta?.views,
      },
    }
  }

  const ids = unique.map((it) => videoIdOf(it)).filter(Boolean)
  const details = { items: [] }
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = await getVideosByIds(ids.slice(i, i + 50))
    details.items.push(...(chunk?.items || []))
  }
  const byId = {}
  details.items.forEach((v) => {
    byId[v.id] = v
  })
  const hasDetails = details.items.length > 0

  if (!hasDetails) {
    return unique
      .filter((it) => lenient || looksLikeShort(it))
      .map((it) => stamp(it, null, it.meta?.durationSec || 0))
  }

  const out = []
  for (const it of unique) {
    const id = videoIdOf(it)
    const d = byId[id]
    const sec = parseIsoDuration(d?.contentDetails?.duration || it.contentDetails?.duration || '')
    const merged = { ...it, snippet: { ...it.snippet, ...(d?.snippet || {}) } }
    if (!looksLikeShort(merged, sec)) continue
    out.push(stamp(it, d, sec))
  }
  return out
}

export async function inspectVideoIsShort(videoId) {
  if (!videoId) return { ok: false }
  const data = await getVideosByIds([videoId])
  const v = data?.items?.[0]
  if (!v) {
    const fromQueue = getShortsQueue()?.items?.find((s) => s.videoId === videoId)
    if (fromQueue) return { ok: true, playerShort: fromQueue, durationSec: fromQueue.durationSec || 0 }
    return {
      ok: true,
      playerShort: toPlayerShort({ videoId, title: 'Short', meta: { isShort: true } }),
    }
  }
  const sec = parseIsoDuration(v.contentDetails?.duration)
  const ok = looksLikeShort(v, sec)
  return {
    ok,
    video: v,
    durationSec: sec,
    playerShort: ok
      ? toPlayerShort({
          ...v,
          videoId: v.id,
          meta: { isShort: true, durationSec: sec, views: v.statistics?.viewCount },
        })
      : null,
  }
}
