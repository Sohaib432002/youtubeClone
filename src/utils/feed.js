import { extractKeywords } from '../data/mockCatalog'
import { inferCategoryFromText, scoreCategoryMatch } from './categoryMatch'

/** Always use YouTube 16:9 mq/hq thumbnails (not vertical Shorts crops). */
export function landscapeThumbnail(videoId, fallback = '') {
  if (videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
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

function itemText(item) {
  return `${item.snippet?.title || ''} ${item.snippet?.description || ''} ${
    item.snippet?.channelTitle || ''
  } ${(item.meta?.tags || []).join(' ')}`
}

/**
 * Does this video meaningfully match a home category chip?
 * Requires meta category OR strong keyword/synonym overlap.
 */
export function matchesHomeCategory(item, category) {
  if (!category || category === 'All') return true
  if (category === 'Trending' || category === 'Recently Uploaded') return true

  const metaCat = (item.meta?.category || '').toLowerCase()
  const key = category.toLowerCase()
  if (metaCat && metaCat === key) return true

  // Do not treat stamped/fallback category as proof — score the text
  return scoreCategoryMatch(itemText(item), category) >= 24
}

/** Rank items by keyword overlap with a topic string (title or category). */
export function scoreAgainstTopic(item, topic = '') {
  const keywords = extractKeywords(topic)
  const text = itemText(item).toLowerCase()
  let score = scoreCategoryMatch(text, topic)

  keywords.forEach((kw) => {
    if ((item.snippet?.title || '').toLowerCase().includes(kw)) score += 10
    else if (text.includes(kw)) score += 3
  })

  if (
    item.meta?.category &&
    topic &&
    String(item.meta.category).toLowerCase() === String(topic).toLowerCase()
  ) {
    score += 25
  }
  return score
}

export function sortByTopicRelevance(items, topic) {
  return [...items].sort(
    (a, b) => scoreAgainstTopic(b, topic) - scoreAgainstTopic(a, topic)
  )
}

/**
 * Normalize feed item. Only stamp category when it truly matches,
 * otherwise infer or leave empty — prevents fake category pollution.
 */
export function normalizeFeedItem(it, category = 'All') {
  const videoId =
    (typeof it?.id === 'string' && it.id) || it?.id?.videoId || it?.meta?.videoId
  if (!videoId || !it?.snippet) return null
  if (isShortLikeItem(it)) return null
  const thumb = landscapeThumbnail(videoId)

  const existingCat = it.meta?.category || ''
  let resolvedCategory = existingCat
  if (!resolvedCategory || resolvedCategory === 'All') {
    const inferred = inferCategoryFromText(
      `${it.snippet.title} ${it.snippet.description || ''}`,
      category !== 'All' ? category : ''
    )
    // Only accept selected chip category if text actually matches
    if (category && category !== 'All' && category !== 'Trending') {
      const ok =
        scoreCategoryMatch(`${it.snippet.title} ${it.snippet.description || ''}`, category) >=
          24 ||
        (existingCat && existingCat.toLowerCase() === category.toLowerCase())
      resolvedCategory = ok ? category : inferred || existingCat || ''
    } else {
      resolvedCategory = inferred || existingCat || ''
    }
  }

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
      category: resolvedCategory,
      duration: it.meta?.duration || it.contentDetails?.duration || '',
      views: it.meta?.views ?? it.statistics?.viewCount,
    },
  }
}
