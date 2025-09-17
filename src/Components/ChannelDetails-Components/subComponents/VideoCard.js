import React, { useState } from 'react'
import { Link } from 'react-router'

const VideoCard = ({ item }) => {
  const [options, setOptions] = useState(false)
  const listbtnIcons = ['outdent', 'clock', 'list', 'arrow-down', 'share', 'flag']
  const listbtnNames = [
    'Add to Queue',
    'Save to Watch Later',
    'Save to playlist',
    'Download',
    'Share',
    'Report',
  ]
  console.log('ha', item)
  return (
    <>
      <Link to={`./${item.id}`}>
        <div className="px-1">
          <div className="w-[260px]  flex  flex-col">
            <div className="rounded-lg overflow-hidden">
              <img src={item.snippet.thumbnails.high.url} alt="" />
            </div>

            <div className="cardText flex text-[white] text justify-between p-2">
              <div>
                <p className="text-[16px]">{item.snippet.localized.title}</p>
                <span className="text-[14px] text-[#969696]">156K views • 2 days ago</span>
              </div>
              <div className="relative">
                <i
                  onClick={() => setOptions(!options)}
                  className="fa-solid my-3 fa-ellipsis-vertical"
                ></i>
                {options && (
                  <div className=" z-30 right-[20px] top-[20px] text-[16px] overflow-hidden w-[210px] bg-[#272727]  rounded-lg absolute">
                    {listbtnNames.map((item, i) => {
                      return (
                        <div className="flex  flex-col   ">
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              alert(`${item}, we are working on it`)
                            }}
                            className="px-4  hover:bg-[#414140] flex items-center py-2"
                          >
                            {' '}
                            <i className={`fa-solid mx-2  fa-${listbtnIcons[i]}`}></i>
                            <p>{item}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default VideoCard
