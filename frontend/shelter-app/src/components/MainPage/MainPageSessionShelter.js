import React, { useState, useEffect } from "react";
import SideBar from "../SideBar/SideBar";
import NavbarTopShelter from "../ShelterComponents/NavbarTopShelter";
import {AppContainer} from "../Navbar/style";
import ShelterFooter from "../Background/ShelterFooter";
import {Box, AppBar, Typography, Grid, Card, CardContent, Button, Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaPaw, FaBoxes, FaCalendarAlt, FaUsers, FaSign, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";


const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-5px)",
    }
}));

const NavigationButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(3),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    fontSize: "1.1rem",
    textTransform: "none",
}));

const IconWrapper = styled(Box)({
    fontSize: "2rem"
});

const MainPageSessionShelter = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/signin";
        }
    }, []);

    const navigationItems = [
        { icon: <FaUsers />, title: "Zarządzanie adopcjami", path: "/ManageAdoption" },
        { icon: <FaBoxes />, title: "Zarządzanie zamówieniami",path: "/Orders"},
        { icon: <FaCalendarAlt />, title: "Zarządzanie zbiórkami",path: "/ManageCampaigns"},
        { icon: <FaCog />, title: "Ustawienia",path: "/MyAccountShelter"},
        { icon: <FaPaw />, title: "Zarządzanie zwierzętami" ,path: "/ManageAnimals"},
        { icon: <FaSign />, title: "Zarządzanie tablica ogłoszeń" ,path: "/ManageNews"},
    ];

    return (
        <AppContainer>
            <NavbarTopShelter />
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <Box sx={{ flexGrow: 2 }}>
                <AppBar position="static" >
                </AppBar>
                <Grid container spacing={3} sx={{ py: 6 }}>
                    {navigationItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Tooltip title={item.description || item.title} arrow placement="top">
                                <StyledCard>
                                    <CardContent>
                                        <NavigationButton
                                            fullWidth
                                            aria-label={item.title}
                                            role="button"
                                            component={Link}
                                            to={item.path}
                                        >
                                            <IconWrapper>{item.icon}</IconWrapper>
                                            <Typography variant="h6" component="div">
                                                {item.title}
                                            </Typography>
                                        </NavigationButton>
                                    </CardContent>
                                </StyledCard>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <ShelterFooter/>
        </AppContainer>
    );
};

export default MainPageSessionShelter;
