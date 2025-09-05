import React, { useContext, useEffect, useState } from "react";
import Card from "../Home-components/Card";
import { ThemeContext } from "../../Hooks/ThemeContext";
import FetchedData from "../../FetchedData";
import { useLocation } from "react-router";
const Home = () => {
  const [fetchData, setfetchData] = useState(FetchedData);
  // const apikey = "AIzaSyAe2cP53vZdbGJHu8m8Bj-UC3JTk00PMC8";
  const [Notfound, setNotfound] = useState(false);
  // const apikey = "AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY";
  const apikey = "AIzaSyD1BpiH_xyLfPrjA_2omJMfME5oRzEQTk8";
  const location = useLocation();
  useEffect(() => {
    if (location.state === null) {
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=nature&type=video&maxResults=100&key=${apikey}`
      )
        .then((res) => res.json())
        .then((data) => {
          setfetchData(data);
        })
        .catch((err) => setNotfound(true));
    } else {
      setfetchData(location.state);
    }
  }, []);
  const { isShowLeftbar, windowResize, setisShowScrollbar } =
    useContext(ThemeContext);
  setisShowScrollbar(true);
  const VideosList = fetchData.items;
  return (
    <div
      className={`pt-[120px] flex flex-wrap  grid-cols-4 gap-10  ${
        isShowLeftbar && windowResize >= 1200
          ? " md:ml-[15rem]"
          : " md:ml-[5rem]"
      } pl-[2px] text-black`}
    >
      {VideosList.map((item) => {
        return <Card item={item} />;
      })}
    </div>
  );
};

export default Home;
