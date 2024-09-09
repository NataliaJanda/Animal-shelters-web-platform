import React, {useState} from "react";

import {
    Bars, NavBarSignLink,
    NavBtn, NavBtnLink,
    NavLink, NavMenu,
} from "./NavbarElements.js";
import styled from "styled-components";
import SideBar from "../SideBar/SideBar";

export const Nav = styled.nav`
    background: white;
    height: 50px;
    display: flex;
    justify-content: space-between;
    z-index: 15;
    margin: -8px;
`;
const NavbarTopUnlogin = () => {
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
        </>
    );
};

export default NavbarTopUnlogin;