import React from "react";
import Button from "../Navbar-Components/Button";
import VideoReviewOptions from "./subComponents/VideoReviewOptions";
import VideoDescription from "./subComponents/VideoDescription";
import PlayerSkeleton from "./PlayerSkeleton";
import { useParams } from "react-router";
const Player = ({ fetchData, channelData }) => {
  const params = useParams();
  const { id } = params;
  return (
    <>
      {fetchData.length === 0 ? (
        <PlayerSkeleton />
      ) : (
        <>
          <div className="max-w-[1227px] player   aspect-video  overflow-hidden rounded-[10px] ml-20 ">
            <iframe
              className="w-[100%] h-[100%]"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              allowFullScreen
              allow="accelerometer;
          autoplay; clipboard-write; encrypted-media; gyroscope;
          picture-in-picture"
            ></iframe>
          </div>
          <VideoReviewOptions fetchData={fetchData} channelData={channelData} />
        </>
      )}
    </>
  );
};

export default Player;
