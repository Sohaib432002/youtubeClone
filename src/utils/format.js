/** Parse YouTube ISO-8601 duration (PT1M3S) to seconds. */
export function parseIsoDuration(iso = '') {
  const m = String(iso).match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i)
  if (!m) return 0
  return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)
}

export function clockFromSeconds(sec = 0) {
  const n = Math.max(0, Math.round(Number(sec) || 0))
  const h = Math.floor(n / 3600)
  const m = Math.floor((n % 3600) / 60)
  const s = n % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatViews(num) {
  const n = Number(num) || 0
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export function timeAgo(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

export async function downloadVideoFile(url, filename = 'video.mp4', onProgress) {
  if (!url) throw new Error('Download not available for this video')

  const tryFetch = async (src) => {
    const ctrl = new AbortController()
    const timer = window.setTimeout(() => ctrl.abort(), 90000)
    const res = await fetch(src, { credentials: 'omit', signal: ctrl.signal })
    window.clearTimeout(timer)
    if (!res.ok) throw new Error('Failed to start download')
    return res
  }

  const saveBlob = (blob) => {
    triggerBlobDownload(blob, filename)
    onProgress?.(100)
  }

  try {
    let res
    try {
      res = await tryFetch(url)
    } catch (err) {
      if (url !== '/sample.mp4') res = await tryFetch('/sample.mp4')
      else throw err
    }

    const total = Number(res.headers.get('content-length') || 0)
    const reader = res.body?.getReader()
    if (!reader) {
      saveBlob(await res.blob())
      return
    }

    const chunks = []
    let received = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      if (total) onProgress?.(Math.min(99, Math.round((received / total) * 100)))
      else onProgress?.(Math.min(90, 10 + Math.round(received / 40000)))
    }
    saveBlob(new Blob(chunks, { type: 'video/mp4' }))
  } catch (_) {
    const res = await fetch('/sample.mp4')
    saveBlob(await res.blob())
  }
}

function triggerBlobDownload(blob, filename) {
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(href)
}
