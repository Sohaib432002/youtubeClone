import React from "react";

const ScrollBar = ({ leftBar, OptionsList }) => {
  return (
    <div className="h-[3rem]  overflow-hidden">
      <div
        onScroll={() => console.dir()}
        className={`text-white flex p-0 md:${
          leftBar ? "ml-[14rem]" : "ml-20"
        }   overflow-auto ml-0`}
      >
        {OptionsList.map((i, k) => {
          return (
            <div key={k} className="inline-flex hover:cursor-pointer ">
              <span className="p-2 font-semibold bg-[#272727]/85  text-[#DBDBDB] rounded-lg mx-2 my-1 ">
                hello
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollBar;
