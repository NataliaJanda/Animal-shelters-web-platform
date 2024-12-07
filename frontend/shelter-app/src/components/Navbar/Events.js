import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopLoginSession from "../Navbar/NavbarTopUnllogin";
import {
    AppContainer,
    CollectionCard, CollectionDescription,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, HeroOverlay, HeroSection, HeroText,
    SectionText,
    SectionTitle
} from "./style";
import logo from "./logo.png"
import ShelterFooter from "../Background/ShelterFooter";


const Events = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(`http://localhost:8080/news/`, config);
                setNews(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu kampanii:", error);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <AppContainer>
            <NavbarTopLoginSession />
            <HeroSection>
                <HeroOverlay>
                    <HeroText>
                        <h1>Nasze Zbiórki</h1>
                        <p>
                            Pomóż wspierać nasze akcje charytatywne i zbiórki. Każda złotówka ma znaczenie!
                        </p>
                    </HeroText>
                </HeroOverlay>
            </HeroSection>
            <ContentSection>
                <SectionTitle>Aktywne Ogłoszenia</SectionTitle>
                <SectionText>
                    Poniżej znajdziesz listę aktualnych ogłoszeń, które prowadzimy.
                </SectionText>
            </ContentSection>

            <CollectionGridSection>
                {news.map((news) => {
                    const shelter = news.shelter || {};
                    return(
                        <CollectionCard key={news.id}>
                            <CollectionImage src={logo} alt={news.title}/>
                            <CollectionInfo>
                                <CollectionTitle>{news.title}</CollectionTitle>
                                <CollectionDescription>
                                    {news.description}
                                </CollectionDescription>
                                <CollectionDescription>Schronisko: {shelter.name}</CollectionDescription>
                            </CollectionInfo>
                        </CollectionCard>
                    );
                })}
            </CollectionGridSection>
            <ShelterFooter/>
        </AppContainer>
    );
};

export default Events;
