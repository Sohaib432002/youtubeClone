import React from "react";
import { Link, Outlet } from "react-router";
const iconList = [
  "fa-solid fa-house",
  "fa-solid fa-film",
  "fa-solid fa-circle-play",
  "fa-regular fa-circle-user",
  "fa-solid fa-clock-rotate-left",
];

const listitems = ["home", "shorts", "Subscriptions", "you", "history"];
const MenuOptions = ({ marignTop }) => {
  return (
    <>
      <div
        className={`bg-[#0F0F0F]         mt-[59px]
       z-20 hidden md:flex text-[10px] h-[100vh] fixed  text-white flex  flex-col items-center w-[72px]`}
      >
        {listitems.map((item, i) => {
          return (
            <Link key={i} to={`./${item}`}>
              <div
                className={`flex hover:bg-[#272727] w-[50px] 
                   text-[16px]
                  rounded-[10px] px-[2rem] py-[1rem]   my-2 text-white flex-col items-center`}
              >
                <i className={`${iconList[i]}`}></i>
                <p className="text-[10px]">{item}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <Outlet />
    </>
  );
};

export default MenuOptions;
