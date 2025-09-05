import React from "react";

import SignInOption from "./SignInOption";
import ListBarContentOptions from "./ListBarContentOptions";

const LeftBarContent = () => {
  return (
    <>
      <div
        className={`bg-[#0F0F0F] 
          scroll-bar
           mt-[0px]  z-20 overflow-visible overflow-y-scroll md:flex text-[10px] h-[100vh] fixed  text-white flex  flex-col  w-[230px]`}
      >
        <ListBarContentOptions
          iconList={["house", "film", "circle-play"]}
          listitems={["home", "shorts", "Subscriptions"]}
        />
        <hr className="border-[#272727] my-3" />
        <ListBarContentOptions
          iconList={["circle-user", "clock-rotate-left"]}
          listitems={["you", "history"]}
        />
        <hr className="border-[#272727] my-3" />
        <SignInOption />
        <hr className="border-[#272727] my-3" />
        <ListBarContentOptions
          iconList={["music", "gamepad", "newspaper", "trophy"]}
          listitems={["Music", "Gamming", "newspaper", "Trophy"]}
          heading={"Explore"}
        />
        <hr className="border-[#272727] my-3" />
        <ListBarContentOptions
          iconList={["music", "gamepad", "newspaper", "trophy"]}
          listitems={["Music", "Gamming", "newspaper", "Trophy"]}
          heading={"More from YouTube"}
        />
        <hr className="border-[#272727] my-3" />
        <ListBarContentOptions
          iconList={["gear", "flag", "circle-question", "message"]}
          listitems={["Setting", "Report History", "Help", "Send FeedBack"]}
          heading={"More from YouTube"}
        />
        <hr className="border-[#272727] my-3" />
        <div className="text-[14px]  p-2 my-1">
          <p>About Press Copyright Contact us CreatorsAdvertiseDevelopers </p>
          <br />

          <p>TermsPrivacyPolicy & SafetyHow YouTube worksTest new features</p>
        </div>
      </div>
    </>
  );
};

export default LeftBarContent;
