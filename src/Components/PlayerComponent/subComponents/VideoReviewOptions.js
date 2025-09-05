import React, { useState } from "react";

const VideoReviewOptions = ({ fetchData }) => {
  const [Like, setLike] = useState(false);
  const [disLike, setdisLike] = useState(false);
  const [revOptions, setrevOptions] = useState(false);
  const [Saved, setSaved] = useState(false);
  const [Report, setReport] = useState(false);
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
  return (
    <>
      <div className="title  ml-20">
        <p className="text-[20px] font-bold pr-10  text-[#F1F1F1]">
          {fetchData.items[0].snippet.title}
        </p>
      </div>
      <div className="flex items-center max-w-[1227px] ml-20 VideoCreatorDetails  justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <img
              src={`${fetchData.items[0].brandingSettings?.image?.bannerExternalUrl}`}
              alt="pics"
              width={50}
            />
          </div>
          <div className="channel-intro flex flex-col items-start">
            {" "}
            <span className="semi-bold text-[16px] text-[#F1F1F1]">
              {fetchData.items[0].snippet.channelTitle}
            </span>
            <span className="text-[12px] text-[#AAAAAA]">
              {fetchData.items[0].statistics?.subscriberCount} &nbsp;
            </span>
          </div>
          <div className="mx-3 ">
            <button
              className={`font-bold bg-white text-[#0F0F0F] hover:bg-[#414140] text-[16px]    flex items-center rounded-[30px] py-2 px-3  `}
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="flex py-3">
          <div
            onClick={() => {
              setLike(!Like);
              if (Like) {
                setdisLike(false);
              }
            }}
            title="I like this video"
            className="like flex border-r-[1px] hover:bg-[#414140] bg-[#272727] text-[#eeeeee] cursor-pointer p-2 items-center justify-center rounded-l-full  text-[16px]"
          >
            <i
              className={`${
                Like ? "fa-regular" : "fa-solid"
              } fa-regular fa-thumbs-up mx-1`}
            ></i>
            {formatNumber(fetchData.items[0].statistics.likeCount)}
          </div>
          <div
            onClick={() => {
              setdisLike(!disLike);
              if (disLike) {
                setLike(false);
              }
            }}
            title="I don't Like it"
            className="disLike px-4 px-2 hover:bg-[#414140] flex items-center justify-center text-[#eeeeee] cursor-pointer rounded-r-full bg-[#272727] text-[16px]"
          >
            <i
              className={`${
                disLike ? "fa-regular" : "fa-solid"
              } fa-regular fa-thumbs-down `}
            ></i>
          </div>
          <div
            title="Share"
            className="share px-4 px-2 mx-2 flex hover:bg-[#414140] items-center justify-center text-[#eeeeee] cursor-pointer rounded-full bg-[#272727] text-[16px]"
          >
            <i className="fa-solid fa-share mx-1"></i>Share
          </div>
          <div
            title="Download this video"
            className="Download px-4 px-2 hover:bg-[#414140] flex items-center justify-center text-[#eeeeee] cursor-pointer rounded-full bg-[#272727] text-[16px]"
          >
            <i className="fa-solid fa-arrow-down mx-1"></i>Download
          </div>
          <div
            onClick={() => setrevOptions(!revOptions)}
            className={`share px-2  ${
              revOptions ? "" : "hover:bg-[#414140]"
            } mx-2  relative flex items-center justify-center text-[#eeeeee] cursor-pointer rounded-full bg-[#272727] text-[16px]`}
          >
            <i className="fa-solid fa-ellipsis-vertical "></i>
            {revOptions && (
              <div className=" z-30 right-[20px] top-[50px] bg-[#272727] rounded-lg absolute">
                <div className="flex flex-col  my-2 ">
                  <div
                    onClick={(e) => {
                      setSaved(!Saved);
                      e.stopPropagation();
                    }}
                    className="px-4 flex items-center hover:bg-[#414140] py-1"
                  >
                    {" "}
                    <i
                      className={` ${
                        Saved ? "fa-solid" : "fa-regular"
                      }   mx-2  fa-bookmark`}
                    ></i>
                    <p>save</p>
                  </div>
                  <div
                    onClick={(e) => {
                      setReport(true);
                      e.stopPropagation();
                    }}
                    className="px-4 flex items-center  hover:bg-[#414140] py-1"
                  >
                    {" "}
                    <i className="fa-regular mx-2 fa-flag"></i>
                    <p>Report</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoReviewOptions;
