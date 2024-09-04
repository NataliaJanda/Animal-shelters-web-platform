import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

function RegisterAccept() {
    const navigate = useNavigate();

    const [email, setMail] = useState("");
    const [verificationCode, setCode] = useState("");

    const handleLoginRedirect = () => {
        navigate("/signin");
    };

    const getIsFormValid = () => {
        return email && verificationCode;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            email: email,
            verificationCode: verificationCode,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                window.location.href = "/signin";
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred during registration. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
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
                        value={email}
                        onChange={(e) => setMail(e.target.value)}
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
    );
}

export default RegisterAccept;
