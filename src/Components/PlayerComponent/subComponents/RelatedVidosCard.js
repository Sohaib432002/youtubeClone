import React, { useState } from "react";
import { Link } from "react-router";

const listbtnIcons = [
  "outdent",
  "clock",
  "list",
  "arrow-down",
  "share",
  "flag",
];
const listbtnNames = [
  "Add to Queue",
  "Save to Watch Later",
  "Save to playlist",
  "Download",
  "Share",
  "Report",
];
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
const RelatedVidosCard = ({ setupdate, windowResize, item }) => {
  const [options, setOptions] = useState(false);
  const [hoverVideo, sethoverVideo] = useState(false);

  return (
    <>
      <Link
        onClick={() => setupdate(Math.random())}
        to={`/home/Video/${item.id.videoId}`}
      >
        <div
          key={`${item.id.videoId}`}
          id={`${item.id.videoId}`}
          onMouseEnter={() => {
            sethoverVideo(true);
          }}
          onMouseLeave={() => {
            sethoverVideo(false);
          }}
          className={`${windowResize >= 1170 ? "flex" : ""} my-1`}
        >
          <div
            className={`object-contain ${
              windowResize >= 1170 ? "" : "my-3"
            }  rounded-lg overflow-hidden`}
          >
            <img
              width={`${windowResize >= 1170 ? 150 : "100%"}`}
              src={item.snippet.thumbnails.high.url}
              className={`${windowResize >= 1170 ? "" : ""}`}
              alt="thumbail"
            />
          </div>
          <div className="flex flex-grow justify-between ">
            <div
              className={`${
                windowResize >= 1170 ? "flex-grow" : "flex-grow"
              }flex flex-col mx-2`}
            >
              {windowResize >= 1170 ? (
                <p>
                  {item.snippet.title.length > 20
                    ? item.snippet.title.slice(0, 20) + "...."
                    : item.snippet.title}
                </p>
              ) : (
                <p className="my-3">
                  {item.snippet.title.length > 50
                    ? item.snippet.title.slice(0, 50) + "...."
                    : item.snippet.title}
                </p>
              )}
              <Link to={`/${item.snippet.channelId}`}>
                <p>{item.snippet.channelTitle}</p>
              </Link>
              <p>
                {/* <span>1.5M views </span> */}
                <span>{DateConverter(item.snippet.publishedAt)}</span>
              </p>
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
                            e.stopPropagation();
                            alert(`${item}, we are working on it`);
                          }}
                          className="px-4  hover:bg-[#414140] flex items-center py-2"
                        >
                          {" "}
                          <i
                            className={`fa-solid mx-2  fa-${listbtnIcons[i]}`}
                          ></i>
                          <p>{item}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default RelatedVidosCard;
