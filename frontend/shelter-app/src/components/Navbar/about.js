import React from "react";
import background from "./image.png";

import styled from "styled-components";
import NavbarTopUnlogin from "./NavbarTopUnllogin";

const About = () => {
    return (
        <>
            <NavbarTopUnlogin />
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

            <TeamSection>
                <SectionTitle>Nasz Zespół</SectionTitle>
                <TeamGrid>
                    <TeamMember>
                        <MemberImage src="https://via.placeholder.com/150" alt="Członek zespołu" />
                        <MemberName>xxxxxxx</MemberName>
                        <MemberPosition>xxx</MemberPosition>
                    </TeamMember>
                    <TeamMember>
                        <MemberImage src="https://via.placeholder.com/150" alt="Członek zespołu" />
                        <MemberName>xxxxxxx</MemberName>
                        <MemberPosition>xxx</MemberPosition>
                    </TeamMember>
                    <TeamMember>
                        <MemberImage src="https://via.placeholder.com/150" alt="Członek zespołu" />
                        <MemberName>xxxxxxx</MemberName>
                        <MemberPosition>xxx</MemberPosition>
                    </TeamMember>
                </TeamGrid>
            </TeamSection>

            <Footer>
                <FooterText>© 2024 Wszelkie prawa zastrzeżone.</FooterText>
            </Footer>
        </>
    );
};

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
    background-color: #f3f3f3;
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

export const TeamSection = styled.section`
  padding: 4rem 2rem;
  background-color: #fff;
  text-align: center;
`;

export const TeamGrid = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

export const TeamMember = styled.div`
  flex: 1;
  max-width: 300px;
  margin: 1rem;
  text-align: center;
`;

export const MemberImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 1rem;
`;

export const MemberName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const MemberPosition = styled.p`
  font-size: 1.2rem;
  color: #666;
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

export default About;
