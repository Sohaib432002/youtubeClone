import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CallContext } from "../../Hooks/CallingCotext";
const listIcons = ["fa-indent", "fa-arrow-down", "fa-share"];
const listIconsName = ["Add to queue", "Download", "Share"];
let idslist = [];
const ResultCard = ({ item, apikey, allitems, index }) => {
  const [videoOptions, setvideoOptions] = useState(false);
  const [DataStats, setDataStats] = useState([]);
  const [DataChannelIDs, setDataChannelIDs] = useState([]);
  const fetched = useRef(false);
  const ChannelIDsList = allitems.map((item) => item.snippet.channelId);
  const idslist = allitems.map((item) => item.id.videoId);
  function formatNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }
  const { directSearch, setdirectSearch } = useContext(CallContext)
  setdirectSearch(true)
  useEffect(() => {
    if (fetched.current) return;
    console.log('han main to ik hi bar call hta ho');
    fetched.current = true;
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${idslist.join(
        ","
      )}&key=${apikey}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDataStats(data);
      })
      .catch((err) => "error");
    fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${DataChannelIDs.join(
        ","
      )}&key=${apikey}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDataChannelIDs(data);
      })
      .catch((err) => "error");
  }, []);

  function DateConverter(currentDate) {
    const date = new Date(currentDate);
    const now = new Date();

    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  }
  return (
    <>
      {DataStats.length === 0 ? (
        "please Wait"
      ) : (
        <Link
          key={item.id.videoId}
          to={`./Video/${item.id.videoId}`}
            className="flex p-4 hover:cursor-pointer w-[100%]  text-[#F0F0F0] relative  rounded-sm    "
            onClick={()=>window.scrollTo(0, 0)}
        >
          <div className="w-[80%]">
            <img
              src={`${item.snippet.thumbnails.high.url}`}
              className="overflow-hidden rounded-xl"
              alt=""
            />
          </div>

          <div className="flex justify-between w-[100%]  flex-start p-2 ">
            <div>
              <div>
                <p className="text-xl">{item.snippet.title}</p>
                <div className="text-[12px] text-gray-500">
                  {formatNumber(DataStats.items[index].statistics.viewCount)}{" "}
                  views &nbsp; -{DateConverter(item.snippet.publishTime)}
                </div>
                <div className="flex ">
                  <img
                    // src={`${DataChannelIDs.items[index].snippet.thumbnails.high.url}`}
                    className="overflow-hidden mx-2 rounded-full"
                    width={50}
                  />
                  <a href="/" className="flex text-[12px] items-center">
                    {item.snippet.channelTitle}
                    <i className="fa-solid fa-circle-check mx-1 text-gray-600"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative">
              <i
                onClick={() => {
                  setvideoOptions(!videoOptions);
                }}
                className="fa-solid fa-ellipsis-vertical "
              ></i>
              {videoOptions ? (
                <div className="absolute -right-29  rounded bg-[#282828] z-10 text-[14px] text-[#F1F1F1] overflow-hidden w-[250px]">
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
        </Link>
      )}
    </>
  );
};

export default ResultCard;
