import React, { useState } from "react";

// ListOptions[items.split(":")[0]],
//                             items.split(":")[0]

const DotsOption = ({ ListOptions, isshowsearchBar }) => {
  const [open, setopen] = useState(false);
  // const [Appearance, setAppearance] = useState("");
  // const [Language, setLanguage] = useState("");
  // const [Restricted, setRestricted] = useState("");
  // const [Location, setLocation] = useState("");
  const [options, setOptions] = useState(false);
  const [select, setselect] = useState("dark");
  // const optionsSelector = (options, Name) => {
  //   <div className="w-[20rem] bg-[#282828] text-white overflow-hidden mb-2 rounded-lg  top-[50px] right-[8rem] absolute">
  //     <div className="flex items-center text-[16px] bold p-2">
  //       <i className="fa-solid fa-angle-left"></i>
  //       {Name}
  //     </div>
  //     <hr />

  //     {options.map((item) => {
  //       return (
  //         <div
  //           className="flex text-[16px] items-center font-semibold"
  //           onClick={() => setselect(item)}
  //         >
  //           {select ? <i className="fa-solid fa-check p-4"></i> : ""}
  //           <div className="">{item}</div>
  //         </div>
  //       );
  //     })}
  //   </div>;
  // };
  return (
    <button
      className="hover:cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setopen(!open);

        setOptions(false);
      }}
    >
      <div className="text flex flex-col  mr-3 ">
        <i className="fa-solid fa-circle text-white m-[2px]   text-[3px]"></i>
        <i className="fa-solid fa-circle text-white m-[2px]  text-[3px]"></i>
        <i className="fa-solid fa-circle text-white  m-[2px]  text-[3px]"></i>
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-[20rem] bg-[#2b2828] ${
            options ? "hidden" : ""
          } overflow-hidden  rounded-lg  top-[50px] ${
            isshowsearchBar ? "right-[1rem] mb-0" : "right-[8rem] mb-2"
          }  absolute `}
        >
          {ListOptions.items.map((items, i) => {
            return (
              <div
                key={i}
                onClick={(e) => {
                  setOptions(true);
                  setopen(false);
                  e.stopPropagation();
                }}
                className="flex nav-sub-options hover:bg-gray-500  text-white items-center"
              >
                <i
                  className={`${ListOptions.itemspic[i]} pr-10 text-xl p-3`}
                ></i>
                <div className="flex justify-around">
                  <p>{items}</p>

                  {Object.keys(ListOptions).includes(items.split(":")[0]) ? (
                    <p
                      onClick={(e) => {
                        setOptions(true);
                        setopen(false);
                        e.stopPropagation();
                      }}
                    >
                      {ListOptions[items.split(":")[0]].length >= 1 ? (
                        <i className="fa-solid fa-angle-right text-white"></i>
                      ) : (
                        ""
                      )}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
          <hr />
          <div className="flex text-white hover:bg-gray-500 my-1 items-center">
            <i className="fa-solid fa-gear pr-10 text-xl p-3 "></i>
            <p>Settings</p>
          </div>
          <hr />
          <div className="flex my-1 text-white hover:bg-gray-500 items-center">
            <i className="fa-regular fa-circle-question pr-10 text-xl p-3"></i>
            <p>Help</p>
          </div>
          <div className="flex  text-white mb-2 hover:bg-gray-500 items-center">
            <i className="fa-regular fa-message  pr-10 text-xl p-3"></i>
            <p>Send Feedback</p>
          </div>
        </div>
      )}
      {/* {options ? (
        <div className="w-[20rem] bg-[#2b2828] text-white overflow-hidden mb-2 rounded-lg  top-[50px] right-[8rem] absolute">
          <div className="flex items-center text-[16px] bold p-2">
            <i className="fa-solid fa-angle-left"></i>
            Apperance
          </div>
          <hr />
          <p>Setting Apply to this Browser Only</p>

        </div>
      ) : (
        ""
      )} */}
    </button>
  );
};

export default DotsOption;
