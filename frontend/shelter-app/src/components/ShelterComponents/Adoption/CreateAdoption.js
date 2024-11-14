import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import axios from 'axios';
import ShelterFooter from "../../Background/ShelterFooter";

function CreateAdoption() {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [animal_id, setAnimal] = useState("");
    const [animalsList, setAnimalsList] = useState([]);
    const [shelterId, setShelterId] = useState(null);
    const [UserRole, setUserRole] = useState(true);

    const clearForm = () => {
        setDescription("");
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
            setUserRole(true)
        } else {setUserRole(false)}
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
                setAnimalsList(response.data);
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        };

        fetchSpecies();
    }, [shelterId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            description: description,
            animal_id: parseInt(animal_id),
        };

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Nie jesteś zalogowany. Proszę się zalogować.");
                return;
            }

            const response = await fetch("http://localhost:8080/adoption/admin/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                clearForm();
                navigate("/MainPageSessionShelter");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during making:", error);
            alert("An error occurred during making campaign. Please try again.");
        }
    };

    if(UserRole===false) {
        window.location.href=("/signin")
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
                            Stwórz adopcje
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Opis"
                                variant="outlined"
                                margin="normal"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {/* Species Select Dropdown */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="animal-label">Wybierz zwierzę</InputLabel>
                                <Select
                                    labelId="animal-label"
                                    id="animal"
                                    value={animal_id}
                                    label="Wybierz zwierzę"
                                    onChange={(e) => setAnimal(e.target.value)}
                                >
                                    {animalsList.map((animal_id) => (
                                        <MenuItem key={animal_id.id} value={animal_id.id}>
                                            {animal_id.name}
                                        </MenuItem>
                                    ))}
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
            <ShelterFooter/>
        </>
    );
}

export default CreateAdoption;
