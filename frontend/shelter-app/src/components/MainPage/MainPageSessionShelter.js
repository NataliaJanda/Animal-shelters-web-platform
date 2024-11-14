import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import NavbarTopShelter from "../ShelterComponents/NavbarTopShelter";
import {AppContainer} from "../Navbar/style";
import ShelterFooter from "../Background/ShelterFooter";

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
            <ShelterFooter/>
        </AppContainer>
    );
};

export default MainPageSessionShelter;
