import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import Background2 from "../Background/Background2";
import LowBackground from "../LowBackground/LowBackground";
import NavbarTopUnlogin from "../Navbar/NavbarTopUnllogin";
import Background from "../Background/Background";

const MainPageSessionUser = () => {

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
            <>
                <NavbarTopUnlogin />
                <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <Background />
                <LowBackground />
                <Background2 />
            </>
        </>
    );
};

export default MainPageSessionUser;
