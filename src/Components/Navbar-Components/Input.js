import React, { useState } from "react";
import { Link } from "react-router";

const Input = ({ searchIcon, setSearchIcon }) => {
  const [RemvoeText, setRemoveText] = useState("");
  return (
    <div
      className={`flex flex-grow  border-gray-600 border-[0.5px] rounded-[100px] ${
        searchIcon ? "border-gray" : "border-gray"
      } items-center overflow-hidden`}
    >
      <div
        className={`flex bg-[#121212] flex-grow 
           ${
             searchIcon
               ? "border-blue-500 pl-4  rounded-tl-[23px] rounded-bl-[23px] border-[1px]"
               : ""
           }  items-center overflow-hidden  `}
      >
        <div className={` ${searchIcon ? "opacity-1" : "opacity-0"} p-2`}>
          <i className="fa-solid text-[#FFFFFF] fa-magnifying-glass"></i>
        </div>

        <div className="flex w-[100%] bg-[#121212] items-center">
          <input
            onClick={(e) => {
              setSearchIcon(true);
              e.stopPropagation();
            }}
            value={RemvoeText}
            onChange={(e) => setRemoveText(e.target.value)}
            type="text"
            className=" text-white w-[9px] flex-grow  bg-[#121212]  text-[16px] ring-blue-700 outline-none m-1 p-1 "
            placeholder="Search"
          />

          <i
            onClick={() => {
              setRemoveText("");
            }}
            className={`fa-solid fa-xmark text-white  right-[25]  pr-2 hover:cursor-pointer ${
              RemvoeText.length > 0 ? "opacity-1" : "opacity-0"
            }`}
          ></i>
        </div>
      </div>
      <Link
        to={`/result/${RemvoeText}`}
        // onSubmit={}
        onClick={() => setRemoveText("")}
      >
        <div className="px-4 hover:cursor-pointer hover:bg-[#3D3D3D] py-2 bg-[#222222]">
          {" "}
          <i className="fa-solid fa-magnifying-glass  text-[#EFEFEF]"></i>
        </div>
      </Link>
    </div>
  );
};

export default Input;
