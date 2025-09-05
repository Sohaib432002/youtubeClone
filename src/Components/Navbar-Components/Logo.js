import React from "react";
import { Link } from "react-router";

const Logo = ({ setleftBar, padding, leftBar }) => {
  return (
    <>
      <div className="flex items-center">
        <div
          className={`hover:bg-[#222222] hover:cursor-pointer rounded-[100px] p-[${padding}] h-12 flex items-center `}
        >
          <i
            onClick={() => {
              setleftBar(!leftBar);
            }}
            className="fa-solid fa-bars text-white mx-2 text-2xl "
          ></i>
        </div>
        <div className="flex items-center">
          <Link to={"./"}>
            <img
              src="./Logo.svg"
              className="logo-img max-w-[100px]"
              alt="logo"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Logo;
