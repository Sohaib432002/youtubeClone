import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
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
  const { isShowLeftbar, toggleLeftbar, isShowScrollbar, isDesktopSidebar } =
    useContext(ThemeContext)
  const { user, isSignedIn, openSignIn, signOut } = useAuth()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileSearchOpen(false)
  }, [location.pathname])

  const closeMobileSearch = () => setMobileSearchOpen(false)

  if (mobileSearchOpen) {
    return (
      <>
        <div className="bg-[#0F0F0F] z-[100] px-2 fixed inset-x-0 top-0 mobile-search-bar shadow-lg border-b border-[#272727]">
          <div className="flex items-center gap-1 py-2 max-w-full">
            <button
              type="button"
              onClick={closeMobileSearch}
              className="text-white flex-shrink-0 w-10 h-10 rounded-full hover:bg-[#272727]"
              aria-label="Close search"
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
            <div className="flex flex-1 min-w-0 items-center gap-1">
              <Input
                searchIcon={searchIcon}
                setSearchIcon={setSearchIcon}
                autoFocus
                onSearchNavigate={closeMobileSearch}
              />
              <Voice />
            </div>
          </div>
          {isShowScrollbar ? <ScrollBar /> : null}
        </div>
        {/* Spacer so content isn't under the fixed bar */}
        <div className="h-14" aria-hidden />
        <Leftbar />
        <SignInModal />
      </>
    )
  }

  return (
    <>
      <div className="fixed w-full left-0 top-0 z-50 backdrop-blur-[8px] bg-[#0F0F0F]/95 px-2 sm:px-3 navbar">
        <div className="flex items-center justify-between gap-1 sm:gap-2 py-1 min-h-[56px]">
          <Logo setleftBar={toggleLeftbar} leftBar={isShowLeftbar} />

          {/* Desktop / tablet inline search — hidden on phones */}
          <div
            className={`hidden md:flex nav-input flex-grow max-w-[600px] mx-2 lg:mx-[43px] ${
              isDesktopSidebar || isShowLeftbar ? 'lg:mx-[100px]' : ''
            } items-center min-w-0`}
          >
            <Input searchIcon={searchIcon} setSearchIcon={setSearchIcon} />
            <Voice />
          </div>

          <div className="flex nav-btn items-center gap-0.5 sm:gap-1 px-0.5 flex-shrink-0">
            {/* Mobile search trigger */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden flex items-center justify-center text-white w-10 h-10 rounded-full hover:bg-[#272727]"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass text-lg"></i>
            </button>

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
            <div className="hidden md:block">
              <DotsOption />
            </div>
            {isSignedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="ml-0.5"
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
              <button type="button" onClick={openSignIn} className="cursor-pointer ml-0.5">
                <span className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full border border-[#3ea6ff] text-[#3ea6ff]">
                  <i className="fa-regular fa-circle-user text-lg"></i>
                </span>
                <span className="hidden sm:inline-block">
                  <Button
                    content1={<i className="fa-regular fa-circle-user text-xl mx-1"></i>}
                    text={'Sign in'}
                  />
                </span>
              </button>
            )}
          </div>
        </div>
        {isShowScrollbar ? (
          <ScrollBar leftBar={isDesktopSidebar || isShowLeftbar} />
        ) : null}
      </div>
      <Leftbar />
      <SignInModal />
    </>
  )
}

export default Navbar
