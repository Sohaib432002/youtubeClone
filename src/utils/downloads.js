import { downloadVideoFile } from './format'

export const DOWNLOADS_KEY = 'yt_clone_downloads'

/** Short, CORS-friendly demo file used when the source video cannot be fetched. */
export const DOWNLOAD_SAMPLE_MP4 = '/sample.mp4'

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
      fileUrl: entry.fileUrl || DOWNLOAD_SAMPLE_MP4,
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
    .slice(0, 48)
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return `${base || 'video'}.mp4`
}

export function resolveDownloadUrl(video = {}) {
  return (
    video.localVideoUrl ||
    video.fileUrl ||
    video.downloadUrl ||
    video.meta?.localVideoUrl ||
    DOWNLOAD_SAMPLE_MP4
  )
}

/**
 * Save to the Downloads library and trigger a real file download.
 * YouTube source files are blocked by the browser, so those use a demo MP4.
 */
export async function downloadAndSave(video, onProgress) {
  if (!video?.videoId) throw new Error('Download not available for this video')
  const fileUrl = resolveDownloadUrl(video)
  const filename = sanitizeFilename(video.title)
  saveDownloadEntry({ ...video, fileUrl })
  await downloadVideoFile(fileUrl, filename, onProgress)
  return { ok: true, filename }
}
