import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopUnlogin from "./NavbarTopUnllogin";
import {
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, Footer, FooterText,
    HeroOverlay, HeroSection, HeroText,
    SectionText, SectionTitle
} from "./style";

const Adoptions = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get('http://localhost:8080/adoption/', config);

                console.log("Dane adopcji:", response.data);  // Dodaj tę linię, aby sprawdzić dane

                setAdoptions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu adopcji:", error);
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, []);

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopUnlogin />
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
                        <CollectionCard key={adoption.id}>
                            <CollectionImage src="https://via.placeholder.com/400" alt={animal.name || "Nieznane zwierzę"} />
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
        </>
    );
};

export default Adoptions;
