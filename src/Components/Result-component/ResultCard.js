import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const listIcons = ["fa-indent", "fa-arrow-down", "fa-share"];
const listIconsName = ["Add to queue", "Download", "Share"];

const ResultCard = ({ item, apikey }) => {
  const [videoOptions, setvideoOptions] = useState(false);
  const [DataStats, setDataStats] = useState([]);
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
  fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${item.id.videoId}&key=${apikey}`
  )
    .then((res) => res.json())
    .then((data) => {
      setDataStats(data);
    })
    .catch((err) => "error");

  function DateConverter(currentDate) {
    const date = new Date(currentDate);
    const now = new Date();

    // Difference in milliseconds
    const diff = now - date;

    // Convert to seconds, minutes, hours, days, months, years
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // approx
    const years = Math.floor(days / 365); // approx

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  }
  console.log(DataStats);
  return (
    <Link
      key={item.id.videoId}
      to={`./Video/${item.id.videoId}`}
      className="flex p-4 hover:cursor-pointer w-[100%]  text-[#F0F0F0] relative  rounded-sm    "
    >
      <div className="w-[40%]">
        <img
          src={`${item.snippet.thumbnails.high.url}`}
          className="overflow-hidden rounded-xl"
          alt=""
        />
      </div>

      <div className="flex justify-between w-[100%]  flex-start p-2 ">
        <div>
          <div>
            <p>{item.snippet.title}</p>
            <div className="text-[12px] text-gray-500">
              {formatNumber(DataStats.items[0].statistics.viewCount)} &nbsp; .
              {DateConverter(item.snippet.publishTime)}
            </div>
            <a href="/" className="flex items-center">
              {item.snippet.channelTitle}
              <i className="fa-solid fa-circle-check mx-1 text-gray-600"></i>
            </a>
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
  );
};

export default ResultCard;
