import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { CallContext } from "../Hooks/CallingCotext";
import { ThemeContext } from "../Hooks/ThemeContext";
import ResultCard from "./Result-component/ResultCard";

const Result = () => {
  const location = useLocation();
  const params = useParams();
  const {directSearch, setdirectSearch}=useContext(CallContext)
  const [searchVideoList, setsearchVideoList] = useState([]);
  const apikey = "AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY";
  // const apikey = "AIzaSyCFT7jTy4t_EZtvr--ivo-NO4rrT1Dn-C0";
  // const apikey = "AIzaSyAe2cP53vZdbGJHu8m8Bj-UC3JTk00PMC8";
  const { isShowLeftbar, windowResize, setisShowScrollbar } =
    useContext(ThemeContext);

  setisShowScrollbar(false);
setdirectSearch(true)
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
  return (
    <div
      className={` grid text-[#FFFFFF] grid-col-1 max-w-[1266px]  bg-[transparent]  m-auto result pt-[119px]   `}
    >
      {searchVideoList.length === 0 || searchVideoList === undefined
        ? ""
        : searchVideoList.items.map((item, index) => {
            return (
              <ResultCard
                item={item}
                apikey={apikey}
                allitems={searchVideoList.items}
                index={index}
              />
            );
          })}
    </div>
  );
};

export default Result;
