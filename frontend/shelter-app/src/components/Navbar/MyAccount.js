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
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import {AppContainer, Footer, FooterText} from "./style";

const MyAccount = () => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [UserRole, setUserRole] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("userId");
        if (id) {
            setUserId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }
        const role = localStorage.getItem("role")
        if (role === "USER") {
            setUserRole(true)
        } else {setUserRole(false)}
    }, []);

    useEffect(() => {
        if (userId === null) return;

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};
                const response = await axios.get(
                    `http://localhost:8080/users/${userId}`,
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
    }, [userId]);

    const handleEdit = () => {
        setEditData(userData);
        setEditMode(true);
    };


    const handleSave = async () => {
        if (editData.password && editData.password !== editData.confirmPassword) {
            alert("Hasła nie są takie same.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            await axios.put(`http://localhost:8080/users/edit/${userId}`, editData, config);

            setUserData(editData);
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
            await axios.delete(`http://localhost:8080/users/delete/${userId}`, config);
            alert("Konto zostało usunięte.");
            setUserData(userData.filter(userData => userData.id !== userId));
            localStorage.clear();
            window.location.reload();
        } catch (error) {
            console.error("Błąd przy usuwaniu konta:", error);
        }
    };

    if(UserRole===false) {
        window.location.href=("/signin")
    }

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
            <NavbarTopLoginSession />

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
                                <strong>ID użytkownika:</strong> {userData.id}
                            </Typography>
                        </Grid>
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
                                <strong>Rola:</strong> {userData.role}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Aktywowany:</strong> {userData.activated ? "Tak" : "Nie"}
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
                        <Grid item xs={12}>
                            <Typography>
                                <strong>Konto włączone:</strong> {userData.enabled ? "Tak" : "Nie"}
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

export default MyAccount;
