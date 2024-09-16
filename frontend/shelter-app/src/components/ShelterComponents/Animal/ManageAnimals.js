import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, Footer, FooterText,
    SectionText,
    SectionTitle
} from "../../Navbar/style";
import NavbarTopShelter from "../NavbarTopShelter";

const ManageAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [editingAnimal, setEditingAnimal] = useState(null);
    const [updatedAnimal, setUpdatedAnimal] = useState({});

    useEffect(() => {
        const id = localStorage.getItem('shelterId');
        if (id) {
            setShelterId(id);
        } else {
            console.error("Nie znaleziono ID schroniska w localStorage");
        }
    }, []);

    useEffect(() => {
        if (shelterId === null) return;

        const fetchAnimals = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(`http://localhost:8080/animal/shelter/${shelterId}`, config);
                setAnimals(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu zwierząt:", error);
                setLoading(false);
            }
        };

        fetchAnimals();
    }, [shelterId]);

    const deleteAnimal = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            await axios.delete(`http://localhost:8080/animal/admin/delete/${id}`, config);
            setAnimals(animals.filter(animal => animal.id !== id));
        } catch (error) {
            console.error("Błąd przy usuwaniu zwierzęcia:", error);
        }
    };

    const editAnimal = (animal) => {
        setEditingAnimal(animal);
        setUpdatedAnimal(animal);
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            const response = await axios.put(`http://localhost:8080/animal/admin/edit/${id}`, updatedAnimal, config);

            // Aktualizacja stanu z nowymi danymi po edycji
            setAnimals(animals.map(a => (a.id === id ? response.data : a)));
            setEditingAnimal(null);
        } catch (error) {
            console.error("Błąd przy edytowaniu zwierzęcia:", error);
        }
    };

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Zwierzęta</SectionTitle>
                <SectionText>
                </SectionText>
            </ContentSection>

            <CollectionGridSection>
                {animals.map((animal) => (
                    <CollectionCard key={animal.id}>
                        <CollectionImage src="https://via.placeholder.com/400" alt={animal.name} />
                        <CollectionInfo>
                            <CollectionTitle>{animal.name}</CollectionTitle>
                            <CollectionGoal>Zachowanie: {animal.atitude}</CollectionGoal>
                            <CollectionDescription>Wiek: {animal.age}</CollectionDescription>

                            {editingAnimal && editingAnimal.id === animal.id ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(animal.id); }}>
                                    <input
                                        type="text"
                                        value={updatedAnimal.name}
                                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, name: e.target.value })}
                                        placeholder="Nazwa"
                                    />
                                    <input
                                        type="text"
                                        value={updatedAnimal.atitude}
                                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, atitude: e.target.value })}
                                        placeholder="Zachowanie"
                                    />
                                    <input
                                        type="number"
                                        value={updatedAnimal.age}
                                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, age: e.target.value })}
                                        placeholder="Wiek"
                                    />
                                    <button type="submit">Zapisz zmiany</button>
                                </form>
                            ) : (
                                <>
                                    <button onClick={() => editAnimal(animal)}>Edytuj</button>
                                    <button onClick={() => deleteAnimal(animal.id)}>Usuń</button>
                                </>
                            )}
                        </CollectionInfo>
                    </CollectionCard>
                ))}
            </CollectionGridSection>

            <Footer>
                <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </>
    );
};

export default ManageAnimals;