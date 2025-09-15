import { createContext, useState } from "react";

export const CallContext = createContext();
export const CallContextFun = ({ children }) => {
  const [directSearch, setdirectSearch] = useState(false)
  return (
    <CallContext.Provider value={{ directSearch, setdirectSearch }}>
      {children}
    </CallContext.Provider>
  )
}
