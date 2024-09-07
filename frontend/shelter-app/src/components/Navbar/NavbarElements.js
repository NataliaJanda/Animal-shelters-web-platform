// components/MainPage/NavbarElements.js
import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: white;
  height: 50px;
  display: flex;
  justify-content: space-between;
  z-index: 12;
  margin: -8px;
`;

export const NavLink = styled(Link)`
  color: black;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  font-size: 1rem;
  &.active {
    color: #000000;
  }
  @media screen and (max-width: 1024px) {
    font-size: 0.9rem;
  }
  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const Bars = styled(FaBars)`
  color: #808080;
  display: none;
  margin-left: 30px;
  margin-top: -10px;
  @media screen and (max-width: 600px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
  font-family: Arial, Helvetica, sans-serif;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 14px;
  @media screen and (max-width: 600px) {
    display: none;
  }
  font-family: Arial, Helvetica, sans-serif;
`;

export const NavBtnLink = styled(Link)`
    border-radius: 20px;
    display: flex;
    align-items: center;
    background: #bfbfbf;
    padding: 10px 35px;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    margin-left: 24px;
    font-size: 1rem; 

    &:hover {
        background: #ffff;
        color: #000000;
    }

    @media screen and (max-width: 1024px) {
        padding: 8px 28px; 
        font-size: 0.9rem;
    }

    @media screen and (max-width: 768px) {
        padding: 6px 24px;
        font-size: 0.8rem;
    }

    @media screen and (max-width: 480px) {
        padding: 4px 20px;
        font-size: 0.7rem;
        margin-left: 16px;
    }
`;

export const NavBarSignLink = styled(Link)`
  display: flex;
  align-items: center;
  color: black;
  padding: 0 1rem;
  text-decoration: none;
  height: 100%;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
`;

export const NavBarSign = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 50%;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;
