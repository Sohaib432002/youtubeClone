/** Skeleton placeholders for related videos — column layout on all sizes */
const RelatedVideosShel = () => {
  return (
    <div className="w-full px-3 sm:px-4 animate-pulse">
      <div className="h-4 w-32 bg-[#272727] rounded mb-3" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex w-full gap-3">
            <div className="w-[42%] max-w-[200px] aspect-video rounded-lg bg-[#272727] flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3.5 bg-[#272727] rounded w-11/12" />
              <div className="h-3 bg-[#272727] rounded w-1/2" />
              <div className="h-3 bg-[#272727] rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedVideosShel
