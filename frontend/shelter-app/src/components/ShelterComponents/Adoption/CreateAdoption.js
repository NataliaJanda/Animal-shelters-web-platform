import React, { useState, useEffect } from "react";
import { Button, Container, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import axios from 'axios';
import ShelterFooter from "../../Background/ShelterFooter";

function CreateAdoption() {
    const [animal_id, setAnimal] = useState("");
    const [animalsList, setAnimalsList] = useState([]);
    const [shelterId, setShelterId] = useState(null);
    const [UserRole, setUserRole] = useState(true);

    const clearForm = () => {
        setAnimal("");
    };

    useEffect(() => {
        const id = localStorage.getItem('shelterId');
        if (id) {
            setShelterId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }

        const role = localStorage.getItem("role")
        if (role === "SHELTER") {
            setUserRole(true);
        } else {
            setUserRole(false);
        }
    }, []);

    useEffect(() => {
        if (shelterId === null) return;

        const fetchSpecies = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(`http://localhost:8080/animal/shelter/${shelterId}`, config);

                if (Array.isArray(response.data)) {
                    setAnimalsList(response.data);
                } else {
                    console.error("Nieoczekiwany format danych:", response.data);
                    setAnimalsList([]);
                }
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
                setAnimalsList([]);
            }
        };

        fetchSpecies();
    }, [shelterId]);


    const handleAddAdoption = async (e) => {
        e.preventDefault();
        if (!animal_id) {
            alert("Wybierz zwierzę przed dodaniem adopcji.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            await axios.put(`http://localhost:8080/animal/admin/setAvailable/${animal_id}`, null, config);

            alert('Zwierzę zostało oznaczone jako dostępne do adopcji!');
            clearForm();
        } catch (error) {
            console.error("Błąd przy oznaczaniu zwierzęcia jako dostępne:", error);
            alert('Wystąpił błąd przy oznaczaniu zwierzęcia jako dostępne.');
        }
    };

    if (UserRole === false) {
        window.location.href = ("/signin");
    }

    return (
        <>
            <NavbarTopShelter />
            <Box
                sx={{
                    height: '100vh',
                    width: '95vw',
                    backgroundPosition: 'left',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    display: 'inline-flex',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Stwórz adopcję
                        </Typography>
                    </Box>

                    <form onSubmit={handleAddAdoption} noValidate>
                        <Box sx={{ mt: 3 }}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="animal-label">Wybierz zwierzę</InputLabel>
                                <Select
                                    labelId="animal-label"
                                    id="animal"
                                    value={animal_id}
                                    label="Wybierz zwierzę"
                                    onChange={(e) => setAnimal(e.target.value)}
                                >
                                    {Array.isArray(animalsList) && animalsList.length > 0 ? (
                                        animalsList.map((animal) => (
                                            <MenuItem key={animal.id} value={animal.id}>
                                                {animal.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Brak dostępnych zwierząt</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ mt: 3 }}
                            >
                                Dodaj
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
            <ShelterFooter />
        </>
    );
}

export default CreateAdoption;
