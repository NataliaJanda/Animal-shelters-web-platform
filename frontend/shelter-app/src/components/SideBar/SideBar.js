// SideBar.js
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 250px;
    height: 100%;
    background: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-in-out;
    z-index:11;
    display: flex;
    flex-direction: column;
    padding-top: 50px;
`;

const SidebarLink = styled(Link)`
    display: block;
    padding: 1rem;
    color: black;
    text-decoration: none;
    font-size: 1rem;
    &:hover {
        background: #f1f1f1;
    }
    @media screen and (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const CloseButton = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 1.5rem;
    cursor: pointer;
`;

const SideBar = ({ isOpen, toggleSidebar }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [UserRole, setUserRole] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        const role = localStorage.getItem("role")
        if (role === "SHELTER") {
            setUserRole(true)
        } else {setUserRole(false)}
    }, [], );

    return (
        <>
            {isLoggedIn ? (
                <>
                    {UserRole ? (
                        <SidebarContainer isOpen={isOpen}>
                            <CloseButton onClick={toggleSidebar}>×</CloseButton>
                            <SidebarLink to="/MainPageSessionShelter">Strona główna</SidebarLink>
                            <SidebarLink to="/CreateCampaign">Stwórz zbiórkę</SidebarLink>
                            <SidebarLink to="/ManageCampaigns">Zarządzaj zbiórkami</SidebarLink>
                            <SidebarLink to="/AddNews">Dodaj ogłoszenie</SidebarLink>
                            <SidebarLink to="/ManageNews">Zarządzaj ogłoszeniami</SidebarLink>
                            <SidebarLink to="/CreateAdoption">Dodaj adopcję</SidebarLink>
                            <SidebarLink to="/ManageAdoption">Zarządzaj adopcjami</SidebarLink>
                            <SidebarLink to="/AdoptionEmail">Zgłoszenia adopcyjne</SidebarLink>
                            <SidebarLink to="/Orders">Zarządzaj zamówieniami</SidebarLink>
                            <SidebarLink to="/OrdersList">Lista zamówień</SidebarLink>
                            <SidebarLink to="/OrdersRequest">Moje prośby</SidebarLink>
                            <SidebarLink to="/addAnimal">Dodaj zwierzę</SidebarLink>
                            <SidebarLink to="/ManageAnimals">Zarządzaj zwierzętami</SidebarLink>
                            <SidebarLink to="/MyAccountShelter">Moje konto</SidebarLink>
                            <SidebarLink to="/" onClick={() => localStorage.clear()}>Wyloguj się</SidebarLink>
                        </SidebarContainer>

                    ) : (
                        <SidebarContainer isOpen={isOpen}>
                            <CloseButton onClick={toggleSidebar}>×</CloseButton>
                            <SidebarLink to="/about" onClick={toggleSidebar}>O nas</SidebarLink>
                            <SidebarLink to="/collection" onClick={toggleSidebar}>Zbiórki</SidebarLink>
                            <SidebarLink to="/events" onClick={toggleSidebar}>Tablica ogłoszeń</SidebarLink>
                            <SidebarLink to="/animals" onClick={toggleSidebar}>Zwierzęta</SidebarLink>
                            <SidebarLink to="/MyAccount" onClick={toggleSidebar}>Moje konto</SidebarLink>
                            <SidebarLink to="/" onClick={() => localStorage.clear()}>Wyloguj się</SidebarLink>
                        </SidebarContainer>
                    )}
                </>
            ) : (
                <>
                    {isLoggedIn ? (
                        <SidebarContainer isOpen={isOpen}>
                            <CloseButton onClick={toggleSidebar}>×</CloseButton>
                            <SidebarLink to="/about" onClick={toggleSidebar}>O nas</SidebarLink>
                            <SidebarLink to="/collection" onClick={toggleSidebar}>Zbiórki</SidebarLink>
                            <SidebarLink to="/events" onClick={toggleSidebar}>Tablica ogłoszeń</SidebarLink>
                            <SidebarLink to="/animals" onClick={toggleSidebar}>Zwierzęta</SidebarLink>
                            <SidebarLink to="/sign-up" onClick={toggleSidebar}>Zarejestruj się</SidebarLink>
                            <SidebarLink to="/signin" onClick={toggleSidebar}>Zaloguj się</SidebarLink>
                        </SidebarContainer>

                    ) : (
                        <SidebarContainer isOpen={isOpen}>
                            <CloseButton onClick={toggleSidebar}>×</CloseButton>
                            <SidebarLink to="/about" onClick={toggleSidebar}>O nas</SidebarLink>
                            <SidebarLink to="/collection" onClick={toggleSidebar}>Zbiórki</SidebarLink>
                            <SidebarLink to="/events" onClick={toggleSidebar}>Tablica ogłoszeń</SidebarLink>
                            <SidebarLink to="/animals" onClick={toggleSidebar}>Zwierzęta</SidebarLink>
                            <SidebarLink to="/sign-up" onClick={toggleSidebar}>Zarejestruj się</SidebarLink>
                            <SidebarLink to="/signin" onClick={toggleSidebar}>Zaloguj się</SidebarLink>
                        </SidebarContainer>
                    )}
                </>
            )}

        </>
    );
};

export default SideBar;
