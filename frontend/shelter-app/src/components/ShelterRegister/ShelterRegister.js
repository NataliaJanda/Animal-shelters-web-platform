import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import BackgroundImage from "../SignUp/kot2.png";
import NavbarTop from "../Navbar/NavbarTop";

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        );
};

function ShelterRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [commune, setCommune] = useState("");
    const [postCode, setPostCode] = useState("");
    const [town, setTown] = useState("");
    const [county, setCounty] = useState("");
    const [realEstateNumber, setRealEstateNumber] = useState("");
    const [regon, setRegon] = useState("");
    const [voivodeship, setVoivodeship] = useState("");
    const [password, setPassword] = useState({
        value: "",
        isTouched: false,
    });

    const getIsFormValid = () => {
        return username && validateEmail(email) && password.value.length >= 8;
    };

    const clearForm = () => {
        setUsername("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setAddress("");
        setCommune("");
        setPostCode("");
        setTown("");
        setCounty("");
        setRealEstateNumber("");
        setRegon("");
        setVoivodeship("");
        setPassword({
            value: "",
            isTouched: false,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            email,
            username,
            name: firstName,
            last_name: lastName,
            password: password.value,
            phone_number: phoneNumber,
            address,
            post_code: postCode,
            commune,
            town,
            county,
            real_estate_number: realEstateNumber,
            regon,
            voivodeship
        };

        try {
            const response = await fetch("http://localhost:8080/auth/signup-shelter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                clearForm();
                navigate("/ShelterRegisterAccept");
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
        <>
            <NavbarTop/>
            <Box
                sx={{
                    height: '100vh',
                    width: '95vw',
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url(${BackgroundImage})`,
                    backgroundPosition: 'left',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Zarejestruj się
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Pełna nazwa"
                                variant="outlined"
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Imię"
                                variant="outlined"
                                margin="normal"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Nazwisko"
                                variant="outlined"
                                margin="normal"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Adres email"
                                variant="outlined"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Numer telefonu"
                                variant="outlined"
                                margin="normal"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Adres"
                                variant="outlined"
                                margin="normal"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Kod pocztowy"
                                variant="outlined"
                                margin="normal"
                                value={postCode}
                                onChange={(e) => setPostCode(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Gmina"
                                variant="outlined"
                                margin="normal"
                                value={commune}
                                onChange={(e) => setCommune(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Miasto"
                                variant="outlined"
                                margin="normal"
                                value={town}
                                onChange={(e) => setTown(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Powiat"
                                variant="outlined"
                                margin="normal"
                                value={county}
                                onChange={(e) => setCounty(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Województwo"
                                variant="outlined"
                                margin="normal"
                                value={voivodeship}
                                onChange={(e) => setVoivodeship(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Numer NIP"
                                variant="outlined"
                                margin="normal"
                                value={realEstateNumber}
                                onChange={(e) => setRealEstateNumber(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Numer REGON"
                                variant="outlined"
                                margin="normal"
                                value={regon}
                                onChange={(e) => setRegon(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Hasło"
                                variant="outlined"
                                margin="normal"
                                type="password"
                                value={password.value}
                                onChange={(e) => setPassword({ ...password, value: e.target.value })}
                                onBlur={() => setPassword({ ...password, isTouched: true })}
                                error={password.isTouched && password.value.length < 8}
                                helperText={password.isTouched && password.value.length < 8 ? "Password should have at least 8 characters" : ""}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={!getIsFormValid()}
                                sx={{ mt: 3 }}
                            >
                                Stwórz konto
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
        </>
    );
}

export default ShelterRegister;
