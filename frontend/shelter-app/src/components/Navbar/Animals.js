import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import {
    AppContainer,
    CollectionCard, CollectionDescription, CollectionGoal,
    CollectionGridSection, CollectionImage, CollectionInfo, CollectionTitle,
    ContentSection,
    HeroOverlay, HeroSection, HeroText,
    SectionText, SectionTitle
} from "./style";
import ShelterFooter from "../Background/ShelterFooter";
import {Button, FormControl, InputLabel, MenuItem, Select, Box} from "@mui/material";

const Adoptions = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animalPhotos, setAnimalPhotos] = useState({});
    const navigate = useNavigate();
    const [filterAnimal, setFilterAnimal] = useState('');
    const [filterSexAnimal, setFilterSexAnimal] = useState('');
    const [filterSizeAnimal, setFilterSizeAnimal] = useState('');
    const [filterTypeAnimal, setFilterTypeAnimal] = useState('');
    const [filterShelterName, setFilterShelterName] = useState('');
    const [filterShelterVoivodeship, setFilterShelterVoivodeship] = useState('');
    const [filterAgeAnimal, setFilterAgeAnimal] = useState('');


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

    const filteredAnimals = adoptions.filter(adoption => {
        const matchesRace = filterAnimal === '' || adoption.animal.race === filterAnimal;
        const matchesSex = filterSexAnimal === '' || adoption.animal.sex === filterSexAnimal;
        const matchesSize = filterSizeAnimal === '' || adoption.animal.size === filterSizeAnimal;
        const matchesType = filterTypeAnimal === '' || adoption.animal.species.name === filterTypeAnimal;
        const matchesAge = filterAgeAnimal === '' || adoption.animal.age === filterAgeAnimal;
        const matchesShelterName = filterShelterName === '' || adoption.animal.shelter.name === filterShelterName;
        const matchesShelterVoivodeship = filterShelterVoivodeship === '' || adoption.animal.shelter.voivodeship === filterShelterVoivodeship;


        return matchesRace && matchesSex && matchesSize && matchesType && matchesAge && matchesShelterName && matchesShelterVoivodeship;
    });

    const resetfilteredAnimals = () => {
        setFilterAnimal('') ;
        setFilterSexAnimal('');
        setFilterSizeAnimal('');
        setFilterTypeAnimal('');
        setFilterShelterName('');
        setFilterShelterVoivodeship('');
        setFilterAgeAnimal('');
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
                <Box sx={{
                    backgroundColor: "#ffffff", mt:3, borderRadius:10
                }}>
                    <FormControl style={{ marginTop: '30px', minWidth: 200 }}>

                    <InputLabel id="type-select-label">Wybierz typ</InputLabel>
                    <Select
                        labelId="type-select-label"
                        label={"Wybierz typ"}
                        value={filterTypeAnimal}
                        onChange={(e) => setFilterTypeAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie typy</MenuItem>
                        {Array.from(new Set(adoptions.map(adoption => adoption.animal.species.name))).map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="race-select-label">Wybierz rasę</InputLabel>
                    <Select
                        labelId="race-select-label"
                        label={"Wybierz rasę"}
                        value={filterAnimal}
                        onChange={(e) => setFilterAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie rasy</MenuItem>
                        {Array.from(new Set(adoptions.map(adoption => adoption.animal.race))).map((race) => (
                            <MenuItem key={race} value={race}>{race}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="sex-select-label">Wybierz płeć</InputLabel>
                    <Select
                        labelId="sex-select-label"
                        label={"Wybierz płeć"}
                        value={filterSexAnimal}
                        onChange={(e) => setFilterSexAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie płci</MenuItem>
                        {Array.from(new Set(adoptions.map(adoption => adoption.animal.sex))).map((sex) => (
                            <MenuItem key={sex} value={sex}>{sex}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="size-select-label">Wybierz rozmiar</InputLabel>
                    <Select
                        labelId="size-select-label"
                        label={"Wybierz rozmiar"}
                        value={filterSizeAnimal}
                        onChange={(e) => setFilterSizeAnimal(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie rozmiary</MenuItem>
                        {Array.from(new Set(adoptions.map(adoption => adoption.animal.size))).map((size) => (
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <SectionText></SectionText>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="age-select-label">Wybierz wiek</InputLabel>
                    <Select
                        labelId="age-select-label"
                        label={"Wybierz wiek"}
                        value={filterAgeAnimal}
                        onChange={(e) => setFilterAgeAnimal(e.target.value)}
                    >
                        <MenuItem value="">Każdy wiek</MenuItem>
                        {Array.from(new Set(adoptions.map(adoption => adoption.animal.age))).map((age) => (
                            <MenuItem key={age} value={age}>{age}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="shelter-name-select-label">Wybierz schronisko</InputLabel>
                    <Select
                        labelId="shelter-name-select-label"
                        label={"Wybierz schronisko"}
                        value={filterShelterName}
                        onChange={(e) => setFilterShelterName(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie schronisko</MenuItem>
                        {Array.from(new Set(adoptions.map(adoption => adoption.animal.shelter.name))).map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginTop: '30px', minWidth: 200 }}>
                    <InputLabel id="voivodeship-select-label">Wybierz województwo</InputLabel>
                    <Select
                        labelId="voivodeship-select-label"
                        label={"Wybierz województwo"}
                        value={filterShelterVoivodeship}
                        onChange={(e) => setFilterShelterVoivodeship(e.target.value)}
                    >
                        <MenuItem value="">Wszystkie województwa</MenuItem>
                        {Array.from(new Set(adoptions.map(adoption => adoption.animal.shelter.voivodeship))).map((voivodeship) => (
                            <MenuItem key={voivodeship} value={voivodeship}>{voivodeship}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                    <Button
                        style={{ marginTop: '40px', minWidth: 80, cursor: 'pointer', marginLeft:'15px'}}
                        onClick={() => (resetfilteredAnimals())}
                        sx={{}}
                    >
                        Resetuj
                    </Button>
                </Box>
            </ContentSection>

            <CollectionGridSection>
                {filteredAnimals.map((adoption) => {
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

            <ShelterFooter/>
        </AppContainer>
    );
};

export default Adoptions;
