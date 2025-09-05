import React, { useState } from "react";
import Commenter from "./subComponents/Commenter";
import CommentSkel from "./subComponents/CommentSkel";

const Comments = ({ fetchData, commentData }) => {
  const [Comment, setComment] = useState(false);
  const [sortOptions, setsortOptions] = useState(false);
  const [writeComment, setwriteComment] = useState("");
  const [commentContent, setcommentContent] = useState("");
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
      {commentData.length === 0 ? (
        <CommentSkel />
      ) : (
        <>
          <div className="max-w-[1227px] player text-[20px] text-[#FFFFFF]   aspect-video   rounded-[10px] ml-20 ">
            <div className="flex relative text-[16px]  font-black p-5 items-center ">
              {" "}
              <h1 className="mr-5 text-[20px]">
                {formatNumber(fetchData.items[0].statistics.commentCount)}{" "}
                Comments
              </h1>
              <span
                className="cursor-pointer"
                onClick={() => setsortOptions(!sortOptions)}
              >
                <i className="fa-solid fa-align-left text-[16px] mx-2"></i>
                Sort by
              </span>
              {sortOptions && (
                <div className=" z-30 left-[171px] top-[55px]  bg-[#272727] rounded-lg absolute">
                  <div className="flex flex-col  cursor-pointer  my-2 ">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="px-4 py-2 flex items-center hover:bg-[#414140] py-1"
                    >
                      <p>Top Comment</p>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="px-4 py-2 flex cursor-pointer items-center  hover:bg-[#414140] py-1"
                    >
                      <p>Newest Comment</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col text-[14px]  ">
              {Comment ? (
                <div>
                  <b>Commenting as</b>
                  <div className="commenterIdentity  my-3 flex items-center ">
                    <img
                      alt="pic"
                      src="../../favicon.ico"
                      width={50}
                      className="rounded-full"
                    />
                    <div className="flex mx-3 flex-col">
                      <b> sohaib Maqsood</b>
                      <b> @ChannelId</b>
                    </div>
                    <div
                      onClick={() =>
                        alert("sorry This feature is in working..")
                      }
                      className="edit p-3  mx-2 cursor-pointer  rounded-full"
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </div>
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setwriteComment(e.target.value)}
                    className="w-[100%] px-3 py-1 bg-[transparent] outline-none border-b"
                  />
                  <div className="flex justify-end my-2">
                    <button
                      onClick={() => {
                        setwriteComment("");
                        setComment(false);
                      }}
                      className="px-4 py-2 mx-1 rounded-full bold bg-[#272727]  hover:bg-[#414140]  "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setcommentContent(writeComment)}
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
              ) : (
                <div className="flex  items-center ">
                  <img
                    alt="pic"
                    src="../../favicon.ico"
                    className="rounded-full"
                    width={50}
                  />
                  <span
                    onClick={() => {
                      setComment(true);
                      setcommentContent(writeComment);
                    }}
                    className="bg-[transparent] cursor-pointer ml-5 border-b w-[100%] outline-none"
                  >
                    Add a Comment
                  </span>
                </div>
              )}
            </div>

            <Commenter
              commentContent={commentContent}
              setwriteComment={setwriteComment}
              setComment={setComment}
              writeComment={writeComment}
              commentData={commentData}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Comments;
