import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import {
    AppContainer,
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection, Footer, FooterText,
    HeroOverlay,
    HeroSection,
    HeroText,
    SectionText,
    SectionTitle
} from "./style";
import logo from "./logo.png"
import {useNavigate} from "react-router-dom";


const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                <SectionTitle>Aktywne Zbiórki</SectionTitle>
                <SectionText>
                    Poniżej znajdziesz listę aktualnych zbiórek, które prowadzimy. Możesz wziąć udział i wesprzeć naszą misję.
                </SectionText>
            </ContentSection>

            <CollectionGridSection>
                {campaigns.map((campaign) => {
                    const shelter = campaign.shelter || {};
                    return(
                    <CollectionCard key={campaign.id} onClick={() => navigate(`/campaign/${campaign.id}`)}
                                    style={{ cursor: 'pointer' }}>
                        <CollectionImage src={logo} alt={campaign.title} />
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
        </AppContainer>
    );
};

export default Campaigns;
