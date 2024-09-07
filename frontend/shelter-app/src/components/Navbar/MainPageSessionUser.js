import React, { useState, useEffect } from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements.js";
import SideBar from "../SideBar/SideBar";
import Background2 from "../Background/Background2";
import LowBackground from "../LowBackground/LowBackground";
import LoginBackground from "../Background/BackgroundLogin";

const MainPageSessionUser = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/signin";
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

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
                    <NavLink to="/my-account">Moje konto</NavLink>
                    <NavLink to="/tablica">Tablica ogłoszeń</NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink as="button" onClick={handleLogout}>
                        Wyloguj się
                    </NavBtnLink>
                </NavBtn>
            </Nav>
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <LoginBackground />
            <LowBackground />
            <Background2 />
        </>
    );
};

export default MainPageSessionUser;
