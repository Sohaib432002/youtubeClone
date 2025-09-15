import React, { useState } from "react";
import { Link } from "react-router";

const VideoDescription = ({ fetchData }) => {
  console.log("VideoDesc:", fetchData);
  const [showMore, setshowMore] = useState(false);
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
      {fetchData.length === 0 ? (
        <div className="title text-[#DDDDDD] max-w-[1227px] h-[20vh] my-3 bg-[#272727] overflow-hidden p-2 rounded-xl ml-20"></div>
      ) : (
        <>
          <div className="title text-[#DDDDDD] max-w-[1227px] my-3 bg-[#272727] overflow-hidden p-2 rounded-xl ml-20">
            <div className="flex ">
              <b>
                {formatNumber(fetchData.items[0].statistics.viewCount)} &nbsp;
                Views &nbsp;
                {DateConverter(fetchData.items[0].snippet.publishedAt)}
              </b>{" "}
              <span>
                {" "}
                <Link>&nbsp; {fetchData.items[0].snippet.title} </Link>
              </span>{" "}
            </div>
            {showMore
              ? ""
              : fetchData.items[0].snippet.description.length >= 200
              ? fetchData.items[0].snippet.description.slice(0, 400) + "...."
              : fetchData.items[0].snippet.description}
            <br />
            <br />
            {showMore ? (
              ""
            ) : (
              <p onClick={() => setshowMore(true)} className="cursor-pointer">
                ...more
              </p>
            )}

            {showMore && (
              <div>
                {fetchData.items[0].snippet.description}
                <p
                  onClick={() => setshowMore(false)}
                  className="cursor-pointer"
                >
                  <b>Show Less </b>
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default VideoDescription;
