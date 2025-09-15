import { useContext, useState } from "react";
import { Outlet } from "react-router";
import { ThemeContext } from "../Hooks/ThemeContext";
import ChannelBanner from "./ChannelDetails-Components/ChannelBanner";
import ChannelData from "./ChannelDetails-Components/ChannelData";
import ChannelIntro from "./ChannelDetails-Components/ChannelIntro";
import OptionsSelection from "./ChannelDetails-Components/OptionsSelection";

const ChannelDetails = () => {
  const { setisShowScrollbar } = useContext(ThemeContext)
  setisShowScrollbar(false)
  const [more,setmore]=useState(false)
  const bannerExternalUrl = ChannelData.items[0].brandingSettings.image.bannerExternalUrl
  const ChannelPic=ChannelData.items[0].snippet.thumbnails.high.url
  return (
    <>
      <div className={`pt-20 pl-20  channelDetail max-w-[1300px]  m-[auto]`}>
        <ChannelBanner bannerExternalUrl={bannerExternalUrl} />
        <ChannelIntro ChannelPic={ChannelPic} more={more} setmore={setmore} />
        <OptionsSelection />
        <Outlet/>
        </div>
    </>
  );
};

export default ChannelDetails;
