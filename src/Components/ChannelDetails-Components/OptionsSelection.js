import { Link } from "react-router"

const OptionsSelection = () => {
  return (
    <>
      <div>
      <div className="text-white">
        <ul className="flex  optionsSelection ">
          <li ><Link to="./">Home</Link></li>
          <li><Link to="./videolist">Vidoes</Link></li>
          <li><Link to="./Playlist">Playlist</Link></li>
          <li><Link to="./Posts">Posts</Link></li>
        </ul >
    </div>
        <hr className="w-full overflow-visible " />
        </div>

    </>
  )
}

export default OptionsSelection
