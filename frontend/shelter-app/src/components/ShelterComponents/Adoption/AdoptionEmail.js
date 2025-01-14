import React, { useEffect, useState } from "react";
import {
    ContentSection,
    SectionText,
    SectionTitle,
    AppContainer,
} from "../../Navbar/style";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Button,
    Typography,
} from "@mui/material";
import axios from "axios";
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";

const AdoptionEmail = () => {
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [adoptions, setAdoptions] = useState([]);
    const [UserRole, setUserRole] = useState(true);

    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animalLoading, setAnimalLoading] = useState(false);
    const [animalDialogOpen, setAnimalDialogOpen] = useState(false);

    useEffect(() => {
        const id = localStorage.getItem("shelterId");
        if (id) {
            setShelterId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }

        const role = localStorage.getItem("role");
        if (role === "SHELTER") {
            setUserRole(true);
        } else {
            setUserRole(false);
        }
    }, []);

    useEffect(() => {
        if (shelterId === null) return;

        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};
                const response = await axios.get(
                    `http://localhost:8080/adoption/shelter/${shelterId}`,
                    config
                );

                console.log("Dane adopcji:", response.data);

                setAdoptions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu adopcji:", error);
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, [shelterId]);

    const handleAnimalClick = async (animalId) => {
        setAnimalLoading(true);
        setAnimalDialogOpen(true);

        try {
            const response = await axios.get(
                `http://localhost:8080/animal/${animalId}`
            );
            setSelectedAnimal(response.data);
        } catch (error) {
            console.error("Błąd przy pobieraniu danych zwierzęcia:", error);
        } finally {
            setAnimalLoading(false);
        }
    };

    if (UserRole === false) {
        window.location.href = "/signin";
    }

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <AppContainer>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Zgłoszenia adopcyjne</SectionTitle>
                <SectionText>Przeglądaj obecne zgłoszenia adopcyjne.</SectionText>
            </ContentSection>

            <TableContainer sx={{ mb: 66 }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Imie</TableCell>
                            <TableCell>Nazwisko</TableCell>
                            <TableCell>Adres</TableCell>
                            <TableCell>Numer telefonu</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Doświadczenie</TableCell>
                            <TableCell>Id podopiecznego</TableCell>
                            <TableCell>Data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adoptions.length > 0 ? (
                            adoptions.map((animal) => (
                                <TableRow key={animal.id}>
                                    <TableCell>{animal.name}</TableCell>
                                    <TableCell>{animal.last_name} lat</TableCell>
                                    <TableCell>{animal.address}</TableCell>
                                    <TableCell>{animal.phone_number}</TableCell>
                                    <TableCell>{animal.email}</TableCell>
                                    <TableCell>{animal.experience}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="primary"
                                            onClick={() => handleAnimalClick(animal.animal_id)}
                                        >
                                            {animal.animal_id}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{animal.date}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Brak zgłoszeń adopcyjnych.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={animalDialogOpen}
                onClose={() => setAnimalDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Szczegóły zwierzęcia</DialogTitle>
                <DialogContent>
                    {animalLoading ? (
                        <CircularProgress />
                    ) : selectedAnimal ? (
                        <div>
                            <Typography variant="h6">{selectedAnimal.name}</Typography>
                            <Typography>
                                <strong>Wiek:</strong> {selectedAnimal.age} lat
                            </Typography>
                            <Typography>
                                <strong>Płeć:</strong> {selectedAnimal.sex}
                            </Typography>
                            <Typography>
                                <strong>Rasa:</strong> {selectedAnimal.race}
                            </Typography>
                            <Typography>
                                <strong>Rozmiar:</strong> {selectedAnimal.size}
                            </Typography>
                            <Typography>
                                <strong>Szczepienia:</strong>{" "}
                                {selectedAnimal.vaccination ? "Tak" : "Nie"}
                            </Typography>
                            <Typography>
                                <strong>Zachowanie:</strong> {selectedAnimal.atitude}
                            </Typography>
                        </div>
                    ) : (
                        <Typography>Nie znaleziono szczegółów zwierzęcia.</Typography>
                    )}
                </DialogContent>
            </Dialog>

            <ShelterFooter />
        </AppContainer>
    );
};

export default AdoptionEmail;
