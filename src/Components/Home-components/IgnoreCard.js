import React, { useRef, useState } from "react";

const listIcons = ["fa-indent", "fa-arrow-down", "fa-share"];
const listIconsName = ["Add to queue", "Download", "Share"];

const Card = ({ item }) => {
  console.log(item);
  const [showVidoOptions, setshowVidoOptions] = useState(false);
  const [Mute, setMute] = useState(true);
  const videoRef = useRef(0);
  const [PlaybackTime, setPlaybackTime] = useState();
  const [videoOptions, setvideoOptions] = useState(false);
  // const [overFlow, setoverFlow] = useState(false);

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay = m > 0 ? m + ":" : "";
    var sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "";
    return hDisplay + mDisplay + sDisplay;
  }
  function DateConverter(currentDate) {
    const date = new Date(currentDate);
    let Month;
    switch (date.getMonth()) {
      case 0:
        Month = "Jan";
        break;
      case 1:
        Month = "Feb";
        break;
      case 2:
        Month = "Mar";
        break;
      case 3:
        Month = "April";
        break;
      case 4:
        Month = "May";
        break;
      case 5:
        Month = "June";
        break;
      case 6:
        Month = "July";
        break;
      case 7:
        Month = "Aug";
        break;
      case 8:
        Month = "Sep";
        break;
      case 9:
        Month = "Oct";
        break;
      case 10:
        Month = "Nov";
        break;
      case 11:
        Month = "Dec";
        break;

      default:
        Month = "";
        break;
    }
    return `${Month},${date.getFullYear()}`;
  }
  return (
    <div
      onMouseEnter={() => {
        setshowVidoOptions(true);
        // videoRef.current.play();
      }}
      onTimeUpdate={() => {
        setPlaybackTime();
        // secondsToHms(videoRef.current.duration - videoRef.current.currentTime)
      }}
      onMouseLeave={() => {
        setshowVidoOptions(false);
        // videoRef.current.pause();
      }}
      className="flex hover:cursor-pointer text-[#F0F0F0] relative flex-col rounded-sm   w-[400px] "
    >
      {/* <video
        ref={videoRef}
        muted={Mute}
        typeof="mp4"
        src="./video.mp4"
        className="w-[100%] relative rounded-[20px] "
      ></video> */}
      <img src={item.snippet.thumbnails.url} alt="" />
      <span
        className={`absolute z-32
            opacity-70
           bg-black p-1 ${
             showVidoOptions ? "hidden" : ""
           } rounded text-[14px] text-white  right-[29px] top-[160px]`}
      >
        {}
        {/* {Math.floor(videoRef.current.duration)} */}
      </span>
      {showVidoOptions ? (
        <>
          <span
            onClick={() => setMute(!Mute)}
            className={`absolute z-3 
            opacity-70
           bg-black p-3 rounded-[100px]  right-[29px] top-[20px]`}
          >
            <i
              className={`fa-solid ${
                Mute ? "fa-volume-xmark" : "fa-volume-high"
              }  text-white`}
            ></i>
          </span>
          <span
            className={`absolute z-3 
            
           bg-black p-1 rounded text-white text-[14px]  right-[10px] top-[190px]`}
          >
            {PlaybackTime}
          </span>
          {/* <div className={`w-[${Time}px]  h-1 bg-red-600 text-[20px]`}></div> */}
        </>
      ) : (
        ""
      )}

      <div className="flex justify-start flex-start p-2 ">
        <div className="flex rounded-[100px] my-2 items-baseline mx-3">
          <img
            src="./favicon.ico"
            className="w-[100%] rounded-[100px]"
            alt=""
          />
        </div>
        <div>
          <p>{item.snippet.title}</p>
          <a href="/" className="flex items-center">
            {item.snippet.channelTitle}
            <i className="fa-solid fa-circle-check mx-1 text-gray-600"></i>
          </a>
          <div>9.3M Views {DateConverter(item.snippet.publishTime)}</div>
        </div>
        <div className="relative">
          <i
            onClick={() => {
              setvideoOptions(!videoOptions);
            }}
            className="fa-solid fa-ellipsis-vertical "
          ></i>
          {videoOptions ? (
            <div
              onMouseEnter={() => videoRef.current.pause()}
              onMouseLeave={() => videoRef.current.play()}
              className="absolute -right-29  rounded bg-[#282828] z-10 text-[14px] text-[#F1F1F1] overflow-hidden w-[250px]"
            >
              {listIconsName.map((item, i) => {
                return (
                  <div key={i} className="hover:bg-[#3E3E3E]   p-2">
                    <i
                      class={`fa-solid hover:bg-[#3E3E3E] text-[18px] m-2 ${listIcons[i]}`}
                    ></i>
                    {item}
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
