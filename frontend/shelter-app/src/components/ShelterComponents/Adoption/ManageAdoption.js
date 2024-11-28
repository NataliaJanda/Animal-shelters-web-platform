import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    ContentSection,
    SectionText,
    SectionTitle,
    AppContainer,
} from "../../Navbar/style";

import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";

const ManageAdoptions = () => {
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});
    const [shelterId, setShelterId] = useState(null);
    const [editingAdoption, setEditingAdoption] = useState(null);
    const [updatedAdoption, setUpdatedAdoption] = useState({});
    const [adoptions, setAdoptions] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [UserRole, setUserRole] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [animalToDelete, setAnimalToDelete] = useState(null);


    useEffect(() => {
        const id = localStorage.getItem("shelterId");
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

        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(`http://localhost:8080/animal/shelter/${shelterId}`, config);

                console.log("Dane adopcji:", response.data);

                const filteredAnimal = response.data.filter(animal => animal.available === true);
                setAdoptions(filteredAnimal);

                filteredAnimal.forEach(adoption => {
                    if (adoption.id) {
                        fetchAnimalPhoto(adoption.id);
                    }
                });

                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu adopcji:", error);
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, [shelterId]);

    const handleDeleteAnimal = async (animalId) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            await axios.put(`http://localhost:8080/adoption/admin/delete/${animalId}`, null, config);
            setAdoptions((prevAdoptions) =>
                prevAdoptions.filter((animal) => animal.id !== animalId)
            );
            alert('Zwierzę zostało oznaczone jako niedostępne!');
        } catch (error) {
            console.error("Błąd przy usuwaniu zwierzęcia:", error);
            alert('Wystąpił błąd przy oznaczaniu zwierzęcia jako niedostępne.');
        }
    };

    const fetchAnimalPhoto = async (animalId) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                responseType: 'blob',
            };

            const response = await axios.get(`http://localhost:8080/animal/photo/${animalId}`, config);

            if (response.status === 200) {
                const imageUrl = URL.createObjectURL(response.data);
                setAnimalPhotos((prevPhotos) => ({
                    ...prevPhotos,
                    [animalId]: imageUrl,
                }));
            } else {
                console.error(`Błąd przy pobieraniu zdjęcia dla zwierzęcia ${animalId}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Błąd przy pobieraniu zdjęcia dla zwierzęcia ${animalId}:`, error);
        }
    };

    const updatedAnimalData = (adoption) => {
        setEditingAdoption(adoption);
        setUpdatedAdoption(adoption);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = async (animalId) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await axios.put(`http://localhost:8080/animal/admin/edit/${animalId}`, updatedAdoption, config);
            const updated = response.data;

            setAdoptions((prevAdoptions) =>
                prevAdoptions.map((animal) =>
                    animal.id === animalId ? updated : animal
                )
            );
            alert('Zwierzę zostało zaktualizowane!');
            setOpenEditDialog(false);
        } catch (error) {
            console.error("Błąd przy edytowaniu zwierzęcia:", error);
            alert('Wystąpił błąd przy edytowaniu zwierzęcia.');
        }
    };

    const handleOpenDeleteDialog = (animalId) => {
        setAnimalToDelete(animalId);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setAnimalToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (animalToDelete) {
            await handleDeleteAnimal(animalToDelete);
            setDeleteDialogOpen(false);
        }
    };


    if(UserRole===false) {
        window.location.href=("/signin")
    }

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <AppContainer>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Adopcje</SectionTitle>
                <SectionText>Przeglądaj dostępne zwierzęta do adopcji z Twojego schroniska.</SectionText>
            </ContentSection>

            <TableContainer sx={{mb:66}} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Zdjęcie</TableCell>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Schronisko</TableCell>
                            <TableCell>Wiek</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adoptions.map((animal) => {
                            const shelter = animal.shelter || {};

                            return (
                                <TableRow key={animal.id}>
                                    <TableCell>
                                        <img
                                            src={animalPhotos[animal.id] || "https://via.placeholder.com/80"}
                                            alt={animal.name || "Brak nazwy"}
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        />
                                    </TableCell>
                                    <TableCell>{animal.name || "Nieznana nazwa"}</TableCell>
                                    <TableCell>{shelter.name || "Nieznane schronisko"}</TableCell>
                                    <TableCell>{animal.age || "Nieznany wiek"} lat</TableCell>
                                    <TableCell>{animal.description || "Brak opisu"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => updatedAnimalData(animal)}
                                        >
                                            Edytuj
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleOpenDeleteDialog(animal.id)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>Czy na pewno chcesz usunąć adopcję?</DialogTitle>
                <DialogContent>
                    <p>Ta operacja oznaczy zwierzę jako niedostępne do adopcji.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Nie
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Tak
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edytuj adopcję</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Opis"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedAdoption.description}
                        onChange={(e) => setUpdatedAdoption({ ...updatedAdoption, description: e.target.value })}
                        multiline
                        rows={10}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={() => handleEditSubmit(editingAdoption.id)} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
            <ShelterFooter/>
        </AppContainer>
    );
};

export default ManageAdoptions;
