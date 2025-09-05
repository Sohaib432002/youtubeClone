import React, { useState } from "react";
import { Link } from "react-router";

const Commenter = ({
  commentContent,
  setwriteComment,
  setComment,
  writeComment,
  commentData,
}) => {
  const [Reply, setReply] = useState(false);
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
    <>
      {commentData.items.map((item) => {
        return (
          <Link
            to={`/${item.snippet.topLevelComment.snippet.authorChannelUrl}`}
            id={`${item.snippet.topLevelComment.snippet.authorChannelId.value}`}
          >
            <div
              key={`${item.snippet.topLevelComment.snippet.authorChannelUrl}`}
              className="flex my-3 text-[15px] flex-1"
            >
              <div className="flex items-start">
                <img
                  alt="pic"
                  width={50}
                  className="rounded-full"
                  src={`${item.snippet.topLevelComment.snippet.authorProfileImageUrl}`}
                />
              </div>
              <div className="flex grow flex-col">
                <div className="flex items-center">
                  <b className="mx-3">
                    {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  </b>{" "}
                  <span>
                    {DateConverter(
                      item.snippet.topLevelComment.snippet.publishedAt
                    )}
                  </span>
                </div>
                <div className="commentContent">
                  <p className="ml-[10px]">
                    {item.snippet.topLevelComment.snippet.textDisplay}
                  </p>
                </div>
                <div className="flex flex-col mx-3 my-1">
                  <div className="flex items-center">
                    <div title="like" className="flex items-center mx-2">
                      <i className="fa-regular mx-1 cursor-pointer hover:bg-[#414140] fa-thumbs-up"></i>
                      <span className="text-gray-700">
                        {item.snippet.topLevelComment.snippet.likeCount}
                      </span>
                    </div>
                    <div title="dislike" className="flex items-center mx-2">
                      <i className="fa-regular  cursor-pointer hover:bg-[#414140] fa-thumbs-down"></i>
                    </div>
                    <div>
                      <button
                        onClick={() => setReply(!Reply)}
                        className="px-3 rounded-full hover:bg-[#414140] py-1"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  <div>
                    {Reply && (
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <div className=" my-3 flex items-center ">
                            <img
                              alt="pic"
                              src="../../favicon.ico"
                              width={30}
                              className="rounded-full"
                            />
                          </div>
                          <input
                            type="text"
                            onChange={(e) => setwriteComment(e.target.value)}
                            className="w-[100%] px-3 py-1 bg-[transparent] outline-none border-b"
                          />
                        </div>
                        <div>
                          <div className="flex justify-end my-2">
                            <button
                              onClick={() => {
                                setwriteComment("");
                                setComment(false);
                                setReply(false);
                              }}
                              className="px-4 py-2 mx-1 rounded-full bold bg-[#272727]  hover:bg-[#414140]  "
                            >
                              Cancel
                            </button>
                            <button
                              className={`px-4 py-2 mx-1 ${
                                writeComment.length >= 1
                                  ? " bg-[#272727] cursor-pointer hover:bg-[#414140] "
                                  : "  bg-gray-700 cursor-not-allowed text-[#6C6C6C] "
                              } rounded-full bold     `}
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default Commenter;
