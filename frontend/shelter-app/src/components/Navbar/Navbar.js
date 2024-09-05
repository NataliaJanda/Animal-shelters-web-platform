// components/Navbar/index.js
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

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
      <>
        <Nav>
          <Bars onClick={toggleSidebar} />
          <NavMenu>
            <NavLink to="/about" activeStyle>
              O nas
            </NavLink>
            <NavLink to="/events" activeStyle>
              Współpraca
            </NavLink>
            <NavLink to="/collection">Zbiórki</NavLink>
            <NavLink to="/tablica">Tablica ogłoszeń</NavLink>
          </NavMenu>
          <NavBtn>
            <NavBarSignLink to="/sign-up">Zarejestruj się</NavBarSignLink>
            <NavBtnLink to="/signin">Zaloguj się</NavBtnLink>
          </NavBtn>
        </Nav>
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Background />
        <LowBackground />
        <Background2 />
      </>
  );
};

export default Navbar;
