import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { ThemeContext } from "../Hooks/ThemeContext";
import ResultCard from "./Result-component/ResultCard";

const Result = () => {
  const location = useLocation();
  const params = useParams();
  console.log(params);
  const [searchVideoList, setsearchVideoList] = useState([]);
  // const apikey = "AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY";
  const apikey = "AIzaSyD1BpiH_xyLfPrjA_2omJMfME5oRzEQTk8";
  const { isShowLeftbar, windowResize, setisShowScrollbar } =
    useContext(ThemeContext);

  setisShowScrollbar(false);
  useEffect(() => {
    if (location.state === null) {
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${params.text}&maxResults=50&key=${apikey}`
      )
        .then((res) => res.json())
        .then((data) => {
          setsearchVideoList(data);
        })
        .catch((err) => "error");
    }
  }, []);
  console.log();
  return (
    <div
      className={` grid text-[#FFFFFF] grid-col-1  max-w-[1266px]  bg-[transparent]  m-auto result pt-[119px]   `}
    >
      {searchVideoList.length === 0
        ? ""
        : searchVideoList.items.map((item) => {
            return <ResultCard item={item} apikey={apikey} />;
          })}
    </div>
  );
};

export default Result;
