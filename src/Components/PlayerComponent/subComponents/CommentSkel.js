import React from "react";

const CommentSkel = () => {
  return (
    <div className="max-w-[1227px] player text-[20px] text-[#FFFFFF]    aspect-video  overflow-hidden rounded-[10px] ml-20 ">
      <div className="flex items-center">
        <p className="w-[10%] rounded-full flex-inline m-3 bg-gray-700 h-[7vh]"></p>
        <div className="flex flex-col w-[100%]">
          {" "}
          <div className="w-[30%] bg-gray-700 h-[2vh] rounded-full"></div>
          <div className="w-[5%] bg-gray-700 my-1 h-[2vh] rounded-full"></div>
        </div>
      </div>
      <div className="flex items-center">
        <p className="w-[10%] rounded-full flex-inline m-3 bg-gray-700 h-[7vh]"></p>
        <div className="flex flex-col w-[100%]">
          {" "}
          <div className="w-[20%] bg-gray-700 h-[2vh] rounded-full"></div>
          <div className="w-[10%] bg-gray-700 my-1 h-[2vh] rounded-full"></div>
        </div>
      </div>
      <div className="flex items-center">
        <p className="w-[10%] rounded-full flex-inline m-3 bg-gray-700 h-[7vh]"></p>
        <div className="flex flex-col w-[100%]">
          {" "}
          <div className="w-[50%] bg-gray-700 h-[2vh] rounded-full"></div>
          <div className="w-[10%] bg-gray-700 my-1 h-[2vh] rounded-full"></div>
        </div>
      </div>
      <div className="flex items-center">
        <p className="w-[10%] rounded-full flex-inline m-3 bg-gray-700 h-[7vh]"></p>
        <div className="flex flex-col w-[100%]">
          {" "}
          <div className="w-[20%] bg-gray-700 h-[2vh] rounded-full"></div>
          <div className="w-[100%] bg-gray-700 my-1 h-[2vh] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkel;
