import React from "react";

const PlayerSkeleton = () => {
  return (
    <>
      <div className="max-w-[1227px] player     overflow-hidden rounded-[10px] ml-20 ">
        <div className="bg-gray-700 h-[40vh] rounded-xl"></div>
        <div className="my-3 h-[50px] rounded-full bg-gray-700 w-[50%]"></div>
        <div className="my-3 h-[50px] rounded-full bg-gray-700 w-[30%]"></div>
        <div className="flex  justify-between px-10">
          <div className="my-3 h-[50px] rounded-full  bg-gray-700 w-[7%]"></div>
          <div className="w-[50%] justify-end flex">
            <div className="mx-3 h-[50px] rounded-full bg-gray-700 w-[20%]"></div>
            <div className="mx-3 h-[50px] rounded-full bg-gray-700 w-[20%]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerSkeleton;
