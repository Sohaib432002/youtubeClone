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
  },
  {
    id: 'ch_codewithharry',
    title: 'CodeWithHarry',
    handle: '@codewithharry',
    avatar: 'https://i.pravatar.cc/100?u=harry',
    subscribers: '5.8M',
    verified: true,
  },
  {
    id: 'ch_mrbeast',
    title: 'MrBeast',
    handle: '@mrbeast',
    avatar: 'https://i.pravatar.cc/100?u=mrbeast',
    subscribers: '320M',
    verified: true,
  },
  {
    id: 'ch_veritasium',
    title: 'Veritasium',
    handle: '@veritasium',
    avatar: 'https://i.pravatar.cc/100?u=veritasium',
    subscribers: '16M',
    verified: true,
  },
  {
    id: 'ch_freecodecamp',
    title: 'freeCodeCamp.org',
    handle: '@freecodecamp',
    avatar: 'https://i.pravatar.cc/100?u=fcc',
    subscribers: '10M',
    verified: true,
  },
  {
    id: 'ch_ted',
    title: 'TED',
    handle: '@TED',
    avatar: 'https://i.pravatar.cc/100?u=ted',
    subscribers: '25M',
    verified: true,
  },
  {
    id: 'ch_nba',
    title: 'NBA',
    handle: '@NBA',
    avatar: 'https://i.pravatar.cc/100?u=nba',
    subscribers: '22M',
    verified: true,
  },
  {
    id: 'ch_natgeo',
    title: 'National Geographic',
    handle: '@NatGeo',
    avatar: 'https://i.pravatar.cc/100?u=natgeo',
    subscribers: '24M',
    verified: true,
  },
  {
    id: 'ch_mkbhd',
    title: 'Marques Brownlee',
    handle: '@MKBHD',
    avatar: 'https://i.pravatar.cc/100?u=mkbhd',
    subscribers: '19M',
    verified: true,
  },
  {
    id: 'ch_fitness',
    title: 'ATHLEAN-X',
    handle: '@athleanx',
    avatar: 'https://i.pravatar.cc/100?u=athlean',
    subscribers: '13M',
    verified: true,
  },
  {
    id: 'ch_food',
    title: 'Tasty',
    handle: '@buzzfeedtasty',
    avatar: 'https://i.pravatar.cc/100?u=tasty',
    subscribers: '21M',
    verified: true,
  },
  {
    id: 'ch_travel',
    title: 'Kara and Nate',
    handle: '@karaandnate',
    avatar: 'https://i.pravatar.cc/100?u=travel',
    subscribers: '3.4M',
    verified: true,
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
  'aqz-KE-bpKQ',
  'LXb3EKWsInQ',
  'sGPrA0aG0y0',
  'fLexgOxsZu0',
  'tgbNymZ7vqY',
  'kXYiU_JCYtU',
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

function buildVideos() {
  const cats = CATEGORY_LIST.filter((c) => c !== 'All')
  return Array.from({ length: 72 }, (_, i) => {
    const channel = CHANNELS[i % CHANNELS.length]
    const videoId = YT_IDS[i % YT_IDS.length]
    const category = cats[i % cats.length]
    const views = Math.floor(12000 + ((i * 7919) % 9000000))
    const durationSec = 90 + ((i * 137) % 4200)
    const publishedAt = daysAgo((i * 3) % 900)
    const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    return {
      id: `vid_${i}_${videoId}`,
      videoId,
      title: `${TITLES[i % TITLES.length]}${i > TITLES.length ? ` (#${i})` : ''}`,
      description: `${TITLES[i % TITLES.length]}\n\nCategory: ${category}\nSubscribe to ${channel.title} for more.\n\n#${category.replace(/\s/g, '')} #YouTubeClone`,
      channelId: channel.id,
      channelTitle: channel.title,
      channelAvatar: channel.avatar,
      verified: channel.verified,
      category,
      views,
      likes: Math.floor(views * 0.04),
      comments: Math.floor(views * 0.002),
      publishedAt,
      duration: formatDuration(durationSec),
      durationSec,
      isShort: false,
      downloadable: i % 3 === 0,
      downloadUrl: i % 3 === 0 ? SAMPLE_MP4 : null,
      thumbnails: {
        default: { url: thumb },
        medium: { url: thumb },
        high: { url: thumb },
      },
    }
  })
}

function buildShorts() {
  return Array.from({ length: 48 }, (_, i) => {
    const channel = CHANNELS[i % CHANNELS.length]
    const videoId = YT_IDS[(i + 5) % YT_IDS.length]
    const views = Math.floor(50000 + ((i * 9973) % 12000000))
    const publishedAt = daysAgo(i % 60)
    const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    const captions = [
      'POV you finally fix the bug 🔥',
      'Gym tip that changed everything',
      'Quick React trick in 20 seconds',
      'Street food you must try',
      'Travel hack nobody talks about',
      'One AI prompt = insane results',
      'Math shortcut for exams',
      'Day in the life of a developer',
    ]
    return {
      id: `short_${i}_${videoId}`,
      videoId,
      title: captions[i % captions.length],
      description: captions[i % captions.length],
      channelId: channel.id,
      channelTitle: channel.title,
      channelAvatar: channel.avatar,
      channelHandle: channel.handle,
      verified: channel.verified,
      category: 'Shorts',
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
    }
  })
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
  const filtered =
    !category || category === 'All'
      ? VIDEOS
      : VIDEOS.filter(
          (v) =>
            v.category.toLowerCase() === category.toLowerCase() ||
            v.title.toLowerCase().includes(category.toLowerCase()) ||
            (category === 'Trending' && v.views > 500000) ||
            (category === 'Recently Uploaded' &&
              Date.now() - new Date(v.publishedAt).getTime() < 1000 * 60 * 60 * 24 * 30)
        )
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

export function getRelated(videoId, limit = 20) {
  const current = getCatalogVideo(videoId)
  const pool = VIDEOS.filter((v) => v.videoId !== videoId)
  const related = current
    ? [
        ...pool.filter((v) => v.category === current.category),
        ...pool.filter((v) => v.channelId === current.channelId),
        ...pool,
      ]
    : pool
  const seen = new Set()
  const unique = []
  for (const v of related) {
    if (seen.has(v.id)) continue
    seen.add(v.id)
    unique.push(v)
    if (unique.length >= limit) break
  }
  return unique.map(toSearchItem)
}

export function getShortsPage(start = 0, count = 12) {
  const slice = SHORTS.slice(start, start + count)
  return {
    items: slice,
    hasMore: start + count < SHORTS.length,
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
