import { Outlet } from "react-router";
import { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";

function App() {
  const [searchIcon, setSearchIcon] = useState(false);
  return (
    <>
      <Navbar searchIcon={searchIcon} setSearchIcon={setSearchIcon} />
      <Outlet />
    </>
  );
}

export default App;
