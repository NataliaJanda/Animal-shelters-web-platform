import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Grid,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import {AppContainer, Footer, FooterText} from "../Navbar/style";
import NavbarTopShelter from "./NavbarTopShelter";

const MyAccountShelter = () => {
    const [userData, setUserData] = useState({});
    const [shelterData, setShelterData] = useState({});
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [editShelterData, setEditShelterData] = useState({});

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

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};
                const response = await axios.get(
                    `http://localhost:8080/shelterAccounts/${shelterId}`,
                    config
                );

                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu danych użytkownika:", error);
                setLoading(false);
            }
        };

        fetchUser();
    }, [shelterId]);

    useEffect(() => {
        if (shelterId === null) return;

        const fetchShelter = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};
                const response = await axios.get(
                    `http://localhost:8080/shelter/${shelterId}`,
                    config
                );

                setShelterData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu danych schroniska:", error);
                setLoading(false);
            }
        };

        fetchShelter();
    }, [shelterId]);

    const handleEdit = () => {
        setEditData(userData);
        setEditShelterData(shelterData)
        setEditMode(true);
    };


    const handleSave = async () => {
        const requiredFields = [
            { field: editData.name, fieldName: "Imię" },
            { field: editData.last_name, fieldName: "Nazwisko" },
            { field: editData.username, fieldName: "Nazwa użytkownika" },
            { field: editData.email, fieldName: "Email" },
            { field: editShelterData.name, fieldName: "Nazwa schroniska" },
            { field: editShelterData.address, fieldName: "Adres" },
            { field: editShelterData.commune, fieldName: "Numer lokalu" },
            { field: editShelterData.post_code, fieldName: "Kod pocztowy" },
            { field: editShelterData.town, fieldName: "Miasto" },
            { field: editShelterData.voivodeship, fieldName: "Województwo" }
        ];

        const emptyFields = requiredFields.filter(field => !field.field);

        if (emptyFields.length > 0) {
            alert("Proszę wypełnić wszystkie wymagane pola: " + emptyFields.map(f => f.fieldName).join(", "));
            return;
        }

        if (editData.password && editData.password !== editData.confirmPassword) {
            alert("Hasła nie są takie same.");
            return;
        }



        try {
            const token = localStorage.getItem("token");
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            await axios.put(`http://localhost:8080/shelterAccounts/edit/${shelterId}`, editData, config);
            await axios.put(`http://localhost:8080/shelter/edit/${shelterId}`, editShelterData, config);


            setUserData(editData);
            setShelterData(editShelterData);
            setEditMode(false);
        } catch (error) {
            console.error("Błąd przy edytowaniu danych użytkownika:", error);
        }
    };


    const handleDelete = async () => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć swoje konto?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            await axios.delete(`http://localhost:8080/shelterAccounts/delete/${shelterId}`, config);
            await axios.delete(`http://localhost:8080/shelter/delete/${shelterId}`, config)

            alert("Konto zostało usunięte.");
            setUserData(userData.filter(userData => userData.id !== shelterId));
            localStorage.clear();
            window.location.reload();
        } catch (error) {
            console.error("Błąd przy usuwaniu konta:", error);
        }
    };

    if (loading) {
        return (
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    return (
        <>
            <NavbarTopShelter />

            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Moje Konto
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Poniżej znajdziesz swoje dane użytkownika.
                </Typography>

                <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Nazwa użytkownika:</strong> {userData.username}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Imię:</strong> {userData.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Nazwisko:</strong> {userData.last_name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Email:</strong> {userData.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Nazwa schroniska:</strong> {shelterData.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Adres</strong> {shelterData.address}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Numer lokalu</strong> {shelterData.commune}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Kod pocztowy</strong> {shelterData.post_code}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Miasto</strong> {shelterData.town}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Województwo</strong> {shelterData.voivodeship}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Konto wygasło:</strong> {userData.expired ? "Tak" : "Nie"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Konto zablokowane:</strong>{" "}
                                {userData.accountNonLocked ? "Nie" : "Tak"}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Button variant="contained" color="primary" sx={{ mt: 3, mr: 2 }} onClick={handleEdit}>
                        Edytuj dane
                    </Button>
                    <Button variant="contained" color="error" sx={{ mt: 3 }} onClick={handleDelete}>
                        Usuń konto
                    </Button>
                </Paper>
            </Container>

            <Dialog open={editMode} onClose={() => setEditMode(false)}>
                <DialogTitle>Edytuj dane użytkownika</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Imię"
                        fullWidth
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nazwisko"
                        fullWidth
                        value={editData.last_name || ""}
                        onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nazwa użytkownika"
                        fullWidth
                        value={editData.username || ""}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={editData.email || ""}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nazwa schroniska"
                        fullWidth
                        value={editShelterData.name || ""}
                        onChange={(e) => setEditShelterData({ ...editShelterData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Adres"
                        fullWidth
                        value={editShelterData.address || ""}
                        onChange={(e) => setEditShelterData({ ...editShelterData, address: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Numer lokalu"
                        fullWidth
                        value={editShelterData.commune || ""}
                        onChange={(e) => setEditShelterData({ ...editShelterData, commune: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Kod pocztowy"
                        fullWidth
                        value={editShelterData.post_code || ""}
                        onChange={(e) => setEditShelterData({ ...editShelterData, post_code: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Miasto"
                        fullWidth
                        value={editShelterData.town || ""}
                        onChange={(e) => setEditShelterData({ ...editShelterData, town: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Województwo"
                        fullWidth
                        value={editShelterData.voivodeship || ""}
                        onChange={(e) => setEditShelterData({ ...editShelterData, voivodeship: e.target.value })}
                    />
                    <>W celu potwierdzenia danych podaj 2 razy hasło
                    </>
                    <TextField
                        margin="dense"
                        label="Nowe hasło"
                        type="password"
                        fullWidth
                        value={editData.password || ""}
                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Potwierdź nowe hasło"
                        type="password"
                        fullWidth
                        value={editData.confirmPassword || ""}
                        onChange={(e) => setEditData({ ...editData, confirmPassword: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditMode(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>

            <AppContainer>
                <div></div>
                <Footer>
                    <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
                </Footer>
            </AppContainer>
        </>
    );
};

export default MyAccountShelter;
