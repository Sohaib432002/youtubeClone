/** Structured catalog — easy to replace with a real API later */

export const CATEGORY_LIST = [
  'All',
  'Trending',
  'Music',
  'Gaming',
  'Live',
  'News',
  'Sports',
  'Movies',
  'Comedy',
  'Education',
  'Technology',
  'Programming',
  'Science',
  'Mathematics',
  'AI',
  'Data Science',
  'Business',
  'Finance',
  'Podcasts',
  'Entertainment',
  'Travel',
  'Food',
  'Fitness',
  'Fashion',
  'Tutorials',
  'Documentary',
  'History',
  'Recently Uploaded',
]

const SAMPLE_MP4 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export const CHANNELS = [
  {
    id: 'ch_campusx',
    title: 'CampusX',
    handle: '@campusx',
    avatar: 'https://i.pravatar.cc/100?u=campusx',
    subscribers: '1.2M',
    verified: true,
    description:
      'Deep learning, data science, and AI tutorials for students and professionals.',
    banner: 'https://picsum.photos/seed/ch_campusx/1280/220',
  },
  {
    id: 'ch_codewithharry',
    title: 'CodeWithHarry',
    handle: '@codewithharry',
    avatar: 'https://i.pravatar.cc/100?u=harry',
    subscribers: '5.8M',
    verified: true,
    description: 'Programming courses — web development, Python, and more.',
    banner: 'https://picsum.photos/seed/ch_codewithharry/1280/220',
  },
  {
    id: 'ch_mrbeast',
    title: 'MrBeast',
    handle: '@mrbeast',
    avatar: 'https://i.pravatar.cc/100?u=mrbeast',
    subscribers: '320M',
    verified: true,
    description: 'Challenges, philanthropy, and epic stunts.',
    banner: 'https://picsum.photos/seed/ch_mrbeast/1280/220',
  },
  {
    id: 'ch_veritasium',
    title: 'Veritasium',
    handle: '@veritasium',
    avatar: 'https://i.pravatar.cc/100?u=veritasium',
    subscribers: '16M',
    verified: true,
    description: 'Science and engineering explained with curiosity.',
    banner: 'https://picsum.photos/seed/ch_veritasium/1280/220',
  },
  {
    id: 'ch_freecodecamp',
    title: 'freeCodeCamp.org',
    handle: '@freecodecamp',
    avatar: 'https://i.pravatar.cc/100?u=fcc',
    subscribers: '10M',
    verified: true,
    description: 'Learn to code for free — full courses on web and data.',
    banner: 'https://picsum.photos/seed/ch_freecodecamp/1280/220',
  },
  {
    id: 'ch_ted',
    title: 'TED',
    handle: '@TED',
    avatar: 'https://i.pravatar.cc/100?u=ted',
    subscribers: '25M',
    verified: true,
    description: 'Ideas worth spreading from thinkers around the world.',
    banner: 'https://picsum.photos/seed/ch_ted/1280/220',
  },
  {
    id: 'ch_nba',
    title: 'NBA',
    handle: '@NBA',
    avatar: 'https://i.pravatar.cc/100?u=nba',
    subscribers: '22M',
    verified: true,
    description: 'Official NBA highlights, analysis, and exclusive content.',
    banner: 'https://picsum.photos/seed/ch_nba/1280/220',
  },
  {
    id: 'ch_natgeo',
    title: 'National Geographic',
    handle: '@NatGeo',
    avatar: 'https://i.pravatar.cc/100?u=natgeo',
    subscribers: '24M',
    verified: true,
    description: 'Explore the world through documentaries and wildlife.',
    banner: 'https://picsum.photos/seed/ch_natgeo/1280/220',
  },
  {
    id: 'ch_mkbhd',
    title: 'Marques Brownlee',
    handle: '@MKBHD',
    avatar: 'https://i.pravatar.cc/100?u=mkbhd',
    subscribers: '19M',
    verified: true,
    description: 'Tech reviews and thoughtful takes on consumer gadgets.',
    banner: 'https://picsum.photos/seed/ch_mkbhd/1280/220',
  },
  {
    id: 'ch_fitness',
    title: 'ATHLEAN-X',
    handle: '@athleanx',
    avatar: 'https://i.pravatar.cc/100?u=athlean',
    subscribers: '13M',
    verified: true,
    description: 'Science-based fitness training and injury prevention.',
    banner: 'https://picsum.photos/seed/ch_fitness/1280/220',
  },
  {
    id: 'ch_food',
    title: 'Tasty',
    handle: '@buzzfeedtasty',
    avatar: 'https://i.pravatar.cc/100?u=tasty',
    subscribers: '21M',
    verified: true,
    description: 'Recipes and food ideas you can make at home.',
    banner: 'https://picsum.photos/seed/ch_food/1280/220',
  },
  {
    id: 'ch_travel',
    title: 'Kara and Nate',
    handle: '@karaandnate',
    avatar: 'https://i.pravatar.cc/100?u=travel',
    subscribers: '3.4M',
    verified: true,
    description: 'Travel vlogs from around the globe.',
    banner: 'https://picsum.photos/seed/ch_travel/1280/220',
  },
]

const YT_IDS = [
  'u9ncYCyPHtI',
  '5wFCY-duMX4',
  '0TRNSZdvID4',
  'xs_auAmh7MA',
  'BZ9rH4xKMBQ',
  'LuAFkBGioYY',
  'vFjiUJ74A_k',
  'ibV3iGwqyY8',
  '7VaeH3WcpKM',
  'o7a7Civit78',
  'dQw4w9WgXcQ',
  'jNQXAC9IVRw',
  '9bZkp7q19f0',
  'kJQP7kiw5Fk',
  'OPf0YbXqDm0',
  'fJ9rUzIMcZQ',
  'hTWKbfoikeg',
  'CevxZvSJLk8',
  'RgKAFK5djSk',
  'e-ORhEE9VVg',
  'YQHsXMglC9A',
  'pRpeEdMmmQ0',
  'JGwWNGJdvx8',
  '2Vv-BfVoq4g',
  'lp-EO5I60KA',
  '09R8_2nJtjg',
  'SlPhMPnQ58k',
  '60ItHLz5WEA',
  'hT_nvWreIhg',
  'iSHyrINi6zM',
  'PT2_F-1esPk',
  'Rg_3uO_rVJQ',
  'UceaB4D0jpo',
  '3tmd-ClpJxA',
  'LXb3EKWsInQ',
  'sGPrA0aG0y0',
  'aqz-KE-bpKQ',
  'ScMzIvxBSi4',
  'BaW_jenozKc',
  'M7lc1UVf-VE',
  'ysz5S6PUM-U',
  'WsptdUFthWI',
  'fLexgOxsZu0',
  'tgbNymZ7vqY',
  'kXYiU_JCYtU',
  'lTTajzrSkCw',
  'Zi_XLOBDo_Y',
  'ktvTqknDobU',
  'fNk_zzaMoSs',
  'RBumgq5yVrA',
  'E7wq4O6DVes',
  'V-_O7nl0Ii0',
  'IlNAJl36-1w',
  'DWcJFNfaw9c',
  'QH2-TGUlwu4',
  'astISOttCQ0',
  'L_LUpnjgPso',
  'ZbZSe6N_BXs',
  'cdwal5Kw3Fc',
  'iik25wqIuFo',
]

const SHORT_CAPTIONS = [
  'POV you finally fix the bug 🔥',
  'Gym tip that changed everything',
  'Quick React trick in 20 seconds',
  'Street food you must try',
  'Travel hack nobody talks about',
  'One AI prompt = insane results',
  'Math shortcut for exams',
  'Day in the life of a developer',
  'This CSS trick is underrated',
  '30-second morning stretch',
  'Budget travel packing list',
  'Why your API is slow',
  'Clean your desk in 15 seconds',
  'Guitar riff you need to learn',
  'Cooking rice the right way',
  'Football skill move tutorial',
  ' ast that actually works',
  'Hidden feature in Chrome',
  'Study with me — focus timer',
  'Makeup hack for busy mornings',
  'Python one-liner magic',
  'NBA highlight of the week',
  'Science fact that blew my mind',
  'Startup pitch in 20 seconds',
]

const TITLES = [
  'Vanishing Gradient Problem in ANN | Deep Learning',
  'Full React Course for Beginners — Build 5 Projects',
  'I Survived 50 Hours in Antarctica',
  'The Science of Black Holes Explained',
  'Python for Data Science — Complete Tutorial',
  'Top 10 Goals of the Season | NBA Highlights',
  'How AI Will Change Everything in 2026',
  'Building a Startup From Zero to $1M',
  'Travel Vlog: 7 Days in Northern Pakistan',
  'Homemade Biryani — Restaurant Style Recipe',
  'Perfect Push-Up Form (Avoid These Mistakes)',
  'History of the Indus Valley Civilization',
  'JavaScript Async/Await Deep Dive',
  'Machine Learning Crash Course',
  'Live Coding: Build a YouTube Clone',
  'Documentary: Life Inside a Volcano',
  'Podcast: Future of Remote Work',
  'Mathematics: Linear Algebra Explained Simply',
  'Fashion Trends You Need to Know',
  'Finance 101: Investing for Beginners',
  'Comedy Special — Stand Up Night',
  'Gaming: Epic Ranked Comeback',
  'News Today — Global Markets Update',
  'Tutorial: Docker & Kubernetes Basics',
  'Fitness Challenge — 30 Day Transformation',
  'Food Tour Across Street Markets',
  'Science Experiments You Can Try at Home',
  'Programming Tips That Save Hours',
  'AI Agents Explained in 15 Minutes',
  'Data Science Portfolio Projects',
  'Business Strategy Case Study',
  'Entertainment Roundup — This Week',
  'Trending Songs Mix 2026',
  'Recently Uploaded Tech Reviews',
  'Education: How Memory Works',
  'Sports Analysis — Match Breakdown',
]

const CATEGORY_TITLE_PREFIX = {
  Trending: 'Trending Now',
  Music: 'Music Mix',
  Gaming: 'Gaming',
  Live: 'Live',
  News: 'News Update',
  Sports: 'Sports Highlights',
  Movies: 'Movie Recap',
  Comedy: 'Comedy',
  Education: 'Learn',
  Technology: 'Tech',
  Programming: 'Code',
  Science: 'Science',
  Mathematics: 'Math',
  AI: 'AI Explained',
  'Data Science': 'Data Science',
  Business: 'Business',
  Finance: 'Finance Tips',
  Podcasts: 'Podcast',
  Entertainment: 'Entertainment',
  Travel: 'Travel',
  Food: 'Food',
  Fitness: 'Fitness',
  Fashion: 'Fashion',
  Tutorials: 'Tutorial',
  Documentary: 'Documentary',
  History: 'History',
  'Recently Uploaded': 'Just Uploaded',
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function formatDuration(totalSec) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Build enough unique videos per category so chips actually change the feed */
function buildVideos() {
  const cats = CATEGORY_LIST.filter((c) => c !== 'All')
  const perCat = 10
  const list = []
  let n = 0
  cats.forEach((category) => {
    for (let j = 0; j < perCat; j += 1) {
      const channel = CHANNELS[n % CHANNELS.length]
      const videoId = YT_IDS[n % YT_IDS.length]
      const views = Math.floor(12000 + ((n * 7919) % 9000000))
      const durationSec = 90 + ((n * 137) % 4200)
      const publishedAt = daysAgo(
        category === 'Recently Uploaded' ? n % 14 : (n * 3) % 900
      )
      const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      const prefix = CATEGORY_TITLE_PREFIX[category] || category
      const baseTitle = TITLES[n % TITLES.length]
      list.push({
        id: `vid_${category.replace(/\s/g, '_')}_${j}_${videoId}`,
        videoId,
        title: `${prefix}: ${baseTitle}${j > 0 ? ` · Part ${j + 1}` : ''}`,
        description: `${baseTitle}\n\nCategory: ${category}\nSubscribe to ${channel.title} for more.\n\n#${category.replace(/\s/g, '')} #YouTubeClone`,
        channelId: channel.id,
        channelTitle: channel.title,
        channelAvatar: channel.avatar,
        verified: channel.verified,
        category,
        views: category === 'Trending' ? views + 800000 : views,
        likes: Math.floor(views * 0.04),
        comments: Math.floor(views * 0.002),
        publishedAt,
        duration: formatDuration(durationSec),
        durationSec,
        isShort: false,
        downloadable: n % 3 === 0,
        downloadUrl: n % 3 === 0 ? SAMPLE_MP4 : null,
        thumbnails: {
          default: { url: thumb },
          medium: { url: thumb },
          high: { url: thumb },
        },
      })
      n += 1
    }
  })
  return list
}

function buildShorts() {
  const list = []
  const seenIds = new Set()
  for (let i = 0; i < 60; i += 1) {
    const channel = CHANNELS[i % CHANNELS.length]
    // Walk YT_IDS with a stride so shorts don't mirror the long-form feed order
    let videoId = YT_IDS[(i * 3 + 7) % YT_IDS.length]
    let guard = 0
    while (seenIds.has(videoId) && guard < YT_IDS.length) {
      videoId = YT_IDS[(i * 3 + 7 + guard + 1) % YT_IDS.length]
      guard += 1
    }
    seenIds.add(videoId)
    const views = Math.floor(50000 + ((i * 9973) % 12000000))
    const publishedAt = daysAgo(i % 60)
    const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    const caption = SHORT_CAPTIONS[i % SHORT_CAPTIONS.length]
    const cats = CATEGORY_LIST.filter((c) => !['All', 'Live', 'Recently Uploaded'].includes(c))
    const category = cats[i % cats.length]
    list.push({
      id: `short_${i}_${videoId}`,
      videoId,
      title: `${caption}${i >= SHORT_CAPTIONS.length ? ` #${i + 1}` : ''}`,
      description: `${caption}\n#shorts #${category.replace(/\s/g, '')}`,
      channelId: channel.id,
      channelTitle: channel.title,
      channelAvatar: channel.avatar,
      channelHandle: channel.handle,
      verified: channel.verified,
      category,
      views,
      likes: Math.floor(views * 0.08),
      comments: Math.floor(20 + (i % 400)),
      publishedAt,
      duration: '0:45',
      durationSec: 45,
      isShort: true,
      downloadable: i % 4 === 0,
      downloadUrl: i % 4 === 0 ? SAMPLE_MP4 : null,
      music: 'Original Audio · YouTube Clone',
      thumbnails: {
        default: { url: thumb },
        medium: { url: thumb },
        high: { url: thumb },
      },
    })
  }
  return list
}

export const VIDEOS = buildVideos()
export const SHORTS = buildShorts()

export function toSearchItem(v) {
  return {
    kind: 'youtube#searchResult',
    id: { kind: 'youtube#video', videoId: v.videoId },
    etag: v.id,
    catalogId: v.id,
    snippet: {
      publishedAt: v.publishedAt,
      channelId: v.channelId,
      title: v.title,
      description: v.description,
      thumbnails: v.thumbnails,
      channelTitle: v.channelTitle,
      publishTime: v.publishedAt,
    },
    statistics: {
      viewCount: String(v.views),
      likeCount: String(v.likes),
      commentCount: String(v.comments),
    },
    contentDetails: { duration: v.duration },
    meta: v,
  }
}

export function getVideosByCategory(category = 'All', page = 0, pageSize = 24) {
  let filtered = VIDEOS
  if (category && category !== 'All') {
    const key = category.toLowerCase()
    if (category === 'Trending') {
      filtered = [...VIDEOS]
        .filter((v) => v.category === 'Trending' || v.views > 400000)
        .sort((a, b) => b.views - a.views)
    } else if (category === 'Recently Uploaded') {
      filtered = [...VIDEOS]
        .filter(
          (v) =>
            v.category === 'Recently Uploaded' ||
            Date.now() - new Date(v.publishedAt).getTime() < 1000 * 60 * 60 * 24 * 30
        )
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    } else {
      // Exact category first — avoids every chip showing the same mixed feed
      const exact = VIDEOS.filter((v) => v.category.toLowerCase() === key)
      filtered = exact.length
        ? exact
        : VIDEOS.filter(
            (v) =>
              v.title.toLowerCase().includes(key) ||
              v.description.toLowerCase().includes(`category: ${key}`)
          )
    }
  }
  const start = page * pageSize
  const slice = filtered.slice(start, start + pageSize)
  return {
    items: slice.map(toSearchItem),
    total: filtered.length,
    hasMore: start + pageSize < filtered.length,
    nextPage: page + 1,
  }
}

export function searchCatalog(query = '', category = 'All') {
  const q = query.trim().toLowerCase()
  let list = [...VIDEOS, ...SHORTS.filter((s) => !q)]
  if (category && category !== 'All') {
    list = VIDEOS.filter(
      (v) =>
        v.category.toLowerCase() === category.toLowerCase() ||
        v.title.toLowerCase().includes(category.toLowerCase())
    )
  }
  if (q) {
    list = [...VIDEOS, ...SHORTS].filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.channelTitle.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    )
  }
  return { items: list.map(toSearchItem), total: list.length }
}

export function getCatalogVideo(videoId) {
  return VIDEOS.find((v) => v.videoId === videoId || v.id === videoId) ||
    SHORTS.find((v) => v.videoId === videoId || v.id === videoId) ||
    null
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are',
  'you', 'your', 'this', 'that', 'from', 'how', 'what', 'why', 'when', 'full', 'complete',
  'video', 'official', 'part', 'episode', 'watch', 'new', 'best', 'top',
])

/** Extract meaningful tokens from a title / description for related scoring */
export function extractKeywords(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[#|·•]/g, ' ')
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
}

function scoreRelated(candidate, current, keywords) {
  let score = 0
  const title = `${candidate.title} ${candidate.description}`.toLowerCase()
  if (current?.category && candidate.category === current.category) score += 50
  if (current?.channelId && candidate.channelId === current.channelId) score += 25
  keywords.forEach((kw) => {
    if (candidate.title.toLowerCase().includes(kw)) score += 12
    else if (title.includes(kw)) score += 4
  })
  // Prefer longer-form catalog videos
  if (!candidate.isShort && (candidate.durationSec || 0) >= 90) score += 8
  return score
}

/**
 * Related videos: long-form only (no Shorts), ranked by category / channel / keywords.
 */
export function getRelated(videoId, limit = 20, hint = {}) {
  const current = getCatalogVideo(videoId)
  const titleHint = hint.title || current?.title || ''
  const categoryHint = hint.category || current?.category || ''
  const channelHint = hint.channelId || current?.channelId || ''
  const keywords = extractKeywords(
    `${titleHint} ${categoryHint} ${hint.description || current?.description || ''}`
  )

  const currentMeta = current || {
    category: categoryHint,
    channelId: channelHint,
    title: titleHint,
  }

  // Never include Shorts in related
  const pool = VIDEOS.filter(
    (v) => v.videoId !== videoId && !v.isShort && (v.durationSec || 120) >= 60
  )

  const ranked = pool
    .map((v) => ({ v, score: scoreRelated(v, currentMeta, keywords) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  // If too few strong matches, fill with same-category then same-channel only (still no random dump)
  const picked = []
  const seen = new Set()
  const push = (v) => {
    if (!v || seen.has(v.id) || seen.has(v.videoId)) return
    seen.add(v.id)
    seen.add(v.videoId)
    picked.push(v)
  }

  ranked.forEach(({ v }) => {
    if (picked.length < limit) push(v)
  })

  if (picked.length < Math.min(8, limit) && categoryHint) {
    pool
      .filter((v) => v.category === categoryHint)
      .forEach((v) => {
        if (picked.length < limit) push(v)
      })
  }

  if (picked.length < Math.min(6, limit) && channelHint) {
    pool
      .filter((v) => v.channelId === channelHint)
      .forEach((v) => {
        if (picked.length < limit) push(v)
      })
  }

  return picked.slice(0, limit).map((v) => {
    const item = toSearchItem(v)
    // Force landscape YouTube thumbnails (mq/hq are 16:9)
    const landscape = `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`
    item.snippet.thumbnails = {
      default: { url: landscape },
      medium: { url: landscape },
      high: { url: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg` },
    }
    return item
  })
}

/** True if a search/API item looks like a Short */
export function isShortSearchItem(item) {
  if (!item) return true
  if (item.meta?.isShort) return true
  const title = (item.snippet?.title || '').toLowerCase()
  const desc = (item.snippet?.description || '').toLowerCase()
  if (title.includes('#shorts') || title.includes('#short')) return true
  if (desc.includes('#shorts')) return true
  if (item.meta?.durationSec && item.meta.durationSec > 0 && item.meta.durationSec <= 60) {
    return true
  }
  return false
}

export function getShortsPage(start = 0, count = 12, category = 'All') {
  let pool = SHORTS
  if (category && category !== 'All' && category !== 'Shorts') {
    const key = category.toLowerCase()
    const matched = SHORTS.filter(
      (s) =>
        s.category.toLowerCase() === key ||
        s.title.toLowerCase().includes(key) ||
        s.description.toLowerCase().includes(key)
    )
    pool = matched.length >= 6 ? matched : SHORTS
  }
  // Deduplicate by videoId so the rail never shows the same clip twice
  const unique = []
  const seen = new Set()
  for (const s of pool) {
    if (seen.has(s.videoId)) continue
    seen.add(s.videoId)
    unique.push(s)
  }
  const slice = unique.slice(start, start + count)
  return {
    items: slice,
    hasMore: start + count < unique.length,
    next: start + count,
  }
}

export function getSubscriptionsPreview() {
  return CHANNELS.map((c, i) => ({
    ...c,
    hasNew: i % 3 === 0,
    isLive: i === 2,
  }))
}
