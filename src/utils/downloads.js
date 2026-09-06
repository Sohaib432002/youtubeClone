import { downloadVideoFile } from './format'

export const DOWNLOADS_KEY = 'yt_clone_downloads'

/** CORS-friendly full MP4 files used so Download always saves a complete local video. */
export const DOWNLOAD_SAMPLE_MP4 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const PUBLIC_MP4S = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
]

export function readDownloads() {
  try {
    const list = JSON.parse(localStorage.getItem(DOWNLOADS_KEY) || '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function writeDownloads(list) {
  localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(list.slice(0, 50)))
}

export function saveDownloadEntry(entry) {
  if (!entry?.videoId) return
  const prev = readDownloads()
  const next = [
    {
      videoId: entry.videoId,
      title: entry.title || 'Video',
      thumbnail:
        entry.thumbnail || `https://i.ytimg.com/vi/${entry.videoId}/mqdefault.jpg`,
      channelTitle: entry.channelTitle || '',
      channelId: entry.channelId || '',
      fileUrl: entry.fileUrl || resolveStableMp4(entry.videoId),
      downloadedAt: new Date().toISOString(),
    },
    ...prev.filter((x) => x.videoId !== entry.videoId),
  ]
  writeDownloads(next)
  return next
}

export function clearDownloads() {
  localStorage.removeItem(DOWNLOADS_KEY)
}

function sanitizeFilename(title = 'video') {
  const base = String(title)
    .slice(0, 60)
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return `${base || 'video'}.mp4`
}

function hashId(id = '') {
  let h = 0
  String(id).split('').forEach((c) => {
    h = (h * 31 + c.charCodeAt(0)) >>> 0
  })
  return h
}

/** Stable public MP4 per video id so re-downloads stay consistent. */
export function resolveStableMp4(videoId = '') {
  return PUBLIC_MP4S[hashId(videoId) % PUBLIC_MP4S.length] || DOWNLOAD_SAMPLE_MP4
}

export function resolveDownloadUrl(video = {}) {
  return (
    video.localVideoUrl ||
    video.fileUrl ||
    video.downloadUrl ||
    video.meta?.localVideoUrl ||
    video.meta?.downloadUrl ||
    resolveStableMp4(video.videoId)
  )
}

/**
 * Try third-party download APIs for the real YouTube media file.
 * Falls back to a complete public MP4 so the user always gets a local file.
 */
async function tryRemoteYoutubeFile(videoId) {
  if (!videoId || String(videoId).startsWith('studio_')) return null
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`

  const cobaltHosts = [
    'https://api.cobalt.tools/',
    'https://cobalt-api.kwiatekmiki.com/',
  ]

  for (const host of cobaltHosts) {
    try {
      const ctrl = new AbortController()
      const timer = window.setTimeout(() => ctrl.abort(), 12000)
      const res = await fetch(host, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: watchUrl,
          downloadMode: 'auto',
          videoQuality: '720',
          filenameStyle: 'basic',
        }),
      })
      window.clearTimeout(timer)
      if (!res.ok) continue
      const data = await res.json().catch(() => null)
      const url = data?.url || data?.tunnel || data?.picker?.[0]?.url
      if (url && typeof url === 'string') return url
    } catch (_) {
      /* try next host */
    }
  }
  return null
}

/**
 * Save to the Downloads library and trigger a real complete file download
 * into the user's local Downloads folder.
 */
export async function downloadAndSave(video, onProgress) {
  if (!video?.videoId) throw new Error('Download not available for this video')

  const filename = sanitizeFilename(video.title)
  let fileUrl = resolveDownloadUrl(video)

  // Prefer studio/local blob or catalog file; otherwise try live YouTube media
  const isLocalBlob = String(fileUrl).startsWith('blob:')
  const isDirectHttp =
    String(fileUrl).startsWith('http') || String(fileUrl).startsWith('/')

  if (!isLocalBlob && isDirectHttp && !video.localVideoUrl && !video.downloadUrl) {
    const remote = await tryRemoteYoutubeFile(video.videoId)
    if (remote) fileUrl = remote
  }

  saveDownloadEntry({ ...video, fileUrl })
  await downloadVideoFile(fileUrl, filename, onProgress)
  return { ok: true, filename, fileUrl }
}
