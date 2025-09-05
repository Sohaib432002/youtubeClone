import React from "react";
import { Link } from "react-router";

const RelatedVideosShel = ({ windowResize }) => {
  return (
    <>
      <div
        className={`${
          windowResize >= 1170 ? "max-w-[370px]" : ""
        }  mx-3 grid grid-col-1`}
      >
        <div
          className={`${windowResize >= 970 ? "grid-cols-3" : "grid-cols-2"}
          ${windowResize >= 600 ? "grid-cols-2" : "grid-cols-1"}
          ${
            windowResize >= 1170
              ? "flex flex-col  justify-center"
              : "grid  gap-3"
          } `}
        >
          <Link>
            <div className={`${windowResize >= 1170 ? "flex" : ""} my-1`}>
              <div
                className={`object-contain ${
                  windowResize >= 1170 ? "" : "my-3"
                }  rounded-lg overflow-hidden`}
              >
                <img
                  width={`${windowResize >= 1170 ? 150 : "100%"}`}
                  src="../../skelpic.jpg"
                  className={`${windowResize >= 1170 ? "" : ""}`}
                  alt="thumbail"
                />
              </div>
              <div className="flex flex-grow flex-col ">
                <div
                  className={`${
                    windowResize >= 1170 ? "flex-grow" : "flex-grow"
                  } flex flex-col  mx-2`}
                >
                  {windowResize >= 1170 ? (
                    <p className=" h-[2vh] w-[120px] my-2 bg-gray-700"></p>
                  ) : (
                    <p className=" h-[2vh]  w-[120px] bg-gray-700"></p>
                  )}

                  <p className="w-[50px] h-[2vh] my-0 bg-gray-700"></p>
                  <p className="w-[10px] h-[2vh] my-1 bg-gray-700"></p>
                </div>
              </div>
            </div>
          </Link>
          <Link>
            <div className={`${windowResize >= 1170 ? "flex" : ""} my-1`}>
              <div
                className={`object-contain ${
                  windowResize >= 1170 ? "" : "my-3"
                }  rounded-lg overflow-hidden`}
              >
                <img
                  width={`${windowResize >= 1170 ? 150 : "100%"}`}
                  src="../../skelpic.jpg"
                  className={`${windowResize >= 1170 ? "" : ""}`}
                  alt="thumbail"
                />
              </div>
              <div className="flex flex-grow flex-col ">
                <div
                  className={`${
                    windowResize >= 1170 ? "flex-grow" : "flex-grow"
                  } flex flex-col  mx-2`}
                >
                  {windowResize >= 1170 ? (
                    <p className=" h-[2vh] w-[120px] my-2 bg-gray-700"></p>
                  ) : (
                    <p className=" h-[2vh]  w-[120px] bg-gray-700"></p>
                  )}

                  <p className="w-[50px] h-[2vh] my-0 bg-gray-700"></p>
                  <p className="w-[10px] h-[2vh] my-1 bg-gray-700"></p>
                </div>
              </div>
            </div>
          </Link>
          <Link>
            <div className={`${windowResize >= 1170 ? "flex" : ""} my-1`}>
              <div
                className={`object-contain ${
                  windowResize >= 1170 ? "" : "my-3"
                }  rounded-lg overflow-hidden`}
              >
                <img
                  width={`${windowResize >= 1170 ? 150 : "100%"}`}
                  src="../../skelpic.jpg"
                  className={`${windowResize >= 1170 ? "" : ""}`}
                  alt="thumbail"
                />
              </div>
              <div className="flex flex-grow flex-col ">
                <div
                  className={`${
                    windowResize >= 1170 ? "flex-grow" : "flex-grow"
                  } flex flex-col  mx-2`}
                >
                  {windowResize >= 1170 ? (
                    <p className=" h-[2vh] w-[120px] my-2 bg-gray-700"></p>
                  ) : (
                    <p className=" h-[2vh]  w-[120px] bg-gray-700"></p>
                  )}

                  <p className="w-[50px] h-[2vh] my-0 bg-gray-700"></p>
                  <p className="w-[10px] h-[2vh] my-1 bg-gray-700"></p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default RelatedVideosShel;
