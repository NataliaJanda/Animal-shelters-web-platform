import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    AppContainer,
    ContentSection,
    SectionText,
    SectionTitle,
} from "../../Navbar/style";
import NavbarTopShelter from "../NavbarTopShelter";
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
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import ShelterFooter from "../../Background/ShelterFooter";

const ManageAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});
    const [shelterId, setShelterId] = useState(null);
    const [editingAnimal, setEditingAnimal] = useState(null);
    const [updatedAnimal, setUpdatedAnimal] = useState({});
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [filterAnimal, setFilterAnimal] = useState('');
    const [filterSexAnimal, setFilterSexAnimal] = useState('');
    const [filterSizeAnimal, setFilterSizeAnimal] = useState('');
    const [filterTypeAnimal, setFilterTypeAnimal] = useState('');
    const [UserRole, setUserRole] = useState(true);
    const [adoptDialogOpen, setAdoptDialogOpen] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);

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
        fetchAnimals();
    }, [shelterId]);

    const fetchAnimals = async () => {
        if (!shelterId) return;

        try {
            const token = localStorage.getItem("token");
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await axios.get(`http://localhost:8080/animal/shelter/${shelterId}`, config);

            if (Array.isArray(response.data)) {
                setAnimals(response.data);
                response.data.forEach((animal) => fetchAnimalPhoto(animal.id));
            } else {
                console.error("Nieoczekiwany format danych z API:", response.data);
                setAnimals([]);
            }
        } catch (error) {
            console.error("Błąd przy pobieraniu zwierząt:", error);
            setAnimals([]);
        } finally {
            setLoading(false);
        }
    };

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


    const deleteAnimal = async (animalId) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await fetch(`http://localhost:8080/animal/admin/delete/${animalId}`, config);

            if (response.ok) {
                await fetchAnimals();
            } else {
                console.error("Nie udało się usunąć zwierzęcia. Kod odpowiedzi:", response.status);
            }
        } catch (error) {
            console.error("Błąd podczas usuwania zwierzęcia:", error);
        }
    };

    const editAnimal = (animal) => {
        setEditingAnimal(animal);
        setUpdatedAnimal(animal);
        setOpenEditDialog(true);
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
            setOpenEditDialog(false);
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

    if(UserRole===false) {
        window.location.href=("/signin")
    }

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    const handleAdoptClick = (animal) => {
        setSelectedAnimal(animal);
        setAdoptDialogOpen(true);
    };

    const confirmAdoption = async () => {
        if (!selectedAnimal) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:8080/animal/admin/setAvailable/${selectedAnimal.id}`,
                { available: true },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setAnimals((prevAnimals) =>
                    prevAnimals.map((animal) =>
                        animal.id === selectedAnimal.id
                            ? { ...animal, available: true }
                            : animal
                    )
                );
            } else {
                console.error("Nie udało się zaktualizować statusu adopcji.");
            }
        } catch (error) {
            console.error("Błąd podczas zatwierdzania adopcji:", error);
        } finally {
            setAdoptDialogOpen(false);
        }
    };

    const filteredAnimals = Array.isArray(animals)
        ? animals.filter(animal => {
            const matchesRace = filterAnimal === '' || animal.race === filterAnimal;
            const matchesSex = filterSexAnimal === '' || animal.sex === filterSexAnimal;
            const matchesSize = filterSizeAnimal === '' || animal.size === filterSizeAnimal;
            const matchesType = filterTypeAnimal === '' || animal.species.name === filterTypeAnimal;

            return matchesRace && matchesSex && matchesSize && matchesType;
        })
        : [];


    return (
        <AppContainer>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Zwierzęta</SectionTitle>
                <SectionText>Lista zwierząt do zarządzania w schronisku.</SectionText>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="type-select-label">Wybierz typ</InputLabel>
                    <Select
                        labelId="type-select-label"
                        label={"Wybierz typ"}
                        value={filterTypeAnimal}
                        onChange={(e) => setFilterTypeAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie typy</MenuItem>
                        {Array.from(new Set(animals.map(animal => animal.species.name))).map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="race-select-label">Wybierz rasę</InputLabel>
                    <Select
                        labelId="race-select-label"
                        label={"Wybierz rasę"}
                        value={filterAnimal}
                        onChange={(e) => setFilterAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie rasy</MenuItem>
                        {Array.from(new Set(animals.map(animal => animal.race))).map((race) => (
                            <MenuItem key={race} value={race}>{race}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="sex-select-label">Wybierz płeć</InputLabel>
                    <Select
                        labelId="sex-select-label"
                        label={"Wybierz płeć"}
                        value={filterSexAnimal}
                        onChange={(e) => setFilterSexAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie płci</MenuItem>
                        {Array.from(new Set(animals.map(animal => animal.sex))).map((sex) => (
                            <MenuItem key={sex} value={sex}>{sex}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="size-select-label">Wybierz rozmiar</InputLabel>
                    <Select
                        labelId="size-select-label"
                        label={"Wybierz rozmiar"}
                        value={filterSizeAnimal}
                        onChange={(e) => setFilterSizeAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie rozmiary</MenuItem>
                        {Array.from(new Set(animals.map(animal => animal.size))).map((size) => (
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </ContentSection>
                <TableContainer sx={{mb:66}} component={Paper}>
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
                                <TableCell>Typ</TableCell>
                                <TableCell>Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAnimals.map((animal) => (
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
                                    <TableCell>{animal.species.name}</TableCell>
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
                                            onClick={() => handleAdoptClick(animal)}
                                        >
                                            Adoptuj
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

            <Dialog open={adoptDialogOpen} onClose={() => setAdoptDialogOpen(false)}>
                <DialogTitle>Czy na pewno chcesz dodać to zwierzę do adopcji?</DialogTitle>
                <DialogContent>
                    {selectedAnimal && (
                        <p>
                            Zwierzę: <strong>{selectedAnimal.name}</strong>
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAdoptDialogOpen(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={confirmAdoption} color="primary">
                        Zatwierdź
                    </Button>
                </DialogActions>
            </Dialog>;
            <ShelterFooter/>
            </AppContainer>
    );
};

export default ManageAnimals;
