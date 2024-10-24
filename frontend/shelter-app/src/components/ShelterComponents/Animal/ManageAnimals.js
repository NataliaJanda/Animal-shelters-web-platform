import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    AppContainer,
    ContentSection,
    Footer,
    FooterText,
    SectionText,
    SectionTitle,
} from "../../Navbar/style";
import NavbarTopShelter from "../NavbarTopShelter";
import { useNavigate } from 'react-router-dom';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

const ManageAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});
    const [shelterId, setShelterId] = useState(null);
    const [editingAnimal, setEditingAnimal] = useState(null);
    const [updatedAnimal, setUpdatedAnimal] = useState({});
    const [openEditDialog, setOpenEditDialog] = useState(false); // State for dialog
    const navigate = useNavigate();


    useEffect(() => {
        const id = localStorage.getItem("shelterId");
        if (id) {
            setShelterId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }
    }, []);

    useEffect(() => {
        if (shelterId === null) return;

        const fetchAnimals = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(
                    `http://localhost:8080/animal/shelter/${shelterId}`,
                    config
                );
                setAnimals(response.data);
                setLoading(false);
                response.data.forEach((animal) => fetchAnimalPhoto(animal.id));
            } catch (error) {
                console.error("Błąd przy pobieraniu zwierząt:", error);
                setLoading(false);
            }
        };

        fetchAnimals();
    }, [shelterId]);

    const fetchAnimalPhoto = async (animalId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Brak tokena autoryzacyjnego. Użytkownik musi się zalogować.");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                responseType: "blob",
            };

            const response = await axios.get(
                `http://localhost:8080/animal/photo/${animalId}`,
                config
            );

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

    const deleteAnimal = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            await axios.delete(`http://localhost:8080/animal/admin/delete/${id}`, config);
            setAnimals(animals.filter((animal) => animal.id !== id));
        } catch (error) {
            console.error("Błąd przy usuwaniu zwierzęcia:", error);
        }
    };

    const editAnimal = (animal) => {
        setEditingAnimal(animal);
        setUpdatedAnimal(animal);
        setOpenEditDialog(true); // Open the edit dialog
    };

    const handleEditSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", updatedAnimal.name);
            formData.append("atitude", updatedAnimal.atitude);
            formData.append("description", updatedAnimal.description);
            formData.append("sex", updatedAnimal.sex);
            formData.append("size", updatedAnimal.size);
            formData.append("race", updatedAnimal.race);
            formData.append("vaccination", updatedAnimal.vaccination);
            formData.append("age", updatedAnimal.age);
            if (updatedAnimal.photo) {
                formData.append("photo", updatedAnimal.photo);
            }

            const response = await axios.put(
                `http://localhost:8080/animal/admin/edit/${editingAnimal.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setAnimals(animals.map((a) => (a.id === editingAnimal.id ? response.data : a)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Błąd przy edytowaniu zwierzęcia:", error);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedAnimal((prevAnimal) => ({
                ...prevAnimal,
                photo: file,
            }));
        }
    };

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Zwierzęta</SectionTitle>
                <SectionText>Lista zwierząt do zarządzania w schronisku.</SectionText>
            </ContentSection>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Zdjęcie</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Wiek</TableCell>
                            <TableCell>Zachowanie</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Płeć</TableCell>
                            <TableCell>Rozmiar</TableCell>
                            <TableCell>Rasa</TableCell>
                            <TableCell>Ważność szczepień</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {animals.map((animal) => (
                            <TableRow key={animal.id}>
                                <TableCell>
                                    <img
                                        src={animalPhotos[animal.id] || "https://via.placeholder.com/100"}
                                        alt={animal.name}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </TableCell>
                                <TableCell>{animal.id}</TableCell>
                                <TableCell>{animal.name}</TableCell>
                                <TableCell>{animal.age}</TableCell>
                                <TableCell>{animal.atitude}</TableCell>
                                <TableCell>{animal.description}</TableCell>
                                <TableCell>{animal.sex}</TableCell>
                                <TableCell>{animal.size}</TableCell>
                                <TableCell>{animal.race}</TableCell>
                                <TableCell>{animal.vaccination ? "Tak" : "Nie"}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => editAnimal(animal)}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Edytuj
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteAnimal(animal.id)}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Usuń
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => navigate("/CreateAdoption")}
                                    >
                                        Adopcja
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edytuj zwierzę</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nazwa"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.name}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Zachowanie"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.atitude}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, atitude: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Opis"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.description}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Płeć"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.sex}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, sex: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Rozmiar"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.size}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, size: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Rasa"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.race}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, race: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Wiek"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.age}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, age: parseInt(e.target.value) })}
                    />
                    <TextField
                        margin="dense"
                        label="Szczepienie"
                        type="checkbox"
                        fullWidth
                        variant="outlined"
                        value={updatedAnimal.vaccination}
                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, vaccination: e.target.checked })}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-photo"
                        type="file"
                        onChange={handlePhotoChange}
                    />
                    <label htmlFor="upload-photo">
                        <Button variant="contained" component="span" style={{ marginTop: '16px' }}>
                            Zmień zdjęcie
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
            <AppContainer>
                <div>

                </div>
                <Footer>
                    <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
                </Footer>
            </AppContainer>
        </>
    );
};

export default ManageAnimals;
