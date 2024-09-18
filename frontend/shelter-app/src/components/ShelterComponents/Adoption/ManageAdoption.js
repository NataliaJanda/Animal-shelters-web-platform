import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, Footer, FooterText,
    SectionText, SectionTitle
} from "../../Navbar/style";
import NavbarTopShelter from "../NavbarTopShelter";

const ManageAdoptions = () => {
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});
    const [shelterId, setShelterId] = useState(null);
    const [editingAdoption, setEditingAdoption] = useState(null);
    const [updatedAdoption, setUpdatedAdoption] = useState({});
    const [adoptions, setAdoptions] = useState([]);

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

        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get(`http://localhost:8080/adoption/shelter/${shelterId}`, config);

                console.log("Dane adopcji:", response.data);

                response.data.forEach(adoption => {
                    if (adoption.animal && adoption.animal.id) {
                        fetchAnimalPhoto(adoption.animal.id);
                    }
                });

                setAdoptions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu adopcji:", error);
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, [shelterId]);

    const deleteAdoption = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            await axios.delete(`http://localhost:8080/adoption/admin/delete/${id}`, config);
            setAdoptions(adoptions.filter(adoption => adoption.id !== id));
        } catch (error) {
            console.error("Błąd przy usuwaniu adopcji:", error);
        }
    };

    const fetchAnimalPhoto = async (animalId) => {
        try {
            const config = {
                headers: {
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

    const editAdoption = (adoption) => {
        setEditingAdoption(adoption);
        setUpdatedAdoption(adoption);
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            const response = await axios.put(`http://localhost:8080/adoption/admin/edit/${id}`, updatedAdoption, config);
            setAdoptions(adoptions.map(a => (a.id === id ? response.data : a)));
            setEditingAdoption(null);
        } catch (error) {
            console.error("Błąd przy edytowaniu adopcji:", error);
        }
    };

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Adopcje</SectionTitle>
                <SectionText>Przeglądaj dostępne zwierzęta do adopcji z Twojego schroniska.</SectionText>
            </ContentSection>

            <CollectionGridSection>
                {adoptions.map((adoption) => {
                    const animal = adoption.animal || {};
                    const shelter = adoption.shelter || {};

                    return (
                        <CollectionCard key={adoption.id}>
                            <CollectionImage
                                src={animalPhotos[animal.id] || "https://via.placeholder.com/400"}
                                alt={animal.name || "Brak nazwy"}
                            />
                            <CollectionInfo>
                                <CollectionTitle>{animal.name || "Nieznana nazwa"}</CollectionTitle>
                                <CollectionGoal>Schronisko: {shelter.name || "Nieznane schronisko"}</CollectionGoal>
                                <CollectionDescription>Wiek: {animal.age || "Nieznany wiek"} lat</CollectionDescription>
                                <CollectionDescription>Opis: {adoption.description || "Brak opisu"}</CollectionDescription>

                                {editingAdoption && editingAdoption.id === adoption.id ? (
                                    <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(adoption.id); }}>
                                        <input
                                            type="text"
                                            value={updatedAdoption.description}
                                            onChange={(e) => setUpdatedAdoption({ ...updatedAdoption, description: e.target.value })}
                                            placeholder="Opis adopcji"
                                        />
                                        <button type="submit">Zapisz zmiany</button>
                                    </form>
                                ) : (
                                    <>
                                        <button onClick={() => editAdoption(adoption)}>Edytuj</button>
                                        <button onClick={() => deleteAdoption(adoption.id)}>Usuń</button>
                                    </>
                                )}
                            </CollectionInfo>
                        </CollectionCard>
                    );
                })}
            </CollectionGridSection>

            <Footer>
                <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </>
    );
};

export default ManageAdoptions;
