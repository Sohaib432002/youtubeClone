import { Link } from 'react-router'

const OptionsSelection = () => {
  return (
    <>
      <div className="">
        <div className="text-white top-0 z-50 sticky">
          <ul className="flex sticky optionsSelection ">
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
          <hr className="w-full overflow-visible " />
        </div>
      </div>
    </>
  )
}

export default OptionsSelection
