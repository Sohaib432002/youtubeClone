import React, { useContext, useState } from 'react'
import Button from './Navbar-Components/Button'
import DotsOption from './Navbar-Components/DotsOption'
import Input from './Navbar-Components/Input'
import Voice from './Navbar-Components/Voice'
import Logo from './Navbar-Components/Logo'
import ScrollBar from './Navbar-Components/ScrollBar'
import Leftbar from './Menu-Components/Leftbar'
import SignInModal from './Navbar-Components/SignInModal'
import CreateMenu from './Navbar-Components/CreateMenu'
import { ThemeContext } from '../Hooks/ThemeContext'
import { useAuth } from '../Hooks/AuthContext'
const Navbar = ({ searchIcon, setSearchIcon }) => {
  const { isShowLeftbar, toggleLeftbar, isShowScrollbar } = useContext(ThemeContext)
  const { user, isSignedIn, openSignIn, signOut } = useAuth()
  const [isshowsearchBar, setisshowsearchBar] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <>
      {isshowsearchBar ? (
        <>
          <div className="bg-[#0F0F0F] z-10 px-3 fixed w-full left-0 top-0">
            <div onClick={() => setSearchIcon(false)} className="flex items-center justify-between gap-2 py-2">
              <i
                onClick={() => {
                  setisshowsearchBar(false)
                }}
                className="fa-solid text-white mx-2 hover:cursor-pointer fa-angle-left flex-shrink-0"
              ></i>
              <div className="flex nav-input flex-1 min-w-0 items-center gap-2">
                <Input searchIcon={searchIcon} setSearchIcon={setSearchIcon} />
                <Voice />
              </div>
            </div>
            {isShowScrollbar ? <ScrollBar /> : ''}
          </div>
        </>
      ) : (
        <>
          <div className="fixed w-full left-0 top-0 z-10 backdrop-blur-[8px] bg-[#0F0F0F]/85 px-2 sm:px-3 navbar">
            <div
              onClick={() => setSearchIcon(false)}
              className="flex items-center justify-between gap-2 py-1"
            >
              <Logo setleftBar={toggleLeftbar} leftBar={isShowLeftbar} />

              <div
                className={`flex nav-input flex-grow max-w-[600px] mx-2 lg:mx-[43px] ${
                  isShowLeftbar ? 'lg:mx-[100px]' : ''
                } items-center min-w-0`}
              >
                <Input searchIcon={searchIcon} setSearchIcon={setSearchIcon} />
                <Voice />
              </div>

              <div className="flex nav-btn items-center gap-1 sm:gap-2 px-1 flex-shrink-0">
                <i
                  onClick={() => setisshowsearchBar(true)}
                  className="fa-solid text-white hover:cursor-pointer magnifying fa-magnifying-glass mx-1"
                ></i>
                <CreateMenu />
                <button
                  type="button"
                  className="relative hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[#272727] text-white"
                  aria-label="Notifications"
                >
                  <i className="fa-regular fa-bell text-xl"></i>
                  <span className="absolute top-1 right-1 bg-[#cc0000] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    9+
                  </span>
                </button>
                <DotsOption />
                {isSignedIn ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setProfileOpen((v) => !v)}
                      className="ml-1"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </button>
                    {profileOpen ? (
                      <div className="absolute right-0 top-10 bg-[#282828] rounded-lg overflow-hidden w-48 z-50 text-white text-sm shadow-lg">
                        <div className="px-3 py-2 border-b border-[#3f3f3f]">
                          <p className="font-medium truncate">{user.name}</p>
                          {user.email ? (
                            <p className="text-xs text-[#AAAAAA] truncate">{user.email}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-[#3E3E3E]"
                          onClick={() => {
                            setProfileOpen(false)
                            signOut()
                          }}
                        >
                          Sign out
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div onClick={openSignIn} className="cursor-pointer">
                    <Button
                      content1={<i className="fa-regular fa-circle-user text-xl mx-1"></i>}
                      text={'Sign in'}
                    />
                  </div>
                )}
              </div>
            </div>
            {isShowScrollbar ? <ScrollBar leftBar={isShowLeftbar} /> : ''}
          </div>
          {isShowLeftbar ? <Leftbar /> : ''}
          <SignInModal />
        </>
      )}
    </>
  )
}

export default Navbar
