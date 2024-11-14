import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Snackbar } from "@mui/material";
import BackgroundImage from "../SignUp/kot2.png";
import Alert from '@mui/material/Alert';
import NavbarTopUnllogin from "../Navbar/NavbarTopUnllogin";
import {AppContainer} from "../Navbar/style";

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
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    const [password, setPassword] = useState({
        value: "",
        isTouched: false,
    });

    const getIsFormValid = () => {
        return (
            username && firstName && lastName && validateEmail(email) && phoneNumber &&
            address && commune && postCode && town && county &&
            realEstateNumber && regon && voivodeship && password.value.length >= 8
        );
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
        setPassword({ value: "", isTouched: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!getIsFormValid()) {
            setError("Proszę uzupełnić wszystkie wymagane pola.");
            setAlertOpen(true);
            return;
        }

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
            voivodeship,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/signup-shelter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 400) {
                setError("Niepoprawne dane: sprawdź REGON lub uzupełnij wszystkie wymagane pola.");
                setSuccess(null);
            } else if (response.ok) {
                setSuccess("Rejestracja przebiegła pomyślnie!");
                setError(null);
                clearForm();
                navigate("/ShelterRegisterAccept");
            } else {
                setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.");
                setSuccess(null);
            }
            setAlertOpen(true);

        } catch (error) {
            console.error("Error during registration:", error);
            setError("Wystąpił problem z połączeniem. Spróbuj ponownie później.");
            setSuccess(null);
            setAlertOpen(true);
        }
    };

    return (
        <AppContainer>
            <NavbarTopUnllogin/>
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
                            Zarejestruj swoje schronisko
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3 , mb:10 }}>
                            <TextField sx={{mb :1}} fullWidth label="Pełna nazwa" value={username} onChange={(e) => setUsername(e.target.value)} error={!username && !!error}
                                       helperText={!username && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Imię" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={!firstName && !!error}
                                       helperText={!firstName && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Nazwisko" value={lastName} onChange={(e) => setLastName(e.target.value)} error={!lastName && !!error}
                                       helperText={!lastName && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Adres email" value={email} onChange={(e) => setEmail(e.target.value)} error={!email && !!error}
                                       helperText={!email && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Numer telefonu" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} error={!phoneNumber && !!error}
                                       helperText={!phoneNumber && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Adres" value={address} onChange={(e) => setAddress(e.target.value)} error={!address && !!error}
                                       helperText={!address && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Adres" value={commune} onChange={(e) => setCommune(e.target.value)} error={!commune && !!error}
                                       helperText={!commune && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Kod pocztowy" value={postCode} onChange={(e) => setPostCode(e.target.value)} error={!postCode && !!error}
                                       helperText={!postCode && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Miasto" value={town} onChange={(e) => setTown(e.target.value)} error={!town && !!error}
                                       helperText={!town && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Powiat" value={county} onChange={(e) => setCounty(e.target.value)} error={!county && !!error}
                                       helperText={!county && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Województwo" value={voivodeship} onChange={(e) => setVoivodeship(e.target.value)} error={!voivodeship && !!error}
                                       helperText={!voivodeship && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Numer REGON" value={regon} onChange={(e) => setRegon(e.target.value)} error={!regon && !!error}
                                       helperText={!regon && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField sx={{mb :1}} fullWidth label="Numer NIP" value={realEstateNumber} onChange={(e) => setRealEstateNumber(e.target.value)} error={!realEstateNumber && !!error}
                                       helperText={!realEstateNumber && !!error ? "To pole jest wymagane" : ""}/>
                            <TextField
                                fullWidth
                                label="Hasło"
                                type="password"
                                value={password.value}
                                onChange={(e) => setPassword({ ...password, value: e.target.value })}
                                onBlur={() => setPassword({ ...password, isTouched: true })}
                                error={password.isTouched && password.value.length < 8}
                                helperText={password.isTouched && password.value.length < 8 ? "Hasło powinno mieć co najmniej 8 znaków" : ""}
                            />
                            <Button fullWidth variant="contained" color="primary" type="submit" disabled={!getIsFormValid()} sx={{ mt: 3 , mb :6}}>
                                Stwórz konto
                            </Button>
                        </Box>
                    </form>
                </Container>

                <Snackbar
                    open={alertOpen}
                    autoHideDuration={6000}
                    onClose={() => {
                        setAlertOpen(false);
                        setError(null);
                        setSuccess(null);
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => {
                            setAlertOpen(false);
                            setError(null);
                            setSuccess(null);
                        }}
                        severity={error ? "error" : "success"}
                        icon={false}
                    >
                        {error || success}
                    </Alert>
                </Snackbar>
            </Box>
        </AppContainer>
);
}

export default ShelterRegister;
