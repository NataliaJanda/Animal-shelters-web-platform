import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    ContentSection, SectionText, SectionTitle, AppContainer,
} from "../../Navbar/style";

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";

const AdoptionEmail = () => {
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [adoptions, setAdoptions] = useState([]);
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

    useEffect(() => {
        if (shelterId === null) return;

        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(`http://localhost:8080/adoption/shelter/${shelterId}`, config);

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
                <SectionTitle>Zgłoszenia adopcyjne</SectionTitle>
                <SectionText>Przeglądaj obecne zgłoszenia adopcyjne.</SectionText>
            </ContentSection>

            <TableContainer sx={{mb:66}} component={Paper}>
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
                        {adoptions.map((animal) => {
                            return (
                                <TableRow key={animal.id}>
                                    <TableCell>{animal.name}</TableCell>
                                    <TableCell>{animal.last_name} lat</TableCell>
                                    <TableCell>{animal.address}</TableCell>
                                    <TableCell>{animal.phone_number}</TableCell>
                                    <TableCell>{animal.email}</TableCell>
                                    <TableCell>{animal.experience}</TableCell>
                                    <TableCell>{animal.animal_id}</TableCell>
                                    <TableCell>{animal.date}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <ShelterFooter/>
        </AppContainer>
    );
};

export default AdoptionEmail;
