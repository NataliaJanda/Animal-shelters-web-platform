import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopLoginSession from "../Navbar/NavbarTopUnllogin";
import {
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection,
    HeroOverlay, HeroSection, HeroText,
    SectionText, SectionTitle
} from "../Navbar/style";
import ShelterFooter from "../Background/ShelterFooter";
import {useNavigate} from "react-router-dom";

const AdoptCat= () => {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get('http://localhost:8080/animal/species/2', config);

                console.log("Dane adopcji:", response.data);

                const filteredAnimal = response.data.filter(animal => animal.available === true);
                setAdoptions(filteredAnimal);

                filteredAnimal.forEach(adoption => {
                    if (adoption.id) {
                        fetchAnimalPhoto(adoption.id);
                    }
                });

                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu adopcji:", error);
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, []);

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

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopLoginSession />
            <HeroSection>
                <HeroOverlay>
                    <HeroText>
                        <h1>Zwierzęta do adopcji</h1>
                        <p>Znajdź swojego nowego przyjaciela.</p>
                    </HeroText>
                </HeroOverlay>
            </HeroSection>

            <ContentSection>
                <SectionTitle>Adopcje</SectionTitle>
                <SectionText>Przeglądaj dostępne zwierzęta do adopcji z różnych schronisk.</SectionText>
            </ContentSection>

            <CollectionGridSection>
                {adoptions.map((animal) => {
                    const shelter = animal.shelter || {};

                    return (
                        <CollectionCard
                            key={animal.id}
                            onClick={() => navigate(`/animal/${animal.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <CollectionImage
                                src={animalPhotos[animal.id] || "https://via.placeholder.com/400"}
                                alt={animal.name || "Brak nazwy"}
                            />
                            <CollectionInfo>
                                <CollectionTitle>{animal.name || "Nieznana nazwa"}</CollectionTitle>
                                <CollectionGoal>Schronisko: {shelter.name || "Nieznane schronisko"}</CollectionGoal>
                                <CollectionDescription>Wiek: {animal.age || "Nieznany wiek"} lat</CollectionDescription>
                                <CollectionDescription>Opis: {animal.description || "Brak opisu"}</CollectionDescription>
                            </CollectionInfo>
                        </CollectionCard>
                    );
                })}
            </CollectionGridSection>

            <ShelterFooter/>
        </>
    );
};

export default AdoptCat;
