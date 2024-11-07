import React, { useState, useEffect } from 'react';
import {
    AppContainer,
    Footer,
    FooterText
} from "../../Navbar/style";
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
    FormControl, InputLabel, Select, MenuItem, Paper
} from '@mui/material';
import NavbarTopShelter from "../NavbarTopShelter";

function Orders() {
    const [name, setName] = useState('');
    const [count, setCount] = useState(1);
    const [link, setLink] = useState('');
    const [info, setInfo] = useState('');
    const [orders, setOrders] = useState([]);
    const [ispublic, setIsPublic] = useState(true)
    const [open, setOpen] = useState(false);
    const [shelterId, setShelterId] = useState(null);
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
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/orders/shelter/${shelterId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Error fetching orders:", response.statusText);
                    return;
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("API zwróciło dane, które nie są tablicą:", data);
                    setOrders([]);
                }
            } catch (error) {
                console.error("Network error:", error);
                setOrders([]);
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
        console.log("Submitting order:", newOrder);

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

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <AppContainer>
            <NavbarTopShelter />
                    <Box sx={{ textAlign: "center", mt: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Lista zamówień
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>
                            Dodaj zamówienie
                        </Button>
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
                                    {Array.isArray(orders) && orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.name}</TableCell>
                                            <TableCell>{order.count}</TableCell>
                                            <TableCell>
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
                                                    style={{ marginRight: "-40px" }}
                                                    // onClick={() => }
                                                >
                                                    Edytuj
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    style={{ marginRight: "-40px" }}
                                                    // onClick={() => }
                                                >
                                                    Usuń
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    style={{ marginRight: "-40px" }}
                                                    // onClick={() => }
                                                >
                                                    Archiwizuj
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                        />
                        <TextField
                            label="Dodatkowe informacje"
                            fullWidth
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            margin="normal"
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
                <Footer>
                    <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
                </Footer>
            </AppContainer>
        </>
    );
}

export default Orders;
