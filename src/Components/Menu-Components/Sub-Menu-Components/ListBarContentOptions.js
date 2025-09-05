import React from "react";
import { Link } from "react-router";

const ListBarContentOptions = ({ iconList, listitems, heading }) => {
  return (
    <>
      <p
        className={`${
          heading !== undefined ? "" : "hidden"
        } text-[16px] font-bold mx-5 my-1`}
      >
        {heading}
      </p>

      {listitems.map((item, i) => {
        return (
          <>
            <Link key={`${i}`} to={`./${item}`}>
              <div className="flex flex-start ml-2 mr-3 rounded-2xl hover:bg-[#272727] items-center">
                <div
                  className={`flex  w-[50px] 
                  text-[20px]
                  rounded-[10px]  py-[1rem]   mx-2 text-white flex-col items-center`}
                >
                  <i className={`fa-solid fa-${iconList[i]}`}></i>
                </div>
                <div>
                  <h2 className="font-semibold text-[16px]">{item}</h2>
                </div>
              </div>
            </Link>
          </>
        );
      })}
    </>
  );
};

export default ListBarContentOptions;
