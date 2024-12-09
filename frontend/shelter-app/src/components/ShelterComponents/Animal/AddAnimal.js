import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import ShelterFooter from "../../Background/ShelterFooter";

function AddAnimal() {
    const [name, setName] = useState("");
    const [atitude, setAtitude] = useState("");
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [size, setSize] = useState("");
    const [race, setRace] = useState("");
    const [vaccination, setVaccination] = useState("");
    const [sex, setSex] = useState("");
    const [species, setSpecies] = useState("");
    const [speciesList, setSpeciesList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [UserRole, setUserRole] = useState(true);
    const [success, setSuccess] = useState(false);

    const clearForm = () => {
        setName("");
        setAtitude("");
        setAge("");
        setSpecies("");
        setDescription("");
        setSize("");
        setRace("");
        setVaccination("");
        setSex("");
        setSelectedFiles([]);
        setFileNames([]);
    };

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role === "SHELTER") {
            setUserRole(true);
        } else {
            setUserRole(false);
        }

        const fetchSpecies = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get("http://localhost:8080/species", config);
                setSpeciesList(response.data);
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        };

        fetchSpecies();
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const validFileTypes = ['image/jpeg', 'image/png'];
        const validFiles = files.filter(file => validFileTypes.includes(file.type));

        const maxSizeInMB = 20;
        const filteredFiles = validFiles.filter(file => file.size <= maxSizeInMB * 1024 * 1024);

        if (filteredFiles.length !== files.length) {
            alert('Niektóre pliki były nieprawidłowe i zostały pominięte.');
        }

        setSelectedFiles(filteredFiles);
        setFileNames(filteredFiles.map(file => file.name));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            name: name,
            atitude: atitude,
            age: parseInt(age),
            species: parseInt(species),
            description: description,
            size: size,
            race: race,
            sex: sex,
            vaccination: vaccination,
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
                const animal = await response.json();

                for (let file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);

                    await axios.post(`http://localhost:8080/animal/${animal.id}/photo`, formData, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    });
                }

                clearForm();
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during making:", error);
            alert("An error occurred during making campaign. Please try again.");
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
                    display: 'center',
                    mb:10
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Dodaj zwierzę
                        </Typography>
                    </Box>

                    <Collapse in={success}>
                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                            onClose={() => setSuccess(false)}
                        >
                            Zwierzę zostało pomyślnie dodane!
                        </Alert>
                    </Collapse>

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
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="sex-label">Płeć</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    label="Płeć"
                                    margin="normal"
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                >
                                    <MenuItem value="Chłopak">Chłopak</MenuItem>
                                    <MenuItem value="Dziewczyna">Dziewczyna</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="size-label">Rozmiar</InputLabel>
                                <Select
                                    labelId="size-label"
                                    label="Rozmiar"
                                    margin="normal"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                >
                                    <MenuItem value="Mały">Mały</MenuItem>
                                    <MenuItem value="Średni">Średni</MenuItem>
                                    <MenuItem value="Duży">Duży</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label="Rasa"
                                variant="outlined"
                                margin="normal"
                                value={race}
                                onChange={(e) => setRace(e.target.value)}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="vaccination-label">Szczepienia</InputLabel>
                                <Select
                                    labelId="vaccination-label"
                                    label="Szczepienia"
                                    margin="normal"
                                    value={vaccination}
                                    onChange={(e) => setVaccination(e.target.value === "true")}
                                >
                                    <MenuItem value="true">Tak</MenuItem>
                                    <MenuItem value="false">Nie</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label="Opis"
                                variant="outlined"
                                margin="normal"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={6}
                            />
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
                                            {specie.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                >
                                    Wybierz zdjęcia
                                    <input type="file" hidden multiple onChange={handleFileChange} />
                                </Button>
                                {fileNames.length > 0 && (
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        {fileNames.join(", ")}
                                    </Typography>
                                )}
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ mt: 3}}
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

export default AddAnimal;
