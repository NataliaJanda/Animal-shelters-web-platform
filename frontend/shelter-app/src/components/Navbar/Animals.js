import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import {
    AppContainer,
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, Footer, FooterText,
    HeroOverlay, HeroSection, HeroText,
    SectionText, SectionTitle
} from "./style";

const Adoptions = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get('http://localhost:8080/adoption/', config);

                console.log("Dane adopcji:", response.data);

                setAdoptions(response.data);

                response.data.forEach(adoption => {
                    if (adoption.animal && adoption.animal.id) {
                        fetchAnimalPhoto(adoption.animal.id);
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
        <AppContainer>
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
                {adoptions.map((adoption) => {
                    const animal = adoption.animal || {};
                    const shelter = adoption.shelter || {};

                    return (
                        <CollectionCard
                            key={adoption.id}
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
                                <CollectionDescription>Opis: {adoption.description || "Brak opisu"}</CollectionDescription>
                            </CollectionInfo>
                        </CollectionCard>
                    );
                })}
            </CollectionGridSection>

            <Footer>
                <FooterText>© 2024. Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </AppContainer>
    );
};

export default Adoptions;
