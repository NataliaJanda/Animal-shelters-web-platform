import React, {useEffect, useState} from "react";
import {
    Box, Button, Container, TextField, Typography, RadioGroup, FormControlLabel, Radio, Snackbar, Divider
} from "@mui/material";
import BackgroundImage from "./lapy.jpg";
import NavbarTopUnllogin from "../Navbar/NavbarTopUnllogin";
import ShelterFooter from "../Background/ShelterFooter";
import Alert from "@mui/material/Alert";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import {Link} from "react-router-dom";
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255,0.2)), url(${BackgroundImage})`,
    backgroundSize: '120vh 90vh',

}));

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("error"); // error, success, info, warning


    const showAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const getIsFormValid = () => {
        return username && password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            username: username,
            password: password,
        };

        const endpoint = role === "user" ? "/auth/login" : "/auth/login-shelter";

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);

                showAlert("Zalogowano pomyślnie", "success");

                if (role === "shelter") {
                    localStorage.setItem('shelterId', data.shelterId);
                    window.location.href = "/MainPageSessionShelter";
                } else {
                    localStorage.setItem('userId', data.userId);
                    window.location.href = "/MainPageSessionUser";
                }
            } else {
                const contentType = response.headers.get("Content-Type");

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    showAlert(`Błąd: ${errorData.message}`, "error");
                } else {
                    const errorText = await response.text();
                    showAlert(`Błąd: ${errorText}`, "error");
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            showAlert("Wystąpił błąd podczas logowania. Spróbuj ponownie.", "error");
        }

    };

    const handleOAuth2LoginSuccess = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const role = urlParams.get("role");
        const userId = urlParams.get("userId");

        if (token && role && userId) {
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);

            showAlert("Zalogowano pomyślnie przez OAuth2", "success");

            window.location.href = "/MainPageSessionUser";
        } else {
            showAlert("Nie udało się uzyskać danych logowania OAuth2", "error");
        }
    };



    useEffect(() => {
        handleOAuth2LoginSuccess();
    }, []);

    return (
        <>
            <NavbarTopUnllogin/>
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Logowanie
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

                            <RadioGroup
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                            >
                                <FormControlLabel value="user" control={<Radio />} label="Zwykły użytkownik" />
                                <FormControlLabel value="shelter" control={<Radio />} label="Schronisko" />
                            </RadioGroup>

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
                        <Divider>
                            <Typography sx={{ color: 'text.secondary' }}>lub</Typography>
                        </Divider>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 , mt:2}}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    window.location.href = "http://localhost:8080/oauth2/authorization/google";
                                }}
                                startIcon={<FaGoogle />}
                            >
                                Zaloguj się z Google
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => alert('Sign in with Facebook')}
                                startIcon={<FaFacebook />}
                            >
                                Zaloguj się z Facebook
                            </Button>
                            <Typography sx={{ textAlign: 'center' }}>
                                Nie masz konta?{' '}
                                <Link
                                    href=""
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Zarejestruj się
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Container>
                </Card>
            </SignUpContainer>
            <ShelterFooter/>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setAlertOpen(false)}
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Login;
