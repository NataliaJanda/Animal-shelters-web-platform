// components/MainPage/index.js
import React, { useState } from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavBarSignLink,
} from "./NavbarElements.js";
import SideBar from "../SideBar/SideBar";
import Background2 from "../Background/Background2";
import LowBackground from "../LowBackground/LowBackground";
import Background from "../Background/Background";

const MainPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
      <>
        <Nav>
          <Bars onClick={toggleSidebar} />
          <NavMenu>
              <NavLink to="/" activeStyle>
                  Home
              </NavLink>
            <NavLink to="/about" activeStyle>O nas</NavLink>
            <NavLink to="/events" activeStyle>Tablica ogłoszeń</NavLink>
            <NavLink to="/collection">Zbiórki</NavLink>
          </NavMenu>
          <NavBtn>
            <NavBarSignLink to="/sign-up">Zarejestruj się</NavBarSignLink>
            <NavBtnLink to="/SigninOption">Zaloguj się</NavBtnLink>
          </NavBtn>
        </Nav>
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Background />
        <LowBackground />
        <Background2 />
      </>
  );
};

export default MainPage;
