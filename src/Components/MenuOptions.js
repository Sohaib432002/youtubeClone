import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router'
import { ThemeContext } from '../Hooks/ThemeContext'

const navItems = [
  { path: '/', label: 'Home', icon: 'fa-solid fa-house', end: true },
  { path: '/shorts', label: 'Shorts', icon: 'fa-solid fa-film' },
  { path: '/Subscriptions', label: 'Subs', icon: 'fa-solid fa-circle-play' },
  { path: '/you', label: 'You', icon: 'fa-regular fa-circle-user' },
  { path: '/history', label: 'History', icon: 'fa-solid fa-clock-rotate-left' },
]

const MenuOptions = () => {
  const { isDesktopSidebar } = useContext(ThemeContext)

  return (
    <>
      {/* Mini rail only below desktop when full sidebar is closed */}
      {!isDesktopSidebar ? (
        <aside className="bg-[#0F0F0F] mt-14 z-20 hidden md:flex text-[10px] h-[calc(100vh-56px)] fixed text-white flex-col items-center w-[72px] border-r border-[#1a1a1a]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex w-[64px] text-[16px] rounded-xl py-3 my-0.5 text-white flex-col items-center hover:bg-[#272727] ${
                  isActive ? 'bg-[#272727]' : ''
                }`
              }
            >
              <i className={item.icon}></i>
              <p className="text-[10px] mt-1 truncate max-w-[60px] text-center">{item.label}</p>
            </NavLink>
          ))}
        </aside>
      ) : null}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0F0F0F] border-t border-[#272727] flex justify-around items-center h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center text-[10px] py-1 px-2 ${
                isActive ? 'text-white' : 'text-[#AAAAAA]'
              }`
            }
          >
            <i className={`${item.icon} text-base`}></i>
            <span className="mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <Outlet />
    </>
  )
}

export default MenuOptions
