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

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(`http://localhost:8080/campaigns/`, config);
                setCampaigns(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu kampanii:", error);
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
                        <h1>Nasze Zbiórki</h1>
                        <p>
                            Pomóż wspierać nasze akcje charytatywne i zbiórki. Każda złotówka ma znaczenie!
                        </p>
                    </HeroText>
                </HeroOverlay>
            </HeroSection>

            <ContentSection>
                <SectionTitle>Aktywne Zbiórki</SectionTitle>
                <SectionText>
                    Poniżej znajdziesz listę aktualnych zbiórek, które prowadzimy. Możesz wziąć udział i wesprzeć naszą misję.
                </SectionText>
            </ContentSection>

            <CollectionGridSection>
                {campaigns.map((campaign) => {
                    const shelter = campaign.shelter || {};
                    return(
                    <CollectionCard key={campaign.id}>
                        <CollectionImage src="https://via.placeholder.com/400" alt={campaign.title} />
                        <CollectionInfo>
                            <CollectionTitle>{campaign.title}</CollectionTitle>
                            <CollectionGoal>Cel: {campaign.goal}</CollectionGoal>
                            <CollectionDescription>
                                {campaign.description}
                            </CollectionDescription>
                            <CollectionGoal>Schronisko: {shelter.name}</CollectionGoal>
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

export default Campaigns;
