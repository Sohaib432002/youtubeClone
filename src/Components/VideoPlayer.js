import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Hooks/ThemeContext";
import Player from "./PlayerComponent/Player";
import Comments from "./PlayerComponent/Comments";
import RelatedVideos from "./PlayerComponent/RelatedVideosList";
import VideoDescription from "./PlayerComponent/subComponents/VideoDescription";
import { useLocation, useParams } from "react-router-dom";

const VideoPlayer = () => {
  const location = useLocation();
  const params = useParams();
  const { id, text } = params;
  console.log(params);
  const [fetchData, setfetchData] = useState([]);
  const [Notfound, setNotfount] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [randomVideosData, setrandomVideosData] = useState([]);
  // const apikey = "AIzaSyAe2cP53vZdbGJHu8m8Bj-UC3JTk00PMC8";
  const [update, setupdate] = useState(Math.random());
  // const apikey = "AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY";
  const apikey = "AIzaSyD1BpiH_xyLfPrjA_2omJMfME5oRzEQTk8";

  useEffect(() => {
    if (location.state === null) {
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&maxResults=1000&id=${id}&key=${apikey}`
      )
        .then((res) => res.json())
        .then((data) => {
          setfetchData(data);
        })
        .catch((err) => setNotfount(true));
    } else {
      setfetchData(location.state);
    }
    if (location.state === null) {
      fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&maxResults=1000&key=${apikey}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCommentData(data);
        })
        .catch((err) => setNotfount(true));
    } else {
      setfetchData(location.state);
    }
    if (location.state === null) {
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${text}&maxResults=1000&key=${apikey}`
      )
        .then((res) => res.json())
        .then((data) => {
          setrandomVideosData(data);
        })
        .catch((err) => setNotfount(true));
    } else {
      setfetchData(location.state);
    }
  }, [update]);

  const { isShowLeftbar, windowResize, setisShowScrollbar } =
    useContext(ThemeContext);
  setisShowScrollbar(false);
  return (
    <div
      className={` grid text-[#AAAAAA]  max-w-[1666px]  bg-[#0f0f0f]  m-auto  VideoPlayer pt-[119px]   `}
    >
      <div
        className={`flex flex-col ${
          windowResize <= 1170 ? " grid-rows-3" : ""
        } max-w-[1500px] `}
      >
        <Player fetchData={fetchData} />
        <VideoDescription fetchData={fetchData} />
        <div className="comments-section">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>
      <div>
        <RelatedVideos
          setupdate={setupdate}
          randomVideosData={randomVideosData}
        />
        <div className="comments-section-bottom">
          <Comments fetchData={fetchData} commentData={commentData} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
