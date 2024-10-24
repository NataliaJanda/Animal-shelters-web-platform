import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopShelter from "../NavbarTopShelter";
import {
    AppContainer,
    ContentSection,
    Footer,
    FooterText,
    SectionText,
    SectionTitle,
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
import logo from "../../Navbar/logo.png";

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [editingNews, setEditingNews] = useState(null);
    const [updatedNews, setUpdatedNews] = useState({});
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        const id = localStorage.getItem('shelterId');
        if (id) {
            setShelterId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }
    }, []);

    useEffect(() => {
        if (shelterId === null) return;

        const fetchNews = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(`http://localhost:8080/news/shelter/${shelterId}`, config);

                if (Array.isArray(response.data)) {
                    setNews(response.data);
                } else {
                    setNews([]);
                }
                setLoading(false);

            } catch (error) {
                console.error("Błąd przy pobieraniu ogłoszeń:", error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [shelterId]);

    const deleteNews = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            await axios.delete(`http://localhost:8080/news/admin/delete/${id}`, config);
            setNews(news.filter(newsItem => newsItem.id !== id));
        } catch (error) {
            console.error("Błąd przy usuwaniu ogłoszenia:", error);
        }
    };

    const editNews = (newsItem) => {
        setEditingNews(newsItem);
        setUpdatedNews(newsItem);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                : { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.put(`http://localhost:8080/news/admin/edit/${id}`, updatedNews, config);
            setNews(news.map(item => (item.id === id ? response.data : item)));
            setOpenEditDialog(false);
        } catch (error) {
            console.error("Błąd przy edytowaniu ogłoszenia:", error);
        }
    };

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Aktywne Ogłoszenia</SectionTitle>
                <SectionText>
                    Poniżej znajdziesz listę aktualnych ogłoszeń, które prowadzimy.
                </SectionText>
            </ContentSection>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Logo</TableCell>
                            <TableCell>Tytuł</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Schronisko</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {news.map((newsItem) => {
                            const shelter = newsItem.shelter || {};
                            return (
                                <TableRow key={newsItem.id}>
                                    <TableCell>
                                        <img
                                            src={logo || "https://via.placeholder.com/80"}
                                            alt={newsItem.title}
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        />
                                    </TableCell>
                                    <TableCell>{newsItem.title}</TableCell>
                                    <TableCell>{newsItem.description}</TableCell>
                                    <TableCell>{shelter.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => editNews(newsItem)}
                                            style={{ marginRight: "8px" }}
                                        >
                                            Edytuj
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => deleteNews(newsItem.id)}
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

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edytuj ogłoszenie</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tytuł"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedNews.title || ""}
                        onChange={(e) => setUpdatedNews({ ...updatedNews, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Opis"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedNews.description || ""}
                        onChange={(e) => setUpdatedNews({ ...updatedNews, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={() => handleEditSubmit(editingNews.id)} color="primary">
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

export default ManageNews;
