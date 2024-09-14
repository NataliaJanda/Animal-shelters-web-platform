import "./Login.css";
import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import BackgroundImage from "./piesek2.png";
import NavbarTop from "../Navbar/NavbarTop";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const getIsFormValid = () => {
        return username && password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role',data.role)
                window.location.href = "/MainPageSessionUser";
            } else {
                const contentType = response.headers.get("Content-Type");

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                } else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        }
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
                            Logowanie dla użytkowników
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Adres email"
                                variant="outlined"
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Hasło"
                                variant="outlined"
                                margin="normal"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={!getIsFormValid()}
                                sx={{ mt: 3 }}
                            >
                                Zaloguj
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
        </>
    );
}

export default Login;
