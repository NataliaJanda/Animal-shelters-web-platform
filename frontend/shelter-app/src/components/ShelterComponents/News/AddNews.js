import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box} from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";
import axios from "axios";

function AddNews() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [UserRole, setUserRole] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem("role")
        if (role === "SHELTER") {
            setUserRole(true)
        } else {setUserRole(false)}
    }, []);

    if(UserRole===false) {
        window.location.href=("/signin")
    }

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setSelectedFile(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validFileTypes = ['image/jpeg', 'image/png'];
        const maxSizeInMB = 5;

        if (!file) {
            alert('Proszę wybrać plik.');
            return;
        }

        if (!validFileTypes.includes(file.type)) {
            alert('Proszę wybrać plik JPG lub PNG.');
            setSelectedFile(null);
            return;
        }

        if (file.size > maxSizeInMB * 1024 * 1024) {
            alert('Plik jest za duży. Maksymalny rozmiar to 5MB.');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Nie jesteś zalogowany. Proszę się zalogować.");
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await axios.post("http://localhost:8080/news/admin/add", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                alert("Ogłoszenie zostało dodane!");
                clearForm();
                navigate("/MainPageSessionShelter");
            } else {
                alert(`Error: ${response.data}`);
            }
        } catch (error) {
            console.error("Error during making:", error);
            alert("Wystąpił błąd podczas dodawania ogłoszenia.");
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
                                multiline
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ mt: 2 }}
                            >
                                Wybierz zdjęcie
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
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

export default AddNews;
