import { Link } from 'react-router'

const OptionsSelection = () => {
  return (
    <>
      <div className="">
        <div className="text-white top-0 ">
          <ul className="flex  optionsSelection ">
            <li>
              <Link to="./">Home</Link>
            </li>
            <li>
              <Link to="./videolist">Vidoes</Link>
            </li>
            <li>
              <Link to="./Playlist">Playlist</Link>
            </li>
            <li>
              <Link to="./Posts">Posts</Link>
            </li>
          </ul>
          <hr className="w-full " />
        </div>
      </div>
    </>
  )
}

export default OptionsSelection
