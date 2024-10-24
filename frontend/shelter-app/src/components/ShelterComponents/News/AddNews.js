import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box,
    // Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import {Footer, FooterText} from "../../Navbar/style";
// import axios from 'axios';

function AddNews() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // const [age, setAge] = useState("");
    // const [species, setSpecies] = useState("");
    // const [speciesList, setSpeciesList] = useState([]);
    // const [selectedFile, setSelectedFile] = useState(null);

    const clearForm = () => {
        setTitle("");
        setDescription("");
        // setAge("");
        // setSpecies("");
        // setSelectedFile(null);
    };

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                // const token = localStorage.getItem('token');
                // const config = token
                //     ? { headers: { Authorization: `Bearer ${token}` } }
                //     : {};
                //
                // const response = await axios.get("http://localhost:8080/species", config);
                // setSpeciesList(response.data); // Populate species options
            } catch (error) {
                console.error("Error fetching species:", error);
            }
        };

        fetchSpecies();
    }, []);

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //
    //     const validFileTypes = ['image/jpeg', 'image/png'];
    //     if (file && !validFileTypes.includes(file.type)) {
    //         alert('Proszę wybrać plik JPG lub PNG.');
    //         setSelectedFile(null);
    //         return;
    //     }
    //
    //     const maxSizeInMB = 20;
    //     if (file && file.size > maxSizeInMB * 1024 * 1024) {
    //         alert('Plik jest za duży. Maksymalny rozmiar to 5MB.');
    //         setSelectedFile(null);
    //         return;
    //     }
    //
    //     setSelectedFile(file);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            title: title,
            description: description,
            // age: parseInt(age),
            // species: parseInt(species),
        };

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Nie jesteś zalogowany. Proszę się zalogować.");
                return;
            }

            const response = await fetch("http://localhost:8080/news/admin/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // const animal = await response.json();

                // if (selectedFile) {
                //     const formData = new FormData();
                //     formData.append('file', selectedFile);
                //
                //     await axios.post(`http://localhost:8080/animal/${animal.id}/photo`, formData, {
                //         headers: {
                //             "Authorization": `Bearer ${token}`,
                //             "Content-Type": "multipart/form-data"
                //         }
                //     });
                // }

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
                            Dodaj ogłoszenie
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Tytuł"
                                variant="outlined"
                                margin="normal"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Opis"
                                variant="outlined"
                                margin="normal"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {/*<TextField*/}
                            {/*    fullWidth*/}
                            {/*    label="Wiek"*/}
                            {/*    variant="outlined"*/}
                            {/*    margin="normal"*/}
                            {/*    value={age}*/}
                            {/*    onChange={(e) => setAge(e.target.value)}*/}
                            {/*/>*/}

                            {/*<FormControl fullWidth margin="normal">*/}
                            {/*    <InputLabel id="species-label">Gatunek</InputLabel>*/}
                            {/*    <Select*/}
                            {/*        labelId="species-label"*/}
                            {/*        id="species"*/}
                            {/*        value={species}*/}
                            {/*        label="Gatunek"*/}
                            {/*        onChange={(e) => setSpecies(e.target.value)}*/}
                            {/*    >*/}
                            {/*        {speciesList.map((specie) => (*/}
                            {/*            <MenuItem key={specie.id} value={specie.id}>*/}
                            {/*                {specie.name}*/}
                            {/*            </MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*</FormControl>*/}

                            {/*<Button*/}
                            {/*    variant="outlined"*/}
                            {/*    component="label"*/}
                            {/*    sx={{ mt: 2 }}*/}
                            {/*>*/}
                            {/*    Wybierz zdjęcie*/}
                            {/*    <input type="file" hidden onChange={handleFileChange} />*/}
                            {/*</Button>*/}

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
            <Footer>
                <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </>
    );
}

export default AddNews;
