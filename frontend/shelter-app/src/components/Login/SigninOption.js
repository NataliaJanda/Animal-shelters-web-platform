import "./Login.css";
// import React, { useState } from "react";
import { Box, Button, Container,Typography } from "@mui/material";
import BackgroundImage from "./piesek2.png";
import NavbarTop from "../Navbar/NavbarTop";

function SigninOption() {
    const handleSubmit = async (e) => {
        e.preventDefault();

    };
    return (
        <>
            <NavbarTop/>
            <Box
                sx={{
                    height: '100vh',
                    width: '95vw',
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url(${BackgroundImage})`,
                    backgroundSize: '130vh 100vh',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", mt: 5}}>
                        <Typography variant="h4" gutterBottom>
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2
                        }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={() => { window.location.href = "/signin"; }}
                                sx={{mt: 3,width: "calc(160px + 10vw)",
                                    height: "calc(100px + 5vh)", align:"center"
                                }}
                            > Logowanie dla użytkowników
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={() => { window.location.href = "/signin-shelter"; }}
                                sx={{ mt: 3,width: "calc(160px + 10vw)",
                                    height: "calc(100px + 5vh)", align:"center" }}
                            > Logowanie dla schronisk
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
        </>
    );
}

export default SigninOption;
