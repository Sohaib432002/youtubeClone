import React, { useContext } from "react";
import Scrollbar from "../Navbar-Components/ScrollBar";
import RelatedVidosCard from "./subComponents/RelatedVidosCard";
import { ThemeContext } from "../../Hooks/ThemeContext";
import RelatedVideosShel from "./subComponents/RelatedVideosShel";
const RelatedVideos = ({ randomVideosData, setupdate }) => {
  const { isShowLeftbar, windowResize } = useContext(ThemeContext);

  return (
    <>
      {randomVideosData.length === 0 ? (
        <>
          <RelatedVideosShel windowResize={windowResize} />
        </>
      ) : (
        <>
          <div
            className={`${
              windowResize >= 1170 ? "max-w-[370px]" : ""
            }  mx-3 grid `}
          >
            <div className="mx-6  overflow-hidden">
              <Scrollbar OptionsList={[1, 2, 3, 4, 5, 6, 7, 8]} />
            </div>

            <div
              className={`${windowResize < 1170 ? " grid-cols-3" : ""}
          
          ${
            windowResize >= 1170
              ? "flex flex-col  justify-center"
              : " grid gap-3"
          }
          ${windowResize <= 770 ? "grid-cols-2" : ""}
          ${windowResize <= 570 ? "grid-cols-1" : ""}
           `}
            >
              {" "}
              {randomVideosData.items.map((item) => {
                return (
                  <RelatedVidosCard
                    setupdate={setupdate}
                    item={item}
                    windowResize={windowResize}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RelatedVideos;
