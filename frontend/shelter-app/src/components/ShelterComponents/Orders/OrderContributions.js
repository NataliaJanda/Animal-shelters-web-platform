import React, { useState, useEffect } from 'react';
import {
    AppContainer
} from "../../Navbar/style";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, Button, DialogTitle, DialogContent, TextField, Dialog, DialogActions
} from '@mui/material';
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";

function OrderContributions() {
    const [publicOrders, setPublicOrders] = useState([]);
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState('');
    const [open, setOpen] = useState(false);

    const fetchPublicOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/orders', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.error("Error fetching public orders:", response.statusText);
                return;
            }

            const data = await response.json();
            const filteredOrders = data.filter(order => order.ispublic === true && order.active === true);
            setPublicOrders(filteredOrders);

        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const handleOpen = (orderId) => {
        setOrderId(orderId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newOrder = {quantity, message, orderId};
        console.log("Submitting order:", newOrder);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/OrderContributions/admin/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newOrder),
            });

            if (!response.ok) {
                console.error("Error creating order:", response.statusText);
                return;
            }

            console.log("Order created successfully");
            setOpen(false);
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    useEffect(() => {
        fetchPublicOrders();
    }, []);

    return (
        <>
            <AppContainer>
                <NavbarTopShelter />
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Publiczne zamówienia
                    </Typography>
                </Box>

                <TableContainer component={Paper} sx={{mb:66}} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nazwa</TableCell>
                                <TableCell>Ilość</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Schronisko</TableCell>
                                <TableCell>Miasto</TableCell>
                                <TableCell>Informacje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {publicOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.count}</TableCell>
                                    <TableCell sx={{maxWidth: 600, wordBreak: "break-all"}}>
                                        <a href={order.link} target="_blank" rel="noopener noreferrer">
                                            {order.link}
                                        </a>
                                    </TableCell>
                                    <TableCell>{order.shelter.name}</TableCell>
                                    <TableCell>{order.shelter.town}</TableCell>
                                    <TableCell>{order.info}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleOpen(order.id)} sx={{ mb: 3 }}>
                                            Dołącz
                                        </Button>
                                        <Dialog open={open} onClose={handleClose}>
                                            <DialogTitle>Dołącz do zamówienia</DialogTitle>
                                            <DialogContent>
                                            <form onSubmit={handleSubmit}>
                                                {/*<TextField*/}
                                                {/*    label="Nazwa schroniska"*/}
                                                {/*    fullWidth*/}
                                                {/*    // value={}*/}
                                                {/*    // onChange={(e) => (e.target.value)}*/}
                                                {/*    margin="normal"*/}
                                                {/*/>*/}
                                                <TextField
                                                    label="Ilość"
                                                    fullWidth
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Wiadmość"
                                                    fullWidth
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    margin="normal"
                                                />
                                                <DialogActions>
                                                    <Button onClick={handleClose} color="secondary">
                                                        Anuluj
                                                    </Button>
                                                    <Button type="submit" color="primary">
                                                        Dołącz
                                                    </Button>
                                                </DialogActions>
                                            </form>
                                        </DialogContent>
                                        </Dialog>
                                    </TableCell>
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

export default OrderContributions;
