import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopUnlogin from "./NavbarTopUnllogin";
import {
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, Footer, FooterText,
    HeroOverlay,
    HeroSection,
    HeroText,
    SectionText,
    SectionTitle
} from "./style";

const Animals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(`http://localhost:8080/animal/`, config);
                setAnimals(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu zwierząt:", error);
                setLoading(false);
            }
        };

        fetchCampaigns();
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
                        <h1>Zwierzęta</h1>
                        <p>
                        </p>
                    </HeroText>
                </HeroOverlay>
            </HeroSection>

            <ContentSection>
                <SectionTitle>Zwierzęta do adopcji</SectionTitle>
                <SectionText>
                </SectionText>
            </ContentSection>

            <CollectionGridSection>
                {animals.map((animals) => (
                    <CollectionCard key={animals.id}>
                        <CollectionImage src="https://via.placeholder.com/400" alt={animals.name} />
                        <CollectionInfo>
                            <CollectionTitle>{animals.name}</CollectionTitle>
                            <CollectionGoal>Zachowanie: {animals.atitude}</CollectionGoal>
                            <CollectionDescription>Wiek:
                                {animals.age}
                            </CollectionDescription>
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

export default Animals;
