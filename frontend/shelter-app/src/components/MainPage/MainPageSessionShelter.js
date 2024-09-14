import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import NavbarTopShelter from "../ShelterComponents/NavbarTopShelter";

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
        <>
            <NavbarTopShelter />
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
};

export default MainPageSessionShelter;
