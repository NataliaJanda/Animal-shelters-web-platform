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

const ManageCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [updatedCampaign, setUpdatedCampaign] = useState({});
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [UserRole, setUserRole] = useState(true);

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

    if(UserRole===false) {
        window.location.href=("/signin")
    }

    useEffect(() => {
        if (shelterId === null) return;

        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(`http://localhost:8080/campaigns/shelter/${shelterId}`, config);

                if (Array.isArray(response.data)) {
                    setCampaigns(response.data);
                } else {
                    setCampaigns([]);
                }
                setLoading(false);

            } catch (error) {
                console.error("Błąd przy pobieraniu kampanii:", error);
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [shelterId]);

    const deleteCampaign = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            await axios.delete(`http://localhost:8080/campaigns/admin/delete/${id}`, config);
            setCampaigns(campaigns.filter(campaign => campaign.id !== id));
        } catch (error) {
            console.error("Błąd przy usuwaniu kampanii:", error);
        }
    };

    const editCampaign = (campaign) => {
        setEditingCampaign(campaign);
        setUpdatedCampaign(campaign);
        setOpenEditDialog(true); // Open the edit dialog
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const config = token
                ? { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                : { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.put(`http://localhost:8080/campaigns/admin/edit/${id}`, updatedCampaign, config);
            setCampaigns(campaigns.map(c => (c.id === id ? response.data : c)));
            setOpenEditDialog(false); // Close the dialog
        } catch (error) {
            console.error("Błąd przy edytowaniu kampanii:", error);
        }
    };

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Aktywne Zbiórki</SectionTitle>
                <SectionText>
                    Poniżej znajdziesz listę aktualnych zbiórek, które prowadzimy.
                </SectionText>
            </ContentSection>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Logo</TableCell>
                            <TableCell>Tytuł</TableCell>
                            <TableCell>Cel</TableCell>
                            <TableCell>Data zakończenia</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map((campaign) => (
                            <TableRow key={campaign.id}>
                                <TableCell>
                                    <img
                                        src={logo || "https://via.placeholder.com/80"}
                                        alt={campaign.title}
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                </TableCell>
                                <TableCell>{campaign.title}</TableCell>
                                <TableCell>{campaign.goal}</TableCell>
                                <TableCell>{campaign.end_date}</TableCell>
                                <TableCell>{campaign.description}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => editCampaign(campaign)}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Edytuj
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteCampaign(campaign.id)}
                                    >
                                        Usuń
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edytuj kampanię</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cel"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={updatedCampaign.goal || ""}
                        onChange={(e) => setUpdatedCampaign({ ...updatedCampaign, goal: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Opis"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={updatedCampaign.description || ""}
                        onChange={(e) => setUpdatedCampaign({ ...updatedCampaign, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={() => handleEditSubmit(editingCampaign.id)} color="primary">
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

export default ManageCampaigns;
