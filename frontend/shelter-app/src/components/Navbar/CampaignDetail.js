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
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Dialog,
    LinearProgress,
} from "@mui/material";
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import { AppContainer, CollectionImage, Footer, FooterText } from "./style";
import logo from "./logo.png";

const CampaignDetail = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [donationAmount, setDonationAmount] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        fetchCampaignData();
    }, [id]);

    const fetchCampaignData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/campaigns/${id}`);
            setCampaign(response.data);
        } catch (error) {
            console.error("Błąd przy pobieraniu danych kampanii:", error);
        }
    };

    const handlePayment = () => {
        setOpenPaymentDialog(true);
    };

    const handleDonationSubmit = async () => {
        try {
            const amount = parseInt(donationAmount);
            if (isNaN(amount) || amount <= 0) {
                alert("Proszę podać poprawną kwotę wpłaty.");
                return;
            }

            await axios.post(`http://localhost:8080/campaigns/${id}/donate`, {
                amount,
            });

            setOpenPaymentDialog(false);
            setDonationAmount(""); // wyczyść pole kwoty
            fetchCampaignData(); // odśwież dane kampanii po aktualizacji
        } catch (error) {
            console.error("Błąd przy wpłacaniu:", error);
            alert("Nie udało się zaktualizować wpłaty.");
        }
    };

    if (!campaign) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const progressPercentage = ((campaign.progress / campaign.goal) * 100).toFixed(2);

    return (
        <AppContainer>
            <NavbarTopLoginSession />
            <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    mb: 2,
                    marginTop: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#f9f9f9",
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {campaign.name}
            </Typography>
            <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <CollectionImage src={logo} alt={campaign.title} />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1, display: "flex", justifyContent: "center"}}>
                                Zebrano {campaign.progress} z {campaign.goal} ({progressPercentage}%)
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={parseFloat(progressPercentage)}
                                sx={{height: 30, borderRadius: 5 }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Informacje o kampanii
                            </Typography>
                            <Typography variant="body1">
                                <strong>Data rozpoczęcia:</strong> {campaign.start_date}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Data zakończenia:</strong> {campaign.end_date}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Cel:</strong> {parseInt(campaign.goal)}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Uzbierano:</strong> {parseInt(campaign.progress)}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Progres:</strong> {progressPercentage}%
                            </Typography>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Schronisko
                            </Typography>
                            <Typography variant="body1"><strong>Nazwa:</strong> {campaign.shelter.name}</Typography>
                            <Typography variant="body1"><strong>Adres:</strong> {campaign.shelter.address} {campaign.shelter.commune}, {campaign.shelter.town}</Typography>
                            <Typography variant="body1"><strong>Województwo:</strong> {campaign.shelter.voivodeship}</Typography>
                            <Typography variant="body1"><strong>Kod pocztowy:</strong> {campaign.shelter.post_code}</Typography>

                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Opis
                            </Typography>
                            <Typography variant="body1"><strong>Opis:</strong> {campaign.description}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {isLoggedIn ? (
                <Box sx={{ mt: 4, mb: 7, display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handlePayment()}
                        sx={{ px: 4, py: 1.5, fontWeight: "bold", boxShadow: 2 }}
                    >
                        Wpłać
                    </Button>
                </Box>
            ) : (
                <Box sx={{ mt: 4, mb: 8, display: "flex", justifyContent: "center", gap: 2 }}/>
            )}


            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
                <DialogTitle>Wpłać</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Kwota"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPaymentDialog(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleDonationSubmit} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer>
                <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </AppContainer>
    );
};

export default CampaignDetail;
