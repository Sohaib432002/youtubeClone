import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CallContext } from "../../Hooks/CallingCotext";
const listIcons = ["fa-indent", "fa-arrow-down", "fa-share"];
const listIconsName = ["Add to queue", "Download", "Share"];

const Card = ({ item }) => {
  const [videoOptions, setvideoOptions] = useState(false);
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
  console.log(CallContext);
  const {setdirectSearch } = useContext(CallContext)
  setdirectSearch(false)
  return (
    <Link
      key={item.id.videoId}
      to={`./Video/${item.id.videoId}`}
      className="flex hover:cursor-pointer  text-[#F0F0F0] relative flex-col rounded-sm   w-[400px] "
    >
      <img
        src={item.snippet.thumbnails.high.url}
        className="overflow-hidden rounded-xl"
        alt=""
      />

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
              console.log("han");
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

export default Card;
