import React from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const FooterContainer = styled(Box)(({ theme }) => ({
    backgroundColor: "#f8f9fa",
    padding: theme.spacing(4, 0),
    borderTop: "1px solid #e0e0e0",
    position: "relative",
    bottom: 0,
    width: "100%",
}));

const SocialIconsContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2),
    },
}));

const StyledIconButton = styled(IconButton)(({theme }) => ({
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        transform: "scale(1.1)",
        backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&:focus": {
        outline: "2px solid #1976d2",
        outlineOffset: "2px",
    },
}));

const ShelterFooter = () => {
    const socialLinks = [
        {
            icon: <FaInstagram size={24} />,
            label: "Follow us on Instagram",
            url: "https://instagram.com/",
        },
        {
            icon: <FaFacebook size={24} />,
            label: "Connect with us on Facebook",
            url: "https://facebook.com",
        },
        {
            icon: <FaTwitter size={24} />,
            label: "Follow us on Twitter",
            url: "https://twitter.com",
        },
    ];

    return (
        <FooterContainer component="footer">
            <Container maxWidth="lg">
                <Box textAlign="center" mb={3}>
                    <Typography variant="h6" gutterBottom>
                        Skontaktuj się z nami
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Bądź na bierząco
                    </Typography>
                </Box>
                <SocialIconsContainer>
                    {socialLinks.map((link, index) => (
                        <StyledIconButton
                            key={index}
                            aria-label={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="large"
                            color="primary"
                        >
                            {link.icon}
                        </StyledIconButton>
                    ))}
                </SocialIconsContainer>
                <Box mt={3} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Shelter App. Wszystkie prawa zastrzeżone.
                    </Typography>
                </Box>
            </Container>
        </FooterContainer>
    );
};

export default ShelterFooter;