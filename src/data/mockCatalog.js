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
  'Breakfast that actually works',
  'Hidden feature in Chrome',
  'Study with me — focus timer',
  'Makeup hack for busy mornings',
  'Python one-liner magic',
  'NBA highlight of the week',
  'Science fact that blew my mind',
  'Startup pitch in 20 seconds',
]

/**
 * Real YouTube videoId + real title pairs (thumbnail always matches title).
 * Each entry lists categories it can appear under.
 */
const MATCHED_VIDEOS = [
  { videoId: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)', channelTitle: 'Rick Astley', categories: ['Music', 'Trending', 'Entertainment'] },
  { videoId: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', channelTitle: 'Luis Fonsi', categories: ['Music', 'Trending'] },
  { videoId: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars', channelTitle: 'Mark Ronson', categories: ['Music', 'Entertainment'] },
  { videoId: 'fJ9rUzIMcZQ', title: 'Queen – Bohemian Rhapsody (Official Video Remastered)', channelTitle: 'Queen Official', categories: ['Music', 'Trending'] },
  { videoId: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE (강남스타일) M/V', channelTitle: 'officialpsy', categories: ['Music', 'Trending', 'Entertainment'] },
  { videoId: 'CevxZvSJLk8', title: 'Katy Perry - Roar (Official)', channelTitle: 'Katy Perry', categories: ['Music'] },
  { videoId: 'RgKAFK5djSk', title: 'Wiz Khalifa - See You Again ft. Charlie Puth [Official Video]', channelTitle: 'Wiz Khalifa', categories: ['Music', 'Entertainment'] },
  { videoId: 'e-ORhEE9VVg', title: 'Taylor Swift - Blank Space', channelTitle: 'Taylor Swift', categories: ['Music'] },
  { videoId: 'YQHsXMglC9A', title: 'Adele - Hello (Official Music Video)', channelTitle: 'Adele', categories: ['Music', 'Trending'] },
  { videoId: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You (Official Video)', channelTitle: 'Ed Sheeran', categories: ['Music'] },
  { videoId: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect (Official Music Video)', channelTitle: 'Ed Sheeran', categories: ['Music'] },
  { videoId: '60ItHLz5WEA', title: 'Alan Walker - Faded', channelTitle: 'Alan Walker', categories: ['Music', 'Entertainment'] },
  { videoId: 'pRpeEdMmmQ0', title: 'Shakira - Waka Waka (This Time for Africa)', channelTitle: 'Shakira', categories: ['Music', 'Sports'] },
  { videoId: 'lp-EO5I60KA', title: 'Adele - Someone Like You (Official Music Video)', channelTitle: 'Adele', categories: ['Music'] },
  { videoId: 'hTWKbfoikeg', title: 'a-ha - Take On Me (Official Video)', channelTitle: 'a-ha', categories: ['Music'] },
  { videoId: '09R8_2nJtjg', title: 'John Legend - All of Me (Official Video)', channelTitle: 'John Legend', categories: ['Music'] },
  { videoId: 'SlPhMPnQ58k', title: 'Avicii - Wake Me Up (Official Video)', channelTitle: 'Avicii', categories: ['Music', 'Entertainment'] },
  { videoId: 'kXYiU_JCYtU', title: 'Linkin Park - Numb (Official Music Video)', channelTitle: 'Linkin Park', categories: ['Music'] },
  { videoId: 'ktvTqknDobU', title: 'Imagine Dragons - Radioactive', channelTitle: 'Imagine Dragons', categories: ['Music'] },
  { videoId: 'fNk_zzaMoSs', title: 'Imagine Dragons - Believer', channelTitle: 'Imagine Dragons', categories: ['Music', 'Trending'] },

  { videoId: 'M7lc1UVf-VE', title: 'YouTube Developers Live: Embedded Web Player Customization', channelTitle: 'Google Developers', categories: ['Technology', 'Programming', 'Tutorials'] },
  { videoId: 'rfscVS0vtbw', title: 'Learn Python - Full Course for Beginners [Tutorial]', channelTitle: 'freeCodeCamp.org', categories: ['Programming', 'Education', 'Tutorials', 'Trending'] },
  { videoId: 'PkZNo7MFNFg', title: 'Learn JavaScript - Full Course for Beginners', channelTitle: 'freeCodeCamp.org', categories: ['Programming', 'Education', 'Tutorials'] },
  { videoId: 'W6NZfCO5SIk', title: 'JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour', channelTitle: 'Programming with Mosh', categories: ['Programming', 'Tutorials', 'Education'] },
  { videoId: 'Ke90Tje7VS0', title: 'React JS - React Tutorial for Beginners', channelTitle: 'Programming with Mosh', categories: ['Programming', 'Technology', 'Tutorials'] },
  { videoId: 'aircAruvnKk', title: 'But what is a neural network? | Deep learning', channelTitle: '3Blue1Brown', categories: ['AI', 'Science', 'Education', 'Mathematics'] },
  { videoId: 'IHZwWFHWa-w', title: 'Gradient descent, how neural networks learn | Deep learning', channelTitle: '3Blue1Brown', categories: ['AI', 'Mathematics', 'Education'] },
  { videoId: 'Ilg3gGewQ5U', title: 'What is backpropagation really doing? | Deep learning', channelTitle: '3Blue1Brown', categories: ['AI', 'Science', 'Education'] },
  { videoId: 'RBSGKlAvoiM', title: 'Data Structures Easy to Advanced Course', channelTitle: 'freeCodeCamp.org', categories: ['Programming', 'Education', 'Data Science'] },
  { videoId: '8hly31xKli0', title: 'Algorithms and Data Structures Tutorial - Full Course', channelTitle: 'freeCodeCamp.org', categories: ['Programming', 'Education'] },
  { videoId: 'ua-CiDNNj30', title: 'Learn Data Science Tutorial - Full Course for Beginners', channelTitle: 'freeCodeCamp.org', categories: ['Data Science', 'Education', 'Programming'] },
  { videoId: 'GPVsHOlRBBI', title: 'Machine Learning Course for Beginners', channelTitle: 'freeCodeCamp.org', categories: ['AI', 'Data Science', 'Education'] },
  { videoId: 'n_dfcAwx5VA', title: 'Git and GitHub for Beginners - Crash Course', channelTitle: 'freeCodeCamp.org', categories: ['Programming', 'Tutorials', 'Technology'] },
  { videoId: '3EMtTkZvJVA', title: 'SQL Tutorial - Full Database Course for Beginners', channelTitle: 'freeCodeCamp.org', categories: ['Programming', 'Data Science', 'Tutorials'] },
  { videoId: 'Z1RJmh_OqeA', title: 'Flask Tutorial - Python Web Development', channelTitle: 'freeCodeCamp.org', categories: ['Programming', 'Tutorials'] },

  { videoId: 'LXb3EKWsInQ', title: 'COSTA RICA IN 4K 60fps HDR (ULTRA HD)', channelTitle: 'Jacob + Katie Schwarz', categories: ['Travel', 'Documentary', 'Trending', 'Technology'] },
  { videoId: 'sGPrA0aG0y0', title: 'Earth - Our Home in 4K', channelTitle: 'Amazing Nature', categories: ['Documentary', 'Science', 'Travel'] },
  { videoId: 'aqz-KE-bpKQ', title: 'Big Buck Bunny 60fps 4K - Blender Open Movie', channelTitle: 'Blender', categories: ['Movies', 'Entertainment', 'Trending', 'Technology'] },
  { videoId: 'BaW_jenozKc', title: 'Me at the zoo', channelTitle: 'jawed', categories: ['Trending', 'Recently Uploaded', 'Entertainment'] },
  { videoId: 'jNQXAC9IVRw', title: 'Me at the zoo (First YouTube Video)', channelTitle: 'jawed', categories: ['History', 'Trending', 'Recently Uploaded'] },

  { videoId: 'hT_nvWreIhg', title: 'OneRepublic - Counting Stars', channelTitle: 'OneRepublic', categories: ['Music', 'Entertainment'] },
  { videoId: 'iSHyrINi6zM', title: 'The Chainsmokers - Closer ft. Halsey', channelTitle: 'The Chainsmokers', categories: ['Music'] },
  { videoId: 'PT2_F-1esPk', title: 'The Weeknd - Starboy ft. Daft Punk', channelTitle: 'The Weeknd', categories: ['Music'] },
  { videoId: 'UceaB4D0jpo', title: 'Post Malone - Congratulations ft. Quavo', channelTitle: 'Post Malone', categories: ['Music'] },
  { videoId: '3tmd-ClpJxA', title: 'Sia - Chandelier (Official Video)', channelTitle: 'Sia', categories: ['Music', 'Entertainment'] },
  { videoId: 'RBumgq5yVrA', title: 'Passenger | Let Her Go (Official Video)', channelTitle: 'Passenger', categories: ['Music'] },
  { videoId: 'Zi_XLOBDo_Y', title: 'The Weeknd - The Hills', channelTitle: 'The Weeknd', categories: ['Music'] },
  { videoId: 'lTTajzrSkCw', title: 'Maroon 5 - Sugar (Official Music Video)', channelTitle: 'Maroon 5', categories: ['Music', 'Entertainment'] },
  { videoId: 'E7wq4O6DVes', title: 'Coldplay - Hymn For The Weekend (Official Video)', channelTitle: 'Coldplay', categories: ['Music'] },

  { videoId: 'IlNAJl36-1w', title: 'National Geographic Short Film Showcase', channelTitle: 'National Geographic', categories: ['Documentary', 'Science', 'Travel'] },
  { videoId: 'DWcJFNfaw9c', title: 'Planet Earth Moments', channelTitle: 'BBC Earth', categories: ['Documentary', 'Science', 'Nature'] },
  { videoId: 'L_LUpnjgPso', title: 'TED Talks Inspiration', channelTitle: 'TED', categories: ['Education', 'Business', 'Podcasts'] },
  { videoId: 'ZbZSe6N_BXs', title: 'Pharrell Williams - Happy (Official Music Video)', channelTitle: 'Pharrell Williams', categories: ['Music', 'Entertainment', 'Comedy'] },
  { videoId: 'cdwal5Kw3Fc', title: 'Bruno Mars - The Lazy Song (Official Video)', channelTitle: 'Bruno Mars', categories: ['Music', 'Comedy'] },
  { videoId: 'iik25wqIuFo', title: 'Sia - Elastic Heart feat. Shia LaBeouf & Maddie Ziegler', channelTitle: 'Sia', categories: ['Music', 'Entertainment'] },
  { videoId: 'WsptdUFthWI', title: 'Calvin Harris - Summer (Official Video)', channelTitle: 'Calvin Harris', categories: ['Music'] },
  { videoId: 'fLexgOxsZu0', title: 'Ellie Goulding - Love Me Like You Do', channelTitle: 'Ellie Goulding', categories: ['Music', 'Movies'] },
  { videoId: 'astISOttCQ0', title: 'Clean Bandit - Rather Be ft. Jess Glynne', channelTitle: 'Clean Bandit', categories: ['Music'] },
  { videoId: 'QH2-TGUlwu4', title: 'Nyan Cat [original]', channelTitle: 'Nyan Cat', categories: ['Comedy', 'Entertainment', 'Trending'] },
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

function pickMatchedForCategory(category, count, startOffset = 0) {
  const exact = MATCHED_VIDEOS.filter((v) => v.categories.includes(category))
  const pool = exact.length >= 4 ? exact : MATCHED_VIDEOS
  const out = []
  for (let i = 0; i < count; i += 1) {
    out.push(pool[(startOffset + i) % pool.length])
  }
  return out
}

/** Build videos where every title matches its real YouTube thumbnail */
function buildVideos() {
  const cats = CATEGORY_LIST.filter((c) => c !== 'All')
  const perCat = 10
  const list = []
  let n = 0

  cats.forEach((category) => {
    const picks = pickMatchedForCategory(category, perCat, n)
    const seenIds = new Set()
    for (let j = 0; j < perCat; j += 1) {
      let matched = picks[j]
      // Prefer unique ids inside a category
      if (seenIds.has(matched.videoId)) {
        matched =
          MATCHED_VIDEOS.find((v) => !seenIds.has(v.videoId)) || matched
      }
      seenIds.add(matched.videoId)

      const channelFallback = CHANNELS[n % CHANNELS.length]
      const views = Math.floor(12000 + ((n * 7919) % 9000000))
      const durationSec = 150 + ((n * 137) % 4200)
      const publishedAt = daysAgo(
        category === 'Recently Uploaded' ? n % 14 : (n * 3) % 900
      )
      const thumbMq = `https://i.ytimg.com/vi/${matched.videoId}/mqdefault.jpg`
      const thumbHq = `https://i.ytimg.com/vi/${matched.videoId}/hqdefault.jpg`
      const tags = [
        category.toLowerCase(),
        ...matched.title
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((w) => w.length > 3)
          .slice(0, 6),
      ]
      list.push({
        id: `vid_${category.replace(/\s/g, '_')}_${j}_${matched.videoId}`,
        videoId: matched.videoId,
        title: matched.title,
        description: `${matched.title}\n\nCategory: ${category}\nTags: ${tags.join(', ')}\n\n#${category.replace(/\s/g, '')} #YouTubeClone`,
        channelId: channelFallback.id,
        channelTitle: matched.channelTitle || channelFallback.title,
        channelAvatar: channelFallback.avatar,
        verified: true,
        category,
        tags,
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
          default: { url: thumbMq },
          medium: { url: thumbMq },
          high: { url: thumbHq },
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
      // Exact category only — never mix unrelated chips
      filtered = VIDEOS.filter((v) => v.category.toLowerCase() === key)
    }
  } else {
    // All: interleave categories so feed isn't one category block after another
    const byCat = new Map()
    VIDEOS.forEach((v) => {
      const arr = byCat.get(v.category) || []
      arr.push(v)
      byCat.set(v.category, arr)
    })
    const queues = [...byCat.values()].map((q) => [...q])
    filtered = []
    let remaining = queues.reduce((n, q) => n + q.length, 0)
    while (remaining > 0) {
      for (let i = 0; i < queues.length; i += 1) {
        if (queues[i].length) {
          filtered.push(queues[i].shift())
          remaining -= 1
        }
      }
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
  const tokens = q.split(/\s+/).filter((t) => t.length > 1)
  let list = [...VIDEOS]
  if (category && category !== 'All') {
    list = VIDEOS.filter(
      (v) =>
        v.category.toLowerCase() === category.toLowerCase() ||
        v.title.toLowerCase().includes(category.toLowerCase())
    )
  }
  if (q) {
    list = VIDEOS.filter((v) => {
      const hay = `${v.title} ${v.channelTitle} ${v.category}`.toLowerCase()
      if (hay.includes(q)) return true
      return tokens.length > 0 && tokens.every((t) => hay.includes(t))
    })
  }
  const seen = new Set()
  const unique = []
  for (const v of list) {
    if (seen.has(v.videoId)) continue
    seen.add(v.videoId)
    unique.push(v)
  }
  return { items: unique.map(toSearchItem), total: unique.length }
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
  const title = `${candidate.title} ${candidate.description} ${(candidate.tags || []).join(' ')}`.toLowerCase()
  if (current?.category && candidate.category === current.category) score += 60
  if (current?.channelId && candidate.channelId === current.channelId) score += 20
  keywords.forEach((kw) => {
    if (candidate.title.toLowerCase().includes(kw)) score += 14
    else if ((candidate.tags || []).some((t) => String(t).toLowerCase() === kw)) score += 10
    else if (title.includes(kw)) score += 4
  })
  if (!candidate.isShort && (candidate.durationSec || 0) >= 90) score += 6
  return score
}

/**
 * Related videos: long-form only (no Shorts), ranked by category / channel / keywords.
 * Never pads with unrelated videos — returns fewer items if needed.
 */
export function getRelated(videoId, limit = 20, hint = {}) {
  const current = getCatalogVideo(videoId)
  const titleHint = hint.title || current?.title || ''
  const categoryHint = hint.category || current?.category || ''
  const channelHint = hint.channelId || current?.channelId || ''
  const keywords = extractKeywords(
    `${titleHint} ${categoryHint} ${hint.description || current?.description || ''} ${(current?.tags || []).join(' ')}`
  )

  const currentMeta = current || {
    category: categoryHint,
    channelId: channelHint,
    title: titleHint,
  }

  const pool = VIDEOS.filter(
    (v) => v.videoId !== videoId && !v.isShort && (v.durationSec || 120) >= 60
  )

  const MIN_SCORE = categoryHint ? 40 : 20

  const ranked = pool
    .map((v) => ({ v, score: scoreRelated(v, currentMeta, keywords) }))
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)

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

  // Same-category fill only (still on-topic) — never random dump
  if (picked.length < Math.min(8, limit) && categoryHint) {
    pool
      .filter((v) => v.category === categoryHint)
      .forEach((v) => {
        if (picked.length < limit) push(v)
      })
  }

  return picked.slice(0, limit).map((v) => {
    const item = toSearchItem(v)
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

export function searchCatalogShorts(query = '') {
  const q = String(query || '').trim().toLowerCase()
  const tokens = q.split(/\s+/).filter((t) => t.length > 1)
  let list = [...SHORTS]
  if (q) {
    const scored = SHORTS.map((s) => {
      const hay = `${s.title} ${s.description} ${s.category} ${s.channelTitle}`.toLowerCase()
      let score = 0
      if (hay.includes(q)) score += 40
      tokens.forEach((t) => {
        if (s.title.toLowerCase().includes(t)) score += 12
        else if (hay.includes(t)) score += 4
      })
      return { s, score }
    })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
    list = scored.map(({ s }) => s)
    if (list.length < 6) list = SHORTS.filter((s) => s.isShort)
  }
  const seen = new Set()
  const unique = []
  for (const s of list) {
    if (seen.has(s.videoId)) continue
    seen.add(s.videoId)
    unique.push(s)
  }
  return unique.slice(0, 24).map(toSearchItem)
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

/**
 * Channels this channel follows (for Featured channels shelf).
 * Deterministic subset so each channel page shows its own follow list.
 */
export function getChannelSubscriptions(channelId, limit = 8) {
  const others = CHANNELS.filter((c) => c.id !== channelId)
  if (!others.length) return []
  let hash = 0
  String(channelId || 'ch').split('').forEach((ch) => {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  })
  const start = hash % others.length
  const ordered = [...others.slice(start), ...others.slice(0, start)]
  return ordered.slice(0, Math.min(limit, ordered.length)).map((c) => ({
    id: c.id,
    title: c.title,
    avatar: c.avatar,
    handle: c.handle,
    subscribers: c.subscribers,
  }))
}
