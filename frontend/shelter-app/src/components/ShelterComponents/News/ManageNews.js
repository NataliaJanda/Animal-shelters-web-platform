import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopShelter from "../NavbarTopShelter";
import {
    CollectionCard, CollectionDescription,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection,
    SectionText,
    SectionTitle
} from "../../Navbar/style";

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shelterId, setShelterId] = useState(null);
    const [editingNews, setEditingNews] = useState(null);
    const [updatedNews, setUpdatedNews] = useState({});

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

        const fetchNews = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const response = await axios.get(`http://localhost:8080/news/shelter/${shelterId}`, config);
                setNews(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Błąd przy pobieraniu kampanii:", error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [shelterId]);

    const deleteNews = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};

            await axios.delete(`http://localhost:8080/news/admin/delete/${id}`, config);
            setNews(news.filter(news => news.id !== id));
        } catch (error) {
            console.error("Błąd przy usuwaniu zwierzęcia:", error);
        }
    };

    const editNews = (news) => {
        setEditingNews(news);
        setUpdatedNews(news);
    };

    const handleEditSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
                : { headers: { 'Content-Type': 'application/json' } };

            const response = await axios.put(`http://localhost:8080/news/admin/edit/${id}`, updatedNews, config);

            setNews(news.map(c => (c.id === id ? response.data : c)));
            setEditingNews(null);
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
                            <CollectionImage src="https://via.placeholder.com/400" alt={news.title}/>
                            <CollectionInfo>
                                <CollectionTitle>{news.title}</CollectionTitle>
                                <CollectionDescription>
                                    {news.description}
                                </CollectionDescription>
                                <CollectionDescription>Schronisko: {shelter.name}</CollectionDescription>

                                {editingNews && editingNews.id === news.id ? (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleEditSubmit(news.id);
                                    }}>
                                        <input
                                            type="text"
                                            value={updatedNews.title || ""}
                                            onChange={(e) => setUpdatedNews({...updatedNews, title: e.target.value})}
                                            placeholder="Tytuł"
                                        />
                                        <input
                                            type="text"
                                            value={updatedNews.description || ""}
                                            onChange={(e) => setUpdatedNews({...updatedNews, description: e.target.value
                                            })}
                                            placeholder="Opis ogłoszenia"
                                        />
                                        <button type="submit">Zapisz zmiany</button>
                                    </form>
                                ) : (
                                    <>
                                        <button onClick={() => editNews(news)}>Edytuj</button>
                                        <button onClick={() => deleteNews(news.id)}>Usuń</button>
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

export default ManageNews;
