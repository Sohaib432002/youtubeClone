import React from "react";

const Button = ({ hover, content1, bgColor, textColor, text }) => {
  return (
    <button
      className={`font-bold  bg-[${bgColor ? `${bgColor}` : ""}] hover-[${
        hover ? `${hover}` : ""
      } bg-gray-800 hover:border-black border-gray-600 flex items-center rounded-[30px] border-[0.01px] text-[14px] py-1 px-3  ${
        textColor ? `text-[${textColor}]` : "text-white"
      } `}
    >
      {content1}
      <h5>{text}</h5>
    </button>
  );
};

export default Button;
