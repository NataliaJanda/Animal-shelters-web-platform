// components/Navbar/index.js

import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  NavBarSign,
  NavBarSignLink,
} from "./NavbarElements.js";
import Background from "../Background/Background.js";
import LowBackground from "../LowBackground/LowBackground.js";

const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
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
        <NavBarSign>
          <NavBarSignLink to="/sign-up">Zarejestruj się</NavBarSignLink>
        </NavBarSign>
        <NavBtn>
          <NavBtnLink to="/signin">Zaloguj się</NavBtnLink>
        </NavBtn>
      </Nav>
      <Background />
      <LowBackground />
    </>
  );
};

export default Navbar;
