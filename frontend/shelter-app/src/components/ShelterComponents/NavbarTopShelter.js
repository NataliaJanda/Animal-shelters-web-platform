import React, { useState, useEffect, useRef } from "react";
import {
    Bars, NavBarSignLink,
    NavBtn, NavBtnLink,
    NavLink, NavMenu,
} from "../Navbar/NavbarElements";
import styled from "styled-components";
import SideBar from "../SideBar/SideBar";
import logo from "../Navbar/logo.png";

export const Nav = styled.nav`
    background: white;
    height: 50px;
    display: flex;
    justify-content: space-between;
    z-index: 15;
    margin: -8px;
    position: relative;
`;

const DropdownMenu = styled.div`
    display: ${({isOpen}) => (isOpen ? "block" : "none")};
    position: absolute;
    background-color: white;
    min-width: 160px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1;
    padding: 0.5rem 0;
    left: 0;
    top: 100%;
    margin-top: 5px;
`;

const DropdownItem = styled(NavLink)`
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    &:hover {
        background-color: #f1f1f1;
    }
`;

const CollectionButton = styled.button`
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    color: black;
    position: relative;
    &:hover {
        color: #97d6fd;
    }
`;

const NavItem = styled.div`
    position: relative;
    padding: 0 1rem;
`;

const NavbarTopShelter = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [openMenu, setOpenMenu] = useState(null);

    const ref = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('shelterId');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
    };

    const handleMenuClick = (menu) => {
        if (openMenu === menu) {
            setOpenMenu(null);
        } else {
            setOpenMenu(menu);
        }
    };

    return (
        <>
            <Nav ref={ref}>
                <Bars onClick={toggleSidebar} />
                <NavMenu>
                    {isLoggedIn ? (
                        <CollectionButton onClick={() => (window.location.href = "/MainPageSessionShelter")}>
                            <img src={logo} alt="Logo" style={{ height: '65px' }} />
                        </CollectionButton>
                    ) : (
                        <CollectionButton onClick={() => (window.location.href = "/")}>
                            <img src={logo} alt="Logo" style={{ height: '65px' }} />
                        </CollectionButton>
                    )}
                    <NavItem>
                        <CollectionButton onClick={() => handleMenuClick('campaigns')}>
                            Zbiórki
                        </CollectionButton>
                        <DropdownMenu isOpen={openMenu === 'campaigns'}>
                            <DropdownItem to="/CreateCampaign">Stwórz zbiórkę</DropdownItem>
                            <DropdownItem to="/ManageCampaigns">Zarządzaj zbiórkami</DropdownItem>
                        </DropdownMenu>
                    </NavItem>

                    <NavItem>
                        <CollectionButton onClick={() => handleMenuClick('board')}>
                            Tablica ogłoszeń
                        </CollectionButton>
                        <DropdownMenu isOpen={openMenu === 'board'}>
                            <DropdownItem to="/AddNews">Dodaj</DropdownItem>
                            <DropdownItem to="/ManageNews">Zarządzaj</DropdownItem>
                        </DropdownMenu>
                    </NavItem>

                    <NavItem>
                        <CollectionButton onClick={() => handleMenuClick('adoption')}>
                            Adopcje
                        </CollectionButton>
                        <DropdownMenu isOpen={openMenu === 'adoption'}>
                            <DropdownItem to="/CreateAdoption">Dodaj</DropdownItem>
                            <DropdownItem to="/ManageAdoption">Zarządzaj</DropdownItem>
                        </DropdownMenu>
                    </NavItem>

                    <NavItem>
                        <CollectionButton onClick={() => handleMenuClick('needs')}>
                            Zamówienia
                        </CollectionButton>
                        <DropdownMenu isOpen={openMenu === 'needs'}>
                            <DropdownItem to="/Orders">Zarządzaj</DropdownItem>
                            <DropdownItem to="/OrdersList">Lista publicznych zamówień</DropdownItem>
                        </DropdownMenu>
                    </NavItem>

                    <NavItem>
                        <CollectionButton onClick={() => handleMenuClick('animals')}>
                            Zwierzęta
                        </CollectionButton>
                        <DropdownMenu isOpen={openMenu === 'animals'}>
                            <DropdownItem to="/addAnimal">Dodaj</DropdownItem>
                            <DropdownItem to="/ManageAnimals">Zarządzaj</DropdownItem>
                        </DropdownMenu>
                    </NavItem>

                    {isLoggedIn ? (
                        <NavItem>
                            <CollectionButton onClick={() => handleMenuClick('MyAccount')}>
                                Moje konto
                            </CollectionButton>
                            <DropdownMenu isOpen={openMenu === 'MyAccount'}>
                                <DropdownItem to="/MyAccountShelter">Moje konto</DropdownItem>
                            </DropdownMenu>
                        </NavItem>
                    ) : (
                        <></>
                    )}
                </NavMenu>

                <NavBtn>
                    {isLoggedIn ? (
                        <NavBtnLink to="/" onClick={handleLogout}>Wyloguj się</NavBtnLink>
                    ) : (
                        <>
                            <NavBarSignLink to="/sign-up">Zarejestruj się</NavBarSignLink>
                            <NavBtnLink to="/signin">Zaloguj się</NavBtnLink>
                        </>
                    )}
                </NavBtn>
            </Nav>
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
};

export default NavbarTopShelter;
