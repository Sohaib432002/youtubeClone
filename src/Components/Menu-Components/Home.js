import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ThemeContext } from "../../Hooks/ThemeContext";
import Card from "../Home-components/Card";
const Home = () => {
  const [fetchData, setfetchData] = useState([]);
  // const apikey = "AIzaSyAe2cP53vZdbGJHu8m8Bj-UC3JTk00PMC8";
  const [Notfound, setNotfound] = useState(false);
  // const apikey = "AIzaSyBbTteUucVkGoCO0ZQ4GwitYZNyqqRPYzY";
  // const apikey = "AIzaSyCFT7jTy4t_EZtvr--ivo-NO4rrT1Dn-C0";
  const apikeyClone2='AIzaSyC6eVSk2EOI3cu9SzITToFW1s0z2ns-eg0'
  const location = useLocation();
  useEffect(() => {
    if (location.state === null) {
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=''&type=video&maxResults=100&key=${apikeyClone2}`
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
    <>
      <div
        onScrollEnd={() => {
          console.log("jhab bhai end hogiya hai");
        }}
      >
        {fetchData.length === 0 ? (
          <>
            <h1>Please Wait</h1>
          </>
        ) : (
          <div
            onScroll={() => {
              "han";
            }}
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
        )}
      </div>
    </>
  );
};

export default Home;
