import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import axios from 'axios';

function AddAnimal() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [atitude, setAtitude] = useState("");
    const [age, setAge] = useState("");
    const [species, setSpecies] = useState("");
    const [speciesList, setSpeciesList] = useState([]);  // New state for species options

    const clearForm = () => {
        setName("");
        setAtitude("");
        setAge("");
        setSpecies("");
    };

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get("http://localhost:8080/species", config);
                setSpeciesList(response.data); // Populate species options
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        };

        fetchSpecies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            name: name,
            atitude: atitude,
            age: parseInt(age),
            species: parseInt(species),
        };

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Nie jesteś zalogowany. Proszę się zalogować.");
                return;
            }

            const response = await fetch("http://localhost:8080/animal/admin/add", {
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
                            Dodaj zwierzę
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="IMIE"
                                variant="outlined"
                                margin="normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Zachowanie"
                                variant="outlined"
                                margin="normal"
                                value={atitude}
                                onChange={(e) => setAtitude(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Wiek"
                                variant="outlined"
                                margin="normal"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />

                            {/* Species Select Dropdown */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="species-label">Gatunek</InputLabel>
                                <Select
                                    labelId="species-label"
                                    id="species"
                                    value={species}
                                    label="Gatunek"
                                    onChange={(e) => setSpecies(e.target.value)}
                                >
                                    {speciesList.map((specie) => (
                                        <MenuItem key={specie.id} value={specie.id}>
                                            {specie.name}  {/* Display species name */}
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
        </>
    );
}

export default AddAnimal;
