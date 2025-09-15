import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isShowLeftbar, setisShowLeftbar] = useState(false);
  const [windowResize, setwindowResize] = useState(window.innerWidth);
  const [isShowScrollbar, setisShowScrollbar] = useState(true);

  window.addEventListener("resize", () => {
    setwindowResize(window.client);
    console.log(window.clientHeight);
  });

  const toggleLeftbar = () => {
    setisShowLeftbar(!isShowLeftbar);
  };
  return (
    <ThemeContext.Provider
      value={{
        isShowLeftbar,
        toggleLeftbar,
        windowResize,
        isShowScrollbar,
        setisShowScrollbar,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
