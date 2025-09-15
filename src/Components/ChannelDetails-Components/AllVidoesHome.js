import Crousel from "./Crousel"

const AllVideosHome = () => {
  return (
    <div className="text-white">
      <h1 className="font-extrabold text-[20px] my-4 font-sans">For you</h1>
      <Crousel />
      <hr />
      <h1 className="font-extrabold text-[20px] my-4 font-sans">Videos</h1>
      <Crousel />
      <hr />
      <h1 className="font-extrabold text-[20px] my-4 font-sans">Videos</h1>
      <Crousel />
      <hr />
    </div>
  )
}

export default AllVideosHome
