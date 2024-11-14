import React from "react";
import NavbarTopLoginSession from "./NavbarTopUnllogin";
import {
    AppContainer,
    ContentSection,
    HeroOverlay,
    HeroSection,
    HeroText, SectionText,
    SectionTitle
} from "./style";
import ShelterFooter from "../Background/ShelterFooter";

const About = () => {
    return (
        <AppContainer>
            <NavbarTopLoginSession />
            <HeroSection>
                <HeroOverlay>
                    <HeroText>
                        <h1>Kim jesteśmy</h1>
                        <p>
                            Aplikacja ta ma na celu uporządkowanie informacji o wszystkich organizacjach
                            w jednym miejscu, aby schroniska oraz osoby zainteresowane mogły łatwo znaleźć po trzebne informacje.                        </p>
                    </HeroText>
                </HeroOverlay>
            </HeroSection>

            <ContentSection>
                <SectionTitle>Nasza Misja</SectionTitle>
                <SectionText>
                    Naszym celem jest dostarczanie wysokiej jakości usług i produktów, które spełniają oczekiwania naszych klientów. Działamy z pasją i zaangażowaniem, tworząc wartościowe relacje z naszą społecznością.
                </SectionText>
            </ContentSection>

            <ShelterFooter/>
        </AppContainer>
    );
};

export default About;
