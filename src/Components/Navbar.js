import React, { useContext, useState } from "react";
import Button from "./Navbar-Components/Button";
import DotsOption from "./Navbar-Components/DotsOption";
import Input from "./Navbar-Components/Input";
import Voice from "./Navbar-Components/Voice";
import Logo from "./Navbar-Components/Logo";
import ScrollBar from "./Navbar-Components/ScrollBar";
import Leftbar from "./Menu-Components/Leftbar";
import { ThemeContext, ThemeProvider } from "../Hooks/ThemeContext";
const ListOptions = {
  items: [
    "Your data on Youtube",
    "Appearance: ",
    "Language: ",
    "Restricted:",
    "Location:",
    "Keyboard-shortcuts",
  ],
  itemspic: [
    "fa-solid fa-user-shield",
    "fa-solid fa-moon",
    "fa-solid fa-language",
    "fa-solid fa-shield-dog",
    "fa-solid fa-globe",
    "fa-solid fa-keyboard",
  ],
  Appearance: ["Dark", "White"],
  Language: ["English"],
  Restricted: ["On", "off"],
  Location: [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua &amp; Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia &amp; Herzegovina",
    "Botswana",
    "Brazil",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Cote D Ivoire",
    "Croatia",
    "Cruise Ship",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Polynesia",
    "French West Indies",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Kyrgyz Republic",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Pierre &amp; Miquelon",
    "Samoa",
    "San Marino",
    "Satellite",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "St Kitts &amp; Nevis",
    "St Lucia",
    "St Vincent",
    "St. Lucia",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor L'Este",
    "Togo",
    "Tonga",
    "Trinidad &amp; Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks &amp; Caicos",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Virgin Islands (US)",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ],
};

const Navbar = ({ searchIcon, setSearchIcon }) => {
  const { isShowLeftbar, toggleLeftbar, isShowScrollbar } =
    useContext(ThemeContext);
  const [isshowsearchBar, setisshowsearchBar] = useState(false);
  return (
    <>
      {isshowsearchBar ? (
        <>
          <div className="bg-[#0F0F0F] z-10  px-3 fixed w-[100%] ">
            <div
              onClick={() => setSearchIcon(false)}
              className="flex items-center justify-between"
            >
              <i
                onClick={() => {
                  setisshowsearchBar(false);
                }}
                className="fa-solid text-white mx-4 hover:cursor-pointer fa-angle-left"
              ></i>
              <div
                className={`flex nav-input  flex-grow   items-center`}
                style={{ display: "grid", gridTemplateColumns: "1fr auto" }}
              >
                <Input searchIcon={searchIcon} setSearchIcon={setSearchIcon} />
                <Voice />
              </div>
            </div>
            {isShowScrollbar ? <ScrollBar /> : ""}
          </div>
        </>
      ) : (
        <>
          <div className="fixed w-[100%] z-10 backdrop-blur-[8px]  bg-[#0F0F0F]/85 px-3 navbar ">
            <div
              onClick={() => setSearchIcon(false)}
              className=" flex items-center justify-between"
            >
              <Logo setleftBar={toggleLeftbar} leftBar={isShowLeftbar} />

              <div
                className={`flex nav-input flex-grow max-w-[600px] mx-[43px] ${
                  isShowLeftbar ? "mx-[100px]" : "mx-[43px]"
                } items-center`}
              >
                <Input searchIcon={searchIcon} setSearchIcon={setSearchIcon} />
                <Voice />
              </div>

              <div className="flex nav-btn items-center px-2">
                <i
                  onClick={() => setisshowsearchBar(true)}
                  className="fa-solid text-[#FFFFFF] hover:cursor-pointer magnifying fa-magnifying-glass mx-2"
                ></i>
                <DotsOption
                  ListOptions={ListOptions}
                  isshowsearchBar={isshowsearchBar}
                />
                <Button
                  content1={
                    <i className="fa-regular fa-circle-user text-xl mx-1"></i>
                  }
                  text={"Sign in"}
                />
              </div>
            </div>
            {isShowScrollbar ? (
              <ScrollBar
                leftBar={isShowLeftbar}
                OptionsList={[
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2,
                  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                  2, 2, 2, 2, 2, 2,
                ]}
              />
            ) : (
              ""
            )}
          </div>
          {isShowLeftbar ? <Leftbar /> : ""}
        </>
      )}
    </>
  );
};

export default Navbar;
