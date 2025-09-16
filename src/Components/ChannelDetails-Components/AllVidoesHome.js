import ChannelCrousel from './ChannelCrousel'
import Crousel from './Crousel'
import PostCrousel from './PostCrousel'

const AllVideosHome = () => {
  return (
    <div className="text-white">
      <h1 className="font-extrabold flex  text-[20px] my-4 font-sans">
        For you
      </h1>
      <Crousel />
      <hr />
      <h1 className="font-extrabold text-[20px] my-4 font-sans">Videos</h1>
      <Crousel />
      <hr />
      <div className="flex justify-between items-center my-3 mx-2">
        <h1 className="font-extrabold justify-between text-[20px] my-4 font-sans">
          Other Channels
        </h1>
        <div className="btn-channel px-3 py-3  hover:bg-blue-300 text-blue-600 font-sans font-bold rounded-full cursor-pointer text-[14px]  flex justify-center items-center">
          <span>View All</span>
        </div>
      </div>
      <div>
        <ChannelCrousel />
      </div>
      <hr />
      <h1 className="font-extrabold text-[20px] my-4 font-sans">Posts</h1>

      <PostCrousel />
    </div>
  )
}

export default AllVideosHome
