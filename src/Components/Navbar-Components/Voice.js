import React, { useState } from "react";

const Voice = () => {
  const [showTitle, setshowTitle] = useState(false);
  return (
    <>
      <div
        onMouseEnter={() => {
          setshowTitle(true);
        }}
        onMouseLeave={() => setshowTitle(false)}
        className="rounded-[1000px] hover:bg-[#3D3D3D] bg-[#222222] hover:cursor-pointer p-2 m-2 text-white "
      >
        <i className="fa-solid fa-microphone  "></i>
        {showTitle ? (
          <div className="absolute top-[60px] bg-gray-400 bg-opacity-50 rounded p-2 text-[14px]   text-white">
            Voice here
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Voice;
