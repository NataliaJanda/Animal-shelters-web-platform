import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import background from "./lapy.jpg";
import axios from "axios";
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress,
} from "@mui/material";
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import {AppContainer, Footer, FooterText} from "./style";

const AnimalDetail = () => {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/animal/${id}`);
                setAnimal(response.data);
            } catch (error) {
                console.error("Błąd przy pobieraniu danych zwierzęcia:", error);
            }
        };

        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/animal/photo/list/${id}`);
                setPhotos(response.data);
            } catch (error) {
                console.error("Błąd przy pobieraniu zdjęć zwierzęcia:", error.response ? error.response.data : error.message);
            }
        };


        fetchAnimal();
        fetchPhotos();
    }, [id]);

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    if (!animal) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AppContainer>
            <NavbarTopLoginSession />
            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2, marginTop: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "#f9f9f9",
                    backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center"}}
            >
                {animal.name}
            </Typography>
            <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4, p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        {photos && photos.length > 0 ? (
                            <>
                                <Box
                                    component="img"
                                    src={`data:image/jpeg;base64,${photos[currentPhotoIndex]}`}
                                    alt={`${animal.name} zdjęcie ${currentPhotoIndex + 1}`}
                                    sx={{
                                        width: "90%",
                                        height: "600px",
                                        objectFit: "cover",
                                        borderRadius: 10,
                                        mb: 3,
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    }}
                                />
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                                    <Button variant="contained" onClick={handlePrevPhoto}>
                                        Poprzednie
                                    </Button>
                                    <Button variant="contained" onClick={handleNextPhoto}>
                                        Następne
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Typography variant="body1" align="center">
                                Brak zdjęć do wyświetlenia.
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Informacje o zwierzęciu
                            </Typography>
                            <Typography variant="body1"><strong>Wiek:</strong> {animal.age} lat</Typography>
                            <Typography variant="body1"><strong>Płeć:</strong> {animal.sex}</Typography>
                            <Typography variant="body1"><strong>Rasa:</strong> {animal.race}</Typography>
                            <Typography variant="body1"><strong>Rozmiar:</strong> {animal.size}</Typography>
                            <Typography variant="body1"><strong>Szczepienia:</strong> {animal.vaccination ? "Tak" : "Nie"}</Typography>
                            <Typography variant="body1"><strong>Zachowanie:</strong> {animal.atitude}</Typography>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Schronisko
                            </Typography>
                            <Typography variant="body1"><strong>Nazwa:</strong> {animal.shelter.name}</Typography>
                            <Typography variant="body1"><strong>Adres:</strong> {animal.shelter.address} {animal.shelter.commune}, {animal.shelter.town}</Typography>
                            <Typography variant="body1"><strong>Województwo:</strong> {animal.shelter.voivodeship}</Typography>
                            <Typography variant="body1"><strong>Kod pocztowy:</strong> {animal.shelter.post_code}</Typography>

                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Opis
                            </Typography>
                            <Typography variant="body1"><strong>Opis:</strong> {animal.description}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 4,mb:7, display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => alert("Adoptowano!")}
                    sx={{ px: 4, py: 1.5, fontWeight: "bold", boxShadow: 2 }}
                >
                    Adoptuj
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => alert("Adoptowano wirtualnie!")}
                    sx={{ px: 4, py: 1.5, fontWeight: "bold", boxShadow: 2 }}
                >
                    Adoptuj wirtualnie
                </Button>
            </Box>
            <Footer>
                <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </AppContainer>
    );
};

export default AnimalDetail;
