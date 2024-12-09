import React, { useState, useEffect } from 'react';
import {
    AppContainer
} from "../../Navbar/style";
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper
} from '@mui/material';
import NavbarTopShelter from "../NavbarTopShelter";
import axios from "axios";
import ShelterFooter from "../../Background/ShelterFooter";

function Orders() {
    const [name, setName] = useState('');
    const [count, setCount] = useState(1);
    const [link, setLink] = useState('');
    const [info, setInfo] = useState('');
    const [ispublic, setIsPublic] = useState(true);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [shelterId, setShelterId] = useState(null);
    const [updatedOrder, setUpdatedOrder] = useState({});
    const [editingOrder, setEditingOrder] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const navigate = useNavigate();
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
                const response = await fetch(`http://localhost:8080/orders/shelter/${shelterId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                const filteredOrders = data.filter(order => order.active === true);
                setActiveOrders(filteredOrders);
            } catch (error) {
                console.error("Network error:", error);
            }
        };

        fetchOrders();
    }, [shelterId]);

    const handleBooleanChange = (event) => {
        setIsPublic(event.target.value === 'true');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newOrder = { name, count, link, info, active: true, ispublic };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/orders/admin/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newOrder),
            });

            if (response.ok) {
                const addedOrder = await response.json();

                setActiveOrders((prevOrders) => [...prevOrders, addedOrder]);

                setOpen(false);
                clearForm();
            } else {
                console.error("Error creating order:", response.statusText);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const clearForm = () => {
        setName('');
        setCount(1);
        setLink('');
        setInfo('');
        setIsPublic(true);
    };

    const editOrder = (newsItem) => {
        setEditingOrder(newsItem);
        setUpdatedOrder(newsItem);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                : { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.put(`http://localhost:8080/orders/admin/edit/${id}`, updatedOrder, config);
            setActiveOrders(activeOrders.map(item => (item.id === id ? response.data : item)));
            setOpenEditDialog(false);
        } catch (error) {
            console.error("Błąd przy edytowaniu zamówienia:", error);
        }
    };

    const confirmDeleteOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenDeleteDialog(true);
    };

    const handleDeleteOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/orders/admin/delete/${selectedOrderId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrderId));
            } else {
                console.error("Błąd przy usuwaniu zamówienia:", response.statusText);
            }
        } catch (error) {
            console.error("Błąd sieciowy podczas usuwania zamówienia:", error);
        } finally {
            setOpenDeleteDialog(false);
        }
    };

    const confirmArchiveOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setOpenArchiveDialog(true);
    };

    const handleArchiveOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/orders/${selectedOrderId}/archive`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isArchived: true })
            });

            if (response.ok) {
                setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrderId));
                console.log("Zamówienie zostało zarchiwizowane.");
            } else {
                console.error("Błąd przy archiwizacji zamówienia:", response.statusText);
            }
        } catch (error) {
            console.error("Błąd sieciowy podczas archiwizacji zamówienia:", error);
        } finally {
            setOpenArchiveDialog(false);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <AppContainer>
                <NavbarTopShelter />
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Lista zamówień</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3, marginRight: 2 }}>
                        Dodaj zamówienie
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => navigate("/ListPublicOrder")} sx={{ mb: 3, marginRight: 2 }}>
                        Wspólne zamówienia
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => navigate("/ArchiveOrders")} sx={{ mb: 3 }}>
                        Zarchiwizowane zamówienie
                    </Button>
                </Box>

                <TableContainer component={Paper} sx={{ mb: 66 }}>
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
                            {activeOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.count}</TableCell>
                                    <TableCell sx={{ maxWidth: 600, wordBreak: "break-all" }}>
                                        <a href={order.link} target="_blank" rel="noopener noreferrer">
                                            {order.link}
                                        </a>
                                    </TableCell>
                                    <TableCell>{order.info}</TableCell>
                                    <TableCell>{order.ispublic.toString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => editOrder(order)}
                                        >
                                            Edytuj
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => confirmDeleteOrder(order.id)}
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => confirmArchiveOrder(order.id)}
                                        >
                                            Archiwizuj
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Czy na pewno chcesz usunąć to zamówienie?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
                            Anuluj
                        </Button>
                        <Button onClick={handleDeleteOrder} color="primary">
                            Usuń
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openArchiveDialog} onClose={() => setOpenArchiveDialog(false)}>
                    <DialogTitle>Czy na pewno chcesz zarchiwizować to zamówienie?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setOpenArchiveDialog(false)} color="secondary">
                            Anuluj
                        </Button>
                        <Button onClick={handleArchiveOrder} color="primary">
                            Archiwizuj
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Dodaj nowe zamówienie</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Nazwa produktu"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Ilość"
                                type="number"
                                fullWidth
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value))}
                                margin="normal"
                            />
                            <TextField
                                label="Link do produktu"
                                fullWidth
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                            <TextField
                                label="Dodatkowe informacje"
                                fullWidth
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="order-public--label">Publiczne zamówienie</InputLabel>
                                <Select
                                    labelId="order-public--label"
                                    label="Publiczne zamówienie"
                                    margin="normal"
                                    value={ispublic.toString()}
                                    onChange={handleBooleanChange}
                                >
                                    <MenuItem value="true">Tak</MenuItem>
                                    <MenuItem value="false">Nie</MenuItem>
                                </Select>
                            </FormControl>
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">
                                    Anuluj
                                </Button>
                                <Button type="submit" color="primary">
                                    Dodaj
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Edytuj zamówienie</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Liczbq"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={updatedOrder.count || ""}
                            onChange={(e) => setUpdatedOrder({ ...updatedOrder, count: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Opis"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={updatedOrder.info || ""}
                            onChange={(e) => setUpdatedOrder({ ...updatedOrder, info: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)} color="primary">
                            Anuluj
                        </Button>
                        <Button onClick={() => handleEditSubmit(editingOrder.id)} color="primary">
                            Zapisz
                        </Button>
                    </DialogActions>
                </Dialog>

                <ShelterFooter/>
            </AppContainer>
        </>
    );
}

export default Orders;
