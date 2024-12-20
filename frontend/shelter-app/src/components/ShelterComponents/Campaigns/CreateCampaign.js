import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";


function CreateCampaign() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [goal, setGoal] = useState("");
    const [UserRole, setUserRole] = useState(true);

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setGoal("");
    };

    useEffect(() => {
        const role = localStorage.getItem("role")
        if (role === "SHELTER") {
            setUserRole(true)
        } else {setUserRole(false)}
    }, []);

    if(UserRole===false) {
        window.location.href=("/signin")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestBody = {
            title: title,
            description: description,
            start_date: start_date,
            end_date: end_date,
            goal: goal,
        };

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Nie jesteś zalogowany. Proszę się zalogować.");
                return;
            }

            const response = await fetch("http://localhost:8080/campaigns/admin/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                clearForm();
                navigate("/MainPageSessionShelter");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during making:", error);
            alert("An error occurred during making campaign. Please try again.");
        }
    };

    return (
        <>
            <NavbarTopShelter />
            <Box
                sx={{
                    height: '100vh',
                    width: '95vw',
                    backgroundPosition: 'left',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    display: 'inline-flex',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Dodaj zbiórkę
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                label="Tytuł"
                                variant="outlined"
                                margin="normal"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Opis"
                                variant="outlined"
                                margin="normal"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={5}
                            />
                            <TextField
                                fullWidth
                                label="Data początku"
                                variant="outlined"
                                margin="normal"
                                type="date"
                                value={start_date}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Data zakończenia"
                                variant="outlined"
                                margin="normal"
                                type="date"
                                value={end_date}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Cel"
                                variant="outlined"
                                margin="normal"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ mt: 3 }}
                            >
                                Stwórz
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
            <ShelterFooter/>
        </>
    );
}

export default CreateCampaign;
