import React, { useState, useEffect } from 'react';
import {
    AppContainer,
} from "../../Navbar/style";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Paper
} from '@mui/material';
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";

function ArchiveOrders() {
    const [shelterId, setShelterId] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    // const [UserRole, setUserRole] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("shelterId");
        if (id) {
            setShelterId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }

        // const role = localStorage.getItem("role")
        //
        // if (role === "SHELTER") {
        //     setUserRole(true)
        // } else {setUserRole(false)}

    }, []);
    useEffect(() => {
        if (shelterId === null) return;

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/orders/shelter/${shelterId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                const filteredOrders = data.filter(order => order.active === false);
                setActiveOrders(filteredOrders);

                if (Array.isArray(filteredOrders)) {
                    setActiveOrders(filteredOrders);
                } else {
                    console.error("API zwróciło dane, które nie są tablicą:", data);
                    setActiveOrders([]);
                }


            } catch (error) {
                console.error("Network error:", error);
            }
        };

        fetchOrders();
    }, [shelterId]);


    return (
        <>
            <AppContainer>
                <NavbarTopShelter />
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Lista zamówień
                    </Typography>
                    {/*<Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3, marginRight: 2 }}>*/}
                    {/*    Dodaj zamówienie*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary" onClick={() => navigate("/ListPublicOrder")} sx={{ mb: 3, marginRight: 2 }}>*/}
                    {/*    Wspólne zamówienia*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" color="primary"  sx={{ mb: 3}}>*/}
                    {/*    Zarchiwizowane zamówienie*/}
                    {/*</Button>*/}
                </Box>

                <TableContainer component={Paper} sx={{mb:66}} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nazwa</TableCell>
                                <TableCell>Ilość</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Informacje</TableCell>
                                <TableCell>Publiczne zamówienie</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(activeOrders) && activeOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.count}</TableCell>
                                    <TableCell sx={{maxWidth: 600, wordBreak: "break-all" }}>
                                        <a href={order.link} target="_blank" rel="noopener noreferrer">
                                            {order.link}
                                        </a>
                                    </TableCell>
                                    <TableCell>{order.info}</TableCell>
                                    <TableCell>{order.ispublic.toString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ShelterFooter/>
            </AppContainer>
        </>
    );
}

export default ArchiveOrders;
