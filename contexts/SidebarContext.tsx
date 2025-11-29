import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext({
  isVisible: false,
  toggleSidebar: () => {},
});

export const SidebarProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleSidebar = () => setIsVisible((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
