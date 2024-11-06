import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import NavbarTopShelter from "../ShelterComponents/NavbarTopShelter";
import {AppContainer, Footer, FooterText} from "../Navbar/style";

const MainPageSessionShelter = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/signin";
        }
    }, []);


    return (
        <AppContainer>
            <NavbarTopShelter />
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Footer>
                <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </AppContainer>
    );
};

export default MainPageSessionShelter;
