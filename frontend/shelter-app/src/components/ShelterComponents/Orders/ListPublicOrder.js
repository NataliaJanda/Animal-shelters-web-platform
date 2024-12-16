import React, { useState, useEffect } from 'react';
import {
    AppContainer
} from "../../Navbar/style";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import NavbarTopShelter from "../NavbarTopShelter";
import ShelterFooter from "../../Background/ShelterFooter";

function ListPublicOrder() {
    const [publicOrders, setPublicOrders] = useState([]);
    const [shelterId, setShelterId] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orderContributions, setOrderContributions] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedContribution, setSelectedContribution] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("shelterId");
        if (id) {
            setShelterId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }
    }, []);

    useEffect(() => {

        const fetchOrders = async () => {
            if (!shelterId) return;
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`http://localhost:8080/orders/shelter/${shelterId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
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
        fetchOrders();
    }, [shelterId]);

    const handleAcceptContribution = async (orderId, contributionId) => {
        if (contributionId === null) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/OrderContributions/${contributionId}/accept`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ is_accept: true })
            });

            if (response.ok) {
                setOrderContributions((prevState) => {
                    const updatedContributions = prevState[orderId].map((contribution) =>
                        contribution.id === contributionId
                            ? { ...contribution, _accept: true }
                            : contribution
                    );
                    return { ...prevState, [orderId]: updatedContributions };
                });
            } else {
                console.error("Błąd przy aktualizacji kontrybucji:", response.statusText);
            }
        } catch (error) {
            console.error("Błąd sieciowy:", error);
        }
    };



    const toggleExpandOrder = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
            return;
        }

        if (!orderContributions[orderId]) {
            try {
                const response = await fetch(`http://localhost:8080/OrderContributions/orders/${orderId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const contributions = await response.json();
                    setOrderContributions(prevState => ({
                        ...prevState,
                        [orderId]: contributions
                    }));
                } else {
                    console.error("Error fetching order contributions:", response.statusText);
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        }
        setExpandedOrder(orderId);
    };

    const openConfirmDialog = (orderId, contributionId) => {
        setSelectedOrder(orderId);
        setSelectedContribution(contributionId);
        setIsDialogOpen(true);
    };

    const closeConfirmDialog = () => {
        setIsDialogOpen(false);
        setSelectedOrder(null);
        setSelectedContribution(null);
    };

    const confirmAcceptContribution = () => {
        if (selectedOrder && selectedContribution) {
            handleAcceptContribution(selectedOrder, selectedContribution);
        }
        closeConfirmDialog();
    };

    return (
        <>
            <AppContainer>
                <NavbarTopShelter />
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Stworzone wspólne zamówienia
                    </Typography>
                </Box>

                <TableContainer component={Paper} sx={{ mb: 66 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nazwa</TableCell>
                                <TableCell>Ilość</TableCell>
                                <TableCell>Łączna ilość</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Schronisko</TableCell>
                                <TableCell>Informacje</TableCell>
                                <TableCell>Prośby dołączenia</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {publicOrders.map((order) => {
                                const totalQuantity = orderContributions[order.id]
                                    ? orderContributions[order.id]
                                        .filter((contribution) => contribution._accept)
                                        .reduce(
                                            (sum, contribution) => sum + contribution.quantity,
                                            order.count
                                        )
                                    : order.count;
                                return (
                                    <React.Fragment key={order.id}>
                                        <TableRow>
                                            <TableCell>{order.name}</TableCell>
                                            <TableCell>{order.count}</TableCell>
                                            <TableCell>{totalQuantity}</TableCell>
                                            <TableCell sx={{ maxWidth: 600, wordBreak: "break-all" }}>
                                                <a href={order.link} target="_blank" rel="noopener noreferrer">
                                                    {order.link}
                                                </a>
                                            </TableCell>
                                            <TableCell>{order.shelter.name}</TableCell>
                                            <TableCell>{order.info}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => toggleExpandOrder(order.id)}>
                                                    {expandedOrder === order.id ? "Zwiń" : "Rozwiń"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        {expandedOrder === order.id && (
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Nazwa</TableCell>
                                                                <TableCell>Wiadomość</TableCell>
                                                                <TableCell>Ilość</TableCell>
                                                                <TableCell>Status</TableCell>
                                                                <TableCell>Akcja</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {orderContributions[order.id] ? (
                                                                orderContributions[order.id].map((contribution) => (
                                                                    <TableRow key={contribution.id}>
                                                                        <TableCell>
                                                                            {contribution.shelter ? contribution.shelter.name : "Brak danych"}
                                                                        </TableCell>
                                                                        <TableCell>{contribution.message}</TableCell>
                                                                        <TableCell>{contribution.quantity}</TableCell>
                                                                        <TableCell>
                                                                            {contribution._accept ? "Zaakceptowane" : "Niezaakceptowane"}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Button
                                                                                variant="contained"
                                                                                color="primary"
                                                                                onClick={() =>
                                                                                    openConfirmDialog(order.id, contribution.id)
                                                                                }
                                                                            >
                                                                                Akceptuj
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={5}>Ładowanie danych...</TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ShelterFooter/>
            </AppContainer>

            <Dialog open={isDialogOpen} onClose={closeConfirmDialog}>
                <DialogTitle>Potwierdzenie Akceptacji</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz zaakceptować tę kontrybucję?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog} color="secondary">
                        Nie
                    </Button>
                    <Button onClick={confirmAcceptContribution} color="primary">
                        Tak
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ListPublicOrder;
