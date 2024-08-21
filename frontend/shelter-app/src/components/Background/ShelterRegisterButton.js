import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import { lightGreen } from "@mui/material/colors";

const color = lightGreen[700];
const color2 = lightGreen[400];

export default function ShelterRegisterButton() {
    return (
        <Box
            sx={{
                display: "flex",
                position: "absolute",
                top: "45%",
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
                        fontSize: "calc(0.4rem + 1vw)",
                        color: "white",
                        borderColor: "white",
                        backgroundColor: color,
                        "&:hover": {
                            backgroundColor: color2,
                        },
                        width: "calc(160px + 10vw)",
                        height: "calc(50px + 3vh)",
                    },
                }}
            >
                <NavLink to="/AdoptDog">
                    <Button>Zarejestruj swoje schronisko!</Button>
                </NavLink>
            </ButtonGroup>
        </Box>
    );
}
