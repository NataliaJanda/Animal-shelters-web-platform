// SideBar.js
import React from 'react';
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

const SideBarWithMenu = ({ isOpen, toggleSidebar }) => {
    return (
        <SidebarContainer isOpen={isOpen}>
            <CloseButton onClick={toggleSidebar}>×</CloseButton>
            <SidebarLink to="/" onClick={toggleSidebar}>Menu</SidebarLink>
        </SidebarContainer>
    );
};

export default SideBarWithMenu;
