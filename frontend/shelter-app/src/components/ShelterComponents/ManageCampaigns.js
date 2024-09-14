import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    ContentSection, SectionTitle, SectionText, CollectionGridSection, CollectionCard,
    CollectionImage, CollectionInfo, CollectionTitle, CollectionGoal, CollectionDescription
} from "../Navbar/Campaigns";
import NavbarTopShelter from "./NavbarTopShelter";

const ManageCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);

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

        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(`http://localhost:8080/campaigns/shelter/${shelterId}`, config);
                setCampaigns(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu kampanii:", error);
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, [shelterId]);

    if (loading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            <NavbarTopShelter />
            <ContentSection>
                <SectionTitle>Aktywne Zbiórki</SectionTitle>
                <SectionText>
                    Poniżej znajdziesz listę aktualnych zbiórek, które prowadzimy.
                </SectionText>
            </ContentSection>

            <CollectionGridSection>
                {campaigns.map((campaign) => (
                    <CollectionCard key={campaign.id}>
                        <CollectionImage src="https://via.placeholder.com/400" alt={campaign.title} />
                        <CollectionInfo>
                            <CollectionTitle>{campaign.title}</CollectionTitle>
                            <CollectionGoal>Cel: {campaign.goal}</CollectionGoal>
                            <CollectionDescription>
                                {campaign.description}
                            </CollectionDescription>
                        </CollectionInfo>
                    </CollectionCard>
                ))}
            </CollectionGridSection>
        </>
    );
};

export default ManageCampaigns;
