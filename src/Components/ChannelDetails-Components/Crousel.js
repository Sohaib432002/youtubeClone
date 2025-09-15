import { useRef, useState } from "react";
import CrouselCard from "./CrouselCard";

const Crousel = () => {
  const scrollRef = useRef(0)
  const el = scrollRef.current;
const canScrollX = el.scrollWidth > el.clientWidth;


  const [showLeftbtn,setshowLeftbtn]=useState(false)
  const [showRightbtn, setshowRightbtn] = useState(true)

  const scrollX = (distance) => {
    const scrollRight =scrollRef.current.scrollWidth -scrollRef.current.scrollLeft -scrollRef.current.clientWidth;
    if (scrollRef.current.scrollLeft === 0) {  setshowLeftbtn(false) } else { setshowLeftbtn(true) }
    if (scrollRight===0) { setshowRightbtn(false)} else { setshowRightbtn(true)    }
    if (scrollRef.current) { scrollRef.current.scrollBy({ left: distance, behavior: "smooth",  }); }
  };
  return (

    <>
      <div className="relative  ">
        <div onClick={() => { scrollX(-200); }} className={`left-button-crousel z-20 bg-gray-500/75 ${showLeftbtn?'':'hidden'}  absolute -left-6 bg-gray-700  p-3 rounded-full cursor-pointer top-[100px]`}>
<i className="fa-solid fa-arrow-left"></i>
      </div>
      <div ref={scrollRef} className="flex overflow-hidden  ">
        <CrouselCard/>
        <CrouselCard/>
        <CrouselCard/>
        <CrouselCard/>
        <CrouselCard/>
        <CrouselCard/>
    </div>
        <div onClick={() => { scrollX(200);setshowLeftbtn(true) }}  className={`right-button-crousel bg-gray-500/75 z-10 ${showRightbtn?'':'hidden'} absolute  -right-2 bg-gray-700  p-3 rounded-full cursor-pointer top-[100px]` }>
          <i  className="fa-solid fa-arrow-right "></i>
        </div>
        </div>
      </>

  )
}

export default Crousel
