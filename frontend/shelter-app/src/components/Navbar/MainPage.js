import React, {useEffect, useState} from "react";
import SideBar from "../SideBar/SideBar";
import Background2 from "../Background/Background2";
import LowBackground from "../LowBackground/LowBackground";
import Background from "../Background/Background";
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import {
    AppContainer,
    CollectionCard, CollectionDescription,
    CollectionGoal,
    CollectionGridSection,
    CollectionImage,
    CollectionInfo,
    CollectionTitle,
} from "./style";
import axios from "axios";
import ShelterFooter from "../Background/ShelterFooter";
import {useNavigate} from "react-router-dom";

const MainPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const maxVisible = 9;

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const response = await axios.get('http://localhost:8080/animal/', config);

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
      <AppContainer>
        <NavbarTopLoginSession />
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Background />
        <LowBackground />
        <Background2 />
          <CollectionGridSection>
              {adoptions.slice(0, maxVisible).map((animal) => {
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

            <CollectionCard key="show-more" onClick={() => window.location.href = "/animals"} style={{ cursor: 'pointer'}}>
                <CollectionInfo>
                    <CollectionTitle>Pokaż więcej</CollectionTitle>
                    <CollectionDescription>Odkryj więcej zwierząt</CollectionDescription>
                </CollectionInfo>
            </CollectionCard>
      </CollectionGridSection>
          <ShelterFooter/>
</AppContainer>
  );
};

export default MainPage;
