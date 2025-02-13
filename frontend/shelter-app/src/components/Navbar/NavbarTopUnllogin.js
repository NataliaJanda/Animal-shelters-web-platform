import React, { useState, useEffect } from "react";
import {
    Bars, NavBarSignLink,
    NavBtn, NavBtnLink,
    NavLink, NavMenu,
} from "./NavbarElements.js";
import styled from "styled-components";
import SideBar from "../SideBar/SideBar";
import logo from "./logo.png"

export const Nav = styled.nav`
    background: white;
    height: 50px;
    display: flex;
    justify-content: space-between;
    z-index: 15;
    margin: -8px;
`;

const NavbarTopLoginSession = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('shelterId');
        localStorage.removeItem('userId')
        setIsLoggedIn(false);
    };

    return (
        <>
            <Nav>
                <Bars onClick={toggleSidebar} />
                <NavMenu>
                    {isLoggedIn ? (
                        <NavLink to="/MainPageSessionUser" activeStyle>
                            <img src={logo} alt="Logo" style={{height: '65px'}}/>
                        </NavLink>
                    ) : (
                        <>
                            <NavLink to="/" activeStyle>
                                <img src={logo} alt="Logo" style={{height: '65px'}}/>
                            </NavLink>
                        </>
                    )}
                    <NavLink to="/about" activeStyle>O nas</NavLink>
                    <NavLink to="/collection">Zbiórki</NavLink>
                    <NavLink to="/events" activeStyle>Tablica ogłoszeń</NavLink>
                    <NavLink to="/animals" activeStyle>Zwierzęta</NavLink>
                    {isLoggedIn ? (
                        <NavLink to="/MyAccount">Moje konto</NavLink>
                    ) : (
                        <></>
                    )}
                </NavMenu>
                <NavBtn>
                    {isLoggedIn ? (
                        <NavBtnLink to="/" onClick={handleLogout}>Wyloguj się</NavBtnLink>
                    ) : (
                        <>
                            <NavBarSignLink to="/sign-up">Zarejestruj się</NavBarSignLink>
                            <NavBtnLink to="/signin">Zaloguj się</NavBtnLink>
                        </>
                    )}
                </NavBtn>
            </Nav>
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
};

export default NavbarTopLoginSession;
