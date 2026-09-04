import { extractKeywords } from '../data/mockCatalog'

/** Always use YouTube 16:9 mq/hq thumbnails (not vertical Shorts crops). */
export function landscapeThumbnail(videoId, fallback = '') {
  if (videoId) return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
  return fallback || ''
}

export function isShortLikeItem(item) {
  if (!item) return true
  if (item.meta?.isShort) return true
  const title = (item?.snippet?.title || item?.meta?.title || '').toLowerCase()
  const desc = (item?.snippet?.description || '').toLowerCase()
  if (title.includes('#shorts') || title.includes('#short') || title.includes(' shorts')) {
    return true
  }
  if (desc.includes('#shorts')) return true
  const sec = item.meta?.durationSec
  if (typeof sec === 'number' && sec > 0 && sec <= 60) return true
  return false
}

/**
 * Does this video meaningfully match a home category chip?
 * Avoids stuffing Music/Gaming/etc. with unrelated live API noise.
 */
export function matchesHomeCategory(item, category) {
  if (!category || category === 'All') return true
  if (category === 'Trending' || category === 'Recently Uploaded') return true

  const metaCat = (item.meta?.category || '').toLowerCase()
  const key = category.toLowerCase()
  if (metaCat && metaCat === key) return true

  const text = `${item.snippet?.title || ''} ${item.snippet?.description || ''} ${
    item.snippet?.channelTitle || ''
  }`.toLowerCase()

  if (text.includes(key)) return true

  const tokens = extractKeywords(category)
  const hits = tokens.filter((t) => text.includes(t)).length
  return hits >= 1
}

/** Rank items by keyword overlap with a topic string (title or category). */
export function scoreAgainstTopic(item, topic = '') {
  const keywords = extractKeywords(topic)
  if (!keywords.length) return 0
  const text = `${item.snippet?.title || ''} ${item.snippet?.description || ''}`.toLowerCase()
  let score = 0
  keywords.forEach((kw) => {
    if ((item.snippet?.title || '').toLowerCase().includes(kw)) score += 10
    else if (text.includes(kw)) score += 3
  })
  if (item.meta?.category && topic.toLowerCase().includes(String(item.meta.category).toLowerCase())) {
    score += 15
  }
  return score
}

export function sortByTopicRelevance(items, topic) {
  return [...items].sort(
    (a, b) => scoreAgainstTopic(b, topic) - scoreAgainstTopic(a, topic)
  )
}

export function normalizeFeedItem(it, category = 'All') {
  const videoId =
    (typeof it?.id === 'string' && it.id) || it?.id?.videoId || it?.meta?.videoId
  if (!videoId || !it?.snippet) return null
  if (isShortLikeItem(it)) return null
  const thumb = landscapeThumbnail(videoId)
  return {
    ...it,
    id: { kind: 'youtube#video', videoId },
    snippet: {
      ...it.snippet,
      thumbnails: {
        default: { url: thumb },
        medium: { url: thumb },
        high: { url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` },
      },
    },
    meta: {
      ...(it.meta || {}),
      videoId,
      isShort: false,
      category: it.meta?.category || category,
      duration: it.meta?.duration || it.contentDetails?.duration || '',
      views: it.meta?.views ?? it.statistics?.viewCount,
    },
  }
}
