import React, { useState, useEffect } from 'react';
import {
    AppContainer
} from "../../Navbar/style";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";

function OrdersRequest() {
    const [shelterId, setShelterId] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);

    useEffect(() => {
        const id = localStorage.getItem("shelterId");
        if (id) {
            setShelterId(id);
        }
    }, []);

    useEffect(() => {
        if (shelterId === null) return;

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/OrderContributions/shelter/${shelterId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setActiveOrders(data);
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
                        Lista dołączeń</Typography>
                </Box>

                <TableContainer component={Paper} sx={{ mb: 66 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Ilość</TableCell>
                                <TableCell>Wiadomość</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.message}</TableCell>
                                    <TableCell>{order._accept ? "Zaakceptowane" : "Niezaakceptowane"}</TableCell>
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

export default OrdersRequest;
