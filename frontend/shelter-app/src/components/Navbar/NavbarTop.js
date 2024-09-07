import React, {useState} from "react";
import SideBarWithMenu from "../SideBar/SideBarWithMenu";

import {
    Bars,
    NavBtn, NavBtnLink,
    NavLink, NavMenu,
} from "./NavbarElements.js";
import styled from "styled-components";

export const Nav = styled.nav`
    background: #d9d9d9;
    height: 50px;
    display: flex;
    justify-content: space-between;
    z-index: 12;
    margin: -8px;
`;
const Navbar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <>
            <Nav>
                <Bars onClick={toggleSidebar} />
                <NavMenu>
                    <NavLink to="/" activeStyle>
                        Menu
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/SigninOption">Zaloguj się</NavBtnLink>
                </NavBtn>
            </Nav>
            <SideBarWithMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
};

export default Navbar;