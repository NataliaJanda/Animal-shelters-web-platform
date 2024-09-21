import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopShelter from "../NavbarTopShelter";
import {
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImageNC, CollectionInfo, CollectionTitle,
    ContentSection,
    SectionText,
    SectionTitle
} from "../../Navbar/style";
import logo from "../../Navbar/logo.png"

const ManageCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [editingCampaing, setEditingCampaing] = useState(null);
    const [updatedCampaing, setUpdatedCampaing] = useState({});

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

    const deleteCampaign = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            await axios.delete(`http://localhost:8080/campaigns/admin/delete/${id}`, config);
            setCampaigns(campaigns.filter(campaigns => campaigns.id !== id));
        } catch (error) {
            console.error("Błąd przy usuwaniu zwierzęcia:", error);
        }
    };

    const editCampaing = (campaigns) => {
        setEditingCampaing(campaigns);
        setUpdatedCampaing(campaigns);
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                : { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.put(`http://localhost:8080/campaigns/admin/edit/${id}`, updatedCampaing, config);

            setCampaigns(campaigns.map(c => (c.id === id ? response.data : c)));
            setEditingCampaing(null);
        } catch (error) {
            console.error("Błąd przy edytowaniu kampanii:", error);
        }
    };

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
                {campaigns.map((campaign) => {
                    const shelter = campaign.shelter || {};
                    return(
                    <CollectionCard key={campaign.id}>
                        <CollectionImageNC src={logo || "https://via.placeholder.com/400"} alt={campaign.title}/>
                        <CollectionInfo>
                            <CollectionTitle>{campaign.title}</CollectionTitle>
                            <CollectionGoal>Cel: {campaign.goal}</CollectionGoal>
                            <CollectionGoal>Data zakończenia: {campaign.end_date}</CollectionGoal>
                            <CollectionDescription>
                                {campaign.description}
                            </CollectionDescription>
                            <CollectionDescription>Schronisko: {shelter.name}</CollectionDescription>


                            {editingCampaing && editingCampaing.id === campaign.id ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleEditSubmit(campaign.id);
                                }}>
                                    <input
                                        type="number"
                                        value={updatedCampaing.goal || ""}
                                        onChange={(e) => setUpdatedCampaing({...updatedCampaing, goal: e.target.value})}
                                        placeholder="Cel"
                                    />
                                    <input
                                        type="text"
                                        value={updatedCampaing.description || ""}
                                        onChange={(e) => setUpdatedCampaing({
                                            ...updatedCampaing,
                                            description: e.target.value
                                        })}
                                        placeholder="Opis adopcji"
                                    />
                                    <button type="submit">Zapisz zmiany</button>
                                </form>
                            ) : (
                                <>
                                    <button onClick={() => editCampaing(campaign)}>Edytuj</button>
                                    <button onClick={() => deleteCampaign(campaign.id)}>Usuń</button>
                                </>
                            )}
                        </CollectionInfo>
                    </CollectionCard>
                    );
                })}
            </CollectionGridSection>
        </>
    );
};

export default ManageCampaigns;
