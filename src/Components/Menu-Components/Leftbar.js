import React, { useContext } from "react";
import MenuOptions from "../MenuOptions";
import LeftBarContent from "./Sub-Menu-Components/LeftBarContent";
import Logo from "../Navbar-Components/Logo";
import { ThemeContext, ThemeProvider } from "../../Hooks/ThemeContext";

const Leftbar = () => {
  const { isShowLeftbar, toggleLeftbar } = useContext(ThemeContext);
  return (
    <div className="fixed z-40 bg-[#0F0F0F] h-[100vh] w-[230px] top-[0px]">
      <Logo setleftBar={toggleLeftbar} padding={30} leftBar={isShowLeftbar} />
      <LeftBarContent />
    </div>
  );
};

export default Leftbar;
