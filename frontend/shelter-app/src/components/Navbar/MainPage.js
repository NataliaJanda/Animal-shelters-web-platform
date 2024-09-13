import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";
import Background2 from "../Background/Background2";
import LowBackground from "../LowBackground/LowBackground";
import Background from "../Background/Background";
import NavbarTopUnlogin from "./NavbarTopUnllogin";

const MainPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
      <>
        <NavbarTopUnlogin />
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Background />
        <LowBackground />
        <Background2 />
      </>
  );
};

export default MainPage;
