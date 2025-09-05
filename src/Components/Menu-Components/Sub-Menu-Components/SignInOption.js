import React from "react";
import Button from "../../Navbar-Components/Button";

const SignInOption = () => {
  return (
    <>
      <div className="p-3 mx-3 my-1 flex flex-col items-start  ">
        <p className="text-[14px]">
          {" "}
          Sign in to like videos, comment, and and subscribe.
        </p>
        <div className="my-3">
          <Button
            content1={
              <i className="fa-regular fa-circle-user text-xl mx-1"></i>
            }
            text={"Sign in"}
            textColor={"#3EA6E3"}
            hover={"bg-gray-800"}
            bgColor={"#1F2937"}
          />
        </div>
      </div>
    </>
  );
};

export default SignInOption;
