import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {TextField, Button, Container, Typography, Box, Snackbar} from "@mui/material";
import NavbarTopUnllogin from "../Navbar/NavbarTopUnllogin";
import ShelterFooter from "../Background/ShelterFooter";
import Alert from "@mui/material/Alert";

function ShelterRegisterAccept() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [verificationCode, setCode] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const handleLoginRedirect = () => {
        navigate("/signin-shelter");
    };

    const getIsFormValid = () => {
        return username && verificationCode;
    };

    const ResendCode = async () => {
        if (!username) {
            setAlertMessage("Proszę podać email.");
            setAlertSeverity("warning");
            setAlertOpen(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/auth/resend-shelter?email=${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setAlertMessage("Kod weryfikacyjny został ponownie wysłany!");
                setAlertSeverity("success");
            } else {
                const errorData = await response.json();
                setAlertMessage(errorData.message || "Nie udało się wysłać kodu weryfikacyjnego.");
                setAlertSeverity("error");
            }
        } catch (error) {
            console.error("Błąd podczas ponownego wysyłania kodu:", error);
            setAlertMessage("Wystąpił błąd podczas ponownego wysyłania kodu. Spróbuj ponownie później.");
            setAlertSeverity("error");
        }
        setAlertOpen(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            username: username,
            verificationCode: verificationCode,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/verify-shelter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const contentType = response.headers.get("Content-Type");

            if (response.ok) {
                setAlertMessage("Konto zostało pomyślnie zweryfikowane!");
                setAlertSeverity("success");
                setAlertOpen(true);
                setTimeout(() => {
                    window.location.href = "/signin";
                }, 2000);
            } else if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                setAlertMessage(errorData.message || "Wystąpił problem podczas weryfikacji");
                setAlertSeverity("error");
                setAlertOpen(true);
            } else {
                const errorText = await response.text();
                setAlertMessage(`Błąd: ${errorText}`);
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Błąd podczas weryfikacji:", error);
            setAlertMessage("Wystąpił błąd podczas weryfikacji. Spróbuj ponownie później.");
            setAlertSeverity("error");
            setAlertOpen(true);
        }
    };

    return (
        <>
            <NavbarTopUnllogin />
            <Container maxWidth="sm" sx={{mb:20}}>
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Rejestracja zakończona sukcesem!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Na twojego maila przyszła wiadomość z kodem weryfikacyjnym.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Podaj mail i kod:
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "400px", mx: "auto" }}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ width: "125%" }}
                        />
                        <TextField
                            label="Kod"
                            variant="outlined"
                            margin="normal"
                            value={verificationCode}
                            onChange={(e) => setCode(e.target.value)}
                            sx={{ width: "125%" }}

                        />
                        <Button
                            fullWidth
                            variant="text"
                            onClick={ResendCode}
                            sx={{ mt: 2,width:"125%"}}
                        >
                            Wyślij kod ponownie
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!getIsFormValid()}
                            sx={{ mt: 3, width:"125%" }}
                        >
                            Zweryfikuj
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={handleLoginRedirect}
                            sx={{ mt: 2,width:"125%"}}
                        >
                            Przejdź do logowania
                        </Button>
                    </Box>
                </form>
            </Container>
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

export default ShelterRegisterAccept;
