import { useContext, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'
import { useSubscriptions } from '../Hooks/SubscriptionsContext'
import { getChannelsByIds, getChannelVideos, videoIdOf, dedupeByVideoId } from '../utils/youtubeApi'
import { CHANNELS, VIDEOS, toSearchItem } from '../data/mockCatalog'
import ChannelBanner from './ChannelDetails-Components/ChannelBanner'
import ChannelIntro from './ChannelDetails-Components/ChannelIntro'
import OptionsSelection from './ChannelDetails-Components/OptionsSelection'

const ChannelDetails = () => {
  const { channelId } = useParams()
  const { setisShowScrollbar } = useContext(ThemeContext)
  const { getSubscriberCount, ensureChannelCount } = useSubscriptions()
  const [channelData, setChannelData] = useState(null)
  const [channelVideos, setChannelVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setisShowScrollbar(false)
  }, [setisShowScrollbar])

  useEffect(() => {
    let cancelled = false
    const id = channelId

    const load = async () => {
      if (!id) {
        setError('Missing channel id')
        setLoading(false)
        return
      }
      setLoading(true)
      setError('')
      setChannelData(null)
      setChannelVideos([])

      const local = CHANNELS.find((c) => c.id === id)
      if (local) {
        const vids = dedupeByVideoId(
          VIDEOS.filter((v) => v.channelId === local.id).map(toSearchItem)
        )
        const baseSubs = local.subscribers
        ensureChannelCount(local.id, baseSubs)
        const fake = {
          id: local.id,
          snippet: {
            title: local.title,
            customUrl: local.handle,
            description:
              local.description ||
              `Welcome to ${local.title}. Independent channel with its own videos and subscribers.`,
            thumbnails: {
              high: { url: local.avatar },
              medium: { url: local.avatar },
              default: { url: local.avatar },
            },
          },
          statistics: {
            subscriberCount: String(getSubscriberCount(local.id, baseSubs)),
            videoCount: String(vids.length),
          },
          brandingSettings: {
            channel: { title: local.title },
            image: {
              bannerExternalUrl:
                local.banner ||
                `https://picsum.photos/seed/${encodeURIComponent(local.id)}/1280/220`,
            },
          },
        }
        if (!cancelled) {
          setChannelData(fake)
          setChannelVideos(vids)
          setLoading(false)
        }
        return
      }

      try {
        const data = await getChannelsByIds([id])
        if (cancelled) return
        if (data?.items?.length) {
          const ch = data.items[0]
          ensureChannelCount(ch.id, ch.statistics?.subscriberCount)
          setChannelData({
            ...ch,
            statistics: {
              ...ch.statistics,
              subscriberCount: String(
                getSubscriberCount(ch.id, ch.statistics?.subscriberCount)
              ),
            },
          })
          const videos = await getChannelVideos(id, 32)
          const filtered = dedupeByVideoId(
            (videos?.items || []).filter((v) => {
              const belongs = !v.snippet?.channelId || v.snippet.channelId === id
              return belongs && videoIdOf(v)
            })
          )
          if (!cancelled) {
            setChannelVideos(filtered)
          }
        } else {
          setChannelData(null)
          setError('No channel data found')
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Failed to load channel')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // getSubscriberCount changes with counts — re-run when channelId changes only;
    // live count is refreshed below via derived display in ChannelIntro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, setisShowScrollbar, ensureChannelCount])

  // Keep displayed subscriberCount in sync with subscription toggles
  useEffect(() => {
    if (!channelData?.id) return
    setChannelData((prev) => {
      if (!prev) return prev
      const nextCount = getSubscriberCount(prev.id, prev.statistics?.subscriberCount)
      if (String(prev.statistics?.subscriberCount) === String(nextCount)) return prev
      return {
        ...prev,
        statistics: {
          ...prev.statistics,
          subscriberCount: String(nextCount),
        },
      }
    })
  }, [channelData?.id, getSubscriberCount])

  if (loading) {
    return (
      <div className="pt-24 px-4 max-w-[1300px] m-auto animate-pulse">
        <div className="h-28 sm:h-40 rounded-xl bg-[#272727] mb-6" />
        <div className="flex gap-4">
          <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-[#272727]" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-8 w-48 bg-[#272727] rounded" />
            <div className="h-4 w-72 bg-[#272727] rounded" />
            <div className="h-4 w-96 max-w-full bg-[#272727] rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!channelData) {
    return (
      <div className="text-white p-5 pt-24 text-center">
        <p className="text-lg mb-2">{error || 'No Channel Data Found'}</p>
        <p className="text-sm text-[#aaa]">Try another channel from Home or Search.</p>
      </div>
    )
  }

  const bannerExternalUrl = channelData?.brandingSettings?.image?.bannerExternalUrl
  const ChannelPic =
    channelData?.snippet?.thumbnails?.high?.url ||
    channelData?.snippet?.thumbnails?.medium?.url ||
    channelData?.snippet?.thumbnails?.default?.url

  return (
    <div className="pt-20 md:pl-20 px-3 sm:px-4 channelDetail max-w-[1300px] m-auto w-full overflow-x-hidden pb-20">
      {bannerExternalUrl ? <ChannelBanner bannerExternalUrl={bannerExternalUrl} /> : null}
      <ChannelIntro ChannelPic={ChannelPic} channelData={channelData} />
      <OptionsSelection channelId={channelId} />
      <Outlet context={{ channelData, channelVideos, channelVideosReady: !loading }} />
    </div>
  )
}

export default ChannelDetails
