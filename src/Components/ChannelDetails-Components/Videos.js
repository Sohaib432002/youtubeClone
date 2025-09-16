import VideoCard from './subComponents/VideoCard'

const Videos = () => {
  return (
    <>
      <div className="grid vidocardlist grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-5">
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
      </div>
    </>
  )
}

export default Videos
