import styled from "styled-components";
import background from "./image.png";

export const HeroSection = styled.div`
    background-image: url(${background});
    background-size: cover;
    background-position: center;
    margin-top: 8px;
    height: 80vh;
    position: relative;
    display: flex;
`;

export const HeroOverlay = styled.div`
    border-bottom: 10px solid rgb(255, 255, 255);
    padding-top: 7px;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
`;

export const HeroText = styled.div`
    text-align: center;
    h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    p {
        font-size: 1.5rem;
        max-width: 600px;
    }
`;

export const ContentSection = styled.section`
    padding: 4rem 2rem;
    background-color: #f9f9f9;
    text-align: center;
`;

export const SectionTitle = styled.h2`
    font-size: 2.5rem;
    margin-bottom: 1rem;
`;

export const SectionText = styled.p`
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
    color: #333;
`;

export const CollectionGridSection = styled.section`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 4rem 2rem;
    background-color: #fff;
    @media (min-width: 600px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const CollectionCard = styled.div`
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s;
    min-height: 350px;

    &:hover {
        transform: translateY(-10px);
    }
`;

export const CollectionImage = styled.img`
    width: 100%;
    height: 350px;
    object-fit: cover;
`;

export const CollectionInfo = styled.div`
    padding: 1.5rem;
    text-align: center;
`;

export const CollectionTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
`;

export const CollectionGoal = styled.p`
    font-size: 1rem;
    color: #888;
    margin-bottom: 1rem;
`;

export const CollectionDescription = styled.p`
    font-size: 1.1rem;
    color: #555;
`;

export const Footer = styled.footer`
    background-color: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
`;

export const FooterText = styled.p`
    margin: 0;
    font-size: 1rem;
`;