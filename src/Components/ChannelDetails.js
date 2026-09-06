import { useContext, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'
import { useSubscriptions } from '../Hooks/SubscriptionsContext'
import { useStudio, studioChannelToYt, studioVideoToSearchItem } from '../Hooks/StudioContext'
import {
  getChannelsByIds,
  getChannelVideos,
  getChannelPlaylists,
  getChannelShorts,
  getChannelLiveVideos,
  getChannelSections,
  videoIdOf,
  dedupeByVideoId,
} from '../utils/youtubeApi'
import { CHANNELS, VIDEOS, toSearchItem } from '../data/mockCatalog'
import {
  buildChannelPosts,
  buildMockPlaylists,
  mockChannelShorts,
  mockChannelLive,
} from '../utils/channelContent'
import ChannelBanner from './ChannelDetails-Components/ChannelBanner'
import ChannelIntro from './ChannelDetails-Components/ChannelIntro'
import OptionsSelection from './ChannelDetails-Components/OptionsSelection'

const ChannelDetails = () => {
  const { channelId } = useParams()
  const { setisShowScrollbar } = useContext(ThemeContext)
  const { ensureChannelCount } = useSubscriptions()
  const { getChannel, getVideosByChannel } = useStudio()
  const [channelData, setChannelData] = useState(null)
  const [channelVideos, setChannelVideos] = useState([])
  const [channelPlaylists, setChannelPlaylists] = useState([])
  const [channelShorts, setChannelShorts] = useState([])
  const [channelLive, setChannelLive] = useState([])
  const [channelPosts, setChannelPosts] = useState([])
  const [channelSections, setChannelSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [extrasReady, setExtrasReady] = useState(false)
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
      setExtrasReady(false)
      setError('')
      setChannelData(null)
      setChannelVideos([])
      setChannelPlaylists([])
      setChannelShorts([])
      setChannelLive([])
      setChannelPosts([])
      setChannelSections([])

      const studioCh = getChannel(id)
      if (studioCh) {
        const vids = getVideosByChannel(studioCh.id)
          .map(studioVideoToSearchItem)
          .filter(Boolean)
        const fake = studioChannelToYt(studioCh, getVideosByChannel(studioCh.id))
        ensureChannelCount(studioCh.id, studioCh.subscribers || 0)
        const playlists = buildMockPlaylists(studioCh.id, vids, studioCh.title)
        const posts = buildChannelPosts(fake, vids)
        if (!cancelled) {
          setChannelData(fake)
          setChannelVideos(vids)
          setChannelPlaylists(playlists)
          setChannelShorts([])
          setChannelLive([])
          setChannelPosts(posts)
          setChannelSections([])
          setExtrasReady(true)
          setLoading(false)
        }
        return
      }

      const local = CHANNELS.find((c) => c.id === id)
      if (local) {
        const vids = dedupeByVideoId(
          VIDEOS.filter((v) => v.channelId === local.id).map(toSearchItem)
        )
        const baseSubs = local.subscribers
        ensureChannelCount(local.id, baseSubs)
        const viewCount = vids.reduce(
          (sum, v) => sum + Number(v.statistics?.viewCount || v.meta?.views || 0),
          0
        )
        const fake = {
          id: local.id,
          snippet: {
            title: local.title,
            customUrl: local.handle,
            description:
              local.description ||
              `Welcome to ${local.title}. Independent channel with its own videos and subscribers.`,
            publishedAt: '2018-04-28T14:50:54Z',
            country: 'US',
            thumbnails: {
              high: { url: local.avatar },
              medium: { url: local.avatar },
              default: { url: local.avatar },
            },
          },
          statistics: {
            subscriberCount: String(baseSubs),
            videoCount: String(vids.length),
            viewCount: String(viewCount),
          },
          brandingSettings: {
            channel: { title: local.title, country: 'US' },
            image: {
              bannerExternalUrl:
                local.banner ||
                `https://picsum.photos/seed/${encodeURIComponent(local.id)}/1280/220`,
            },
          },
        }
        const playlists = buildMockPlaylists(local.id, vids, local.title)
        const shorts = mockChannelShorts(local.id)
        const live = mockChannelLive(vids, local.id)
        const posts = buildChannelPosts(fake, vids)
        if (!cancelled) {
          setChannelData(fake)
          setChannelVideos(vids)
          setChannelPlaylists(playlists)
          setChannelShorts(shorts)
          setChannelLive(live)
          setChannelPosts(posts)
          setChannelSections([])
          setExtrasReady(true)
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
          setChannelData(ch)
          const videos = await getChannelVideos(id, 32)
          const filtered = dedupeByVideoId(
            (videos?.items || []).filter((v) => {
              const belongs = !v.snippet?.channelId || v.snippet.channelId === id
              return belongs && videoIdOf(v)
            })
          )
          if (!cancelled) {
            setChannelVideos(filtered)
            setLoading(false)
          }

          try {
            const [playlists, shorts, live, sections] = await Promise.all([
              getChannelPlaylists(id, 24),
              getChannelShorts(id, 20),
              getChannelLiveVideos(id, 16),
              getChannelSections(id),
            ])
            if (cancelled) return
            setChannelPlaylists(playlists?.items || [])
            setChannelShorts(dedupeByVideoId(shorts?.items || []))
            setChannelLive(dedupeByVideoId(live?.items || []))
            setChannelSections(sections?.items || [])
            setChannelPosts(buildChannelPosts(ch, filtered))
          } catch (extraErr) {
            console.error(extraErr)
            if (!cancelled) {
              setChannelPosts(buildChannelPosts(ch, filtered))
            }
          } finally {
            if (!cancelled) setExtrasReady(true)
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
    // ChannelIntro derives the live display count (actual + local ±1).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, setisShowScrollbar, ensureChannelCount])

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
      <Outlet
        context={{
          channelData,
          channelVideos,
          channelVideosReady: !loading,
          channelPlaylists,
          channelShorts,
          channelLive,
          channelPosts,
          channelSections,
          extrasReady,
        }}
      />
    </div>
  )
}

export default ChannelDetails
