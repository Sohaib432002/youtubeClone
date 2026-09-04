import { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { CallContext } from '../Hooks/CallingCotext'
import { ThemeContext } from '../Hooks/ThemeContext'
import { searchVideos } from '../utils/youtubeApi'
import ResultCard from './Result-component/ResultCard'

const Result = () => {
  const location = useLocation()
  const params = useParams()
  const { setdirectSearch } = useContext(CallContext)
  const [searchVideoList, setsearchVideoList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { setisShowScrollbar } = useContext(ThemeContext)

  useEffect(() => {
    setisShowScrollbar(false)
    setdirectSearch(true)
  }, [setisShowScrollbar, setdirectSearch])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(false)
      try {
        if (location.state?.items) {
          if (!cancelled) setsearchVideoList(location.state)
        } else {
          const data = await searchVideos(params.text || '', 50)
          if (!cancelled) {
            if (data?.items?.length) setsearchVideoList(data)
            else setError(true)
          }
        }
      } catch (_) {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [params.text, location.state])

  return (
    <div className="grid text-[#FFFFFF] grid-cols-1 max-w-[1266px] w-full px-3 sm:px-4 m-auto result pt-[100px] sm:pt-[119px] pb-8">
      {loading ? (
        <p className="text-[#AAAAAA] py-8 text-center">Loading results...</p>
      ) : error || !searchVideoList?.items?.length ? (
        <div className="text-center py-12 text-[#AAAAAA]">
          <p className="text-white text-lg mb-2">No results found</p>
          <p className="text-sm">Try a different search or check your connection.</p>
        </div>
      ) : (
        searchVideoList.items.map((item, index) => (
          <ResultCard
            key={item.id?.videoId || index}
            item={item}
            allitems={searchVideoList.items}
            index={index}
          />
        ))
      )}
    </div>
  )
}

export default Result
