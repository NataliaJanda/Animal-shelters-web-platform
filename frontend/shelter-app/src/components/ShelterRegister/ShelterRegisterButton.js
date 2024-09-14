import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import { lightGreen } from "@mui/material/colors";

const primaryColor = lightGreen[700];
const hoverColor = lightGreen[400];

export default function ShelterRegisterButton() {
    return (
        <Box
            sx={{
                display: "flex",
                position: "absolute",
                top: "63%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                "& > *": {
                    m: 1,
                },
            }}
        >
            <ButtonGroup
                variant="outlined"
                aria-label="Basic button group"
                sx={{
                    "& .MuiButton-root": {
                        fontSize: "calc(0.5rem + 1vw)",
                        color: primaryColor,
                        borderColor: "transparent",
                        backgroundColor: "white",
                        borderRadius: "50px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease",
                        backgroundImage: `linear-gradient(135deg, white 10%, ${primaryColor} 100%)`,
                        "&:hover": {
                            backgroundColor: hoverColor,
                            color: "white",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                            transform: "translateY(-3px)",
                        },
                        width: "calc(180px + 10vw)",
                        height: "calc(60px + 3vh)",
                    },
                }}
            >
                <NavLink to="/ShelterRegister" style={{ textDecoration: "none" }}>
                    <Button>Zarejestruj swoje schronisko!</Button>
                </NavLink>
            </ButtonGroup>
        </Box>
    );
}
