import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, Footer, FooterText,
    SectionText, SectionTitle
} from "../../Navbar/style";
import NavbarTopShelter from "../NavbarTopShelter";

const ManageAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({}); // Stan na zdjęcia
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
                response.data.forEach(animal => fetchAnimalPhoto(animal.id));
            } catch (error) {
                console.error("Błąd przy pobieraniu zwierząt:", error);
                setLoading(false);
            }
        };

        fetchAnimals();
    }, [shelterId]);

    const fetchAnimalPhoto = async (animalId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("Brak tokena autoryzacyjnego. Użytkownik musi się zalogować.");
                return;
            }

            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                responseType: 'blob',
            };

            const response = await axios.get(`http://localhost:8080/animal/photo/${animalId}`, config);

            if (response.status === 200) {
                const imageUrl = URL.createObjectURL(response.data);
                setAnimalPhotos((prevPhotos) => ({
                    ...prevPhotos,
                    [animalId]: imageUrl,
                }));
            } else {
                console.error(`Błąd przy pobieraniu zdjęcia dla zwierzęcia ${animalId}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Błąd przy pobieraniu zdjęcia dla zwierzęcia ${animalId}:`, error);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedAnimal((prevAnimal) => ({
                ...prevAnimal,
                photo: file
            }));
        }
    };

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
            const formData = new FormData();
            formData.append('name', updatedAnimal.name);
            formData.append('atitude', updatedAnimal.atitude);
            formData.append('age', updatedAnimal.age);
            if (updatedAnimal.photo) {
                formData.append('photo', updatedAnimal.photo);
            }

            const response = await axios.put(`http://localhost:8080/animal/admin/edit/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

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
                <SectionText></SectionText>
            </ContentSection>

            <CollectionGridSection>
                {animals.map((animal) => (

                    <CollectionCard key={animal.id}>
                        <CollectionImage src={animalPhotos[animal.id] || "https://via.placeholder.com/400"} alt={animal.name} />
                        <CollectionInfo>
                            <CollectionTitle>{animal.name}</CollectionTitle>
                            <CollectionGoal>Zachowanie: {animal.atitude}</CollectionGoal>
                            <CollectionDescription>Wiek: {animal.age}</CollectionDescription>

                            {editingAnimal && editingAnimal.id === animal.id ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(animal.id); }}>
                                    <input
                                        type="text"
                                        value={updatedAnimal.name || ""}
                                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, name: e.target.value })}
                                        placeholder="Nazwa"
                                    />
                                    <input
                                        type="text"
                                        value={updatedAnimal.atitude || ""}
                                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, atitude: e.target.value })}
                                        placeholder="Zachowanie"
                                    />
                                    <input
                                        type="number"
                                        value={updatedAnimal.age || ""}
                                        onChange={(e) => setUpdatedAnimal({ ...updatedAnimal, age: e.target.value })}
                                        placeholder="Wiek"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
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
