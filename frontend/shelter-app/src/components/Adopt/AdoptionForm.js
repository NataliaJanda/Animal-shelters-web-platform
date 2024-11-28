import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Dialog, DialogActions, DialogTitle
} from '@mui/material';
import { FaPaw } from "react-icons/fa";
import axios from 'axios';

function AdoptionForm({ animalId }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [experience, setExperience] = useState('');
    const [shelterEmail, setShelterEmail] = useState('');
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

    useEffect(() => {
        const fetchShelterEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/shelter/animal/${animalId}/email`);
                setShelterEmail(response.data);
                console.log("Fetched Shelter Email:", response.data); // Sprawdź wynik
            } catch (error) {
                console.error("Błąd przy pobieraniu e-maila schroniska:", error);
            }
        };

        if (animalId) {
            fetchShelterEmail();
        }
        console.log("shelterID", animalId)
    }, [animalId]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const adoptionData = {
            name,
            surname,
            address,
            phoneNumber,
            email,
            experience,
            shelterEmail,
        };

        console.log("Dane wysyłane do backendu:", adoptionData);

        try {
            const response = await axios.post('http://localhost:8080/shelter/send-email', adoptionData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log("Response:", response.data);
            setOpenSuccessDialog(true);
        } catch (error) {
            console.error("Błąd przy wysyłaniu formularza:", error.response?.data || error.message);
            alert('Nie udało się wysłać formularza. Spróbuj ponownie później.');
        }
    };

    return (
        <>
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Formularz adopcyjny
                    </Typography>
                    <Box sx={{ maxWidth: 600, margin: "0 auto" }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Imię"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Nazwisko"
                                fullWidth
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Adres"
                                fullWidth
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Numer telefonu"
                                fullWidth
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Doświadczenie w opiece nad zwierzętami"
                                fullWidth
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                margin="normal"
                                multiline
                                rows={6}
                            />
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<FaPaw />}
                                    sx={{
                                        padding: "12px 40px",
                                        borderRadius: "25px",
                                        textTransform: "none",
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    {"Wyślij formularz"}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>

                <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
                    <DialogTitle>Formularz wysłany pomyślnie!</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpenSuccessDialog(false)} color="primary">
                            Zamknij
                        </Button>
                    </DialogActions>
                </Dialog>
        </>
    );
}

export default AdoptionForm;
