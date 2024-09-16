import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import { lightGreen } from "@mui/material/colors";

const primaryColor = lightGreen[800];
const hoverColor = lightGreen[500];

export default function VariantButtonGroup() {
    return (
        <Box
            sx={{
                display: "flex",
                position: "absolute",
                top: "80%",
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
                        color: "white",
                        borderColor: "transparent",
                        backgroundColor: primaryColor,
                        borderRadius: "30px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease",
                        backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${hoverColor})`,
                        "&:hover": {
                            backgroundColor: hoverColor,
                            color: "white",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                            transform: "translateY(-3px)",
                        },
                        width: "calc(110px + 10vw)",
                        height: "calc(30px + 3vh)",
                    },
                }}
            >
                <NavLink to="/AdoptDog" style={{ textDecoration: "none" }}>
                    <Button>Adoptuj psa</Button>
                </NavLink>
                <NavLink to="/AdoptCat" style={{ textDecoration: "none" }}>
                    <Button>Adoptuj kota</Button>
                </NavLink>
                <NavLink to="/AdoptOther" style={{ textDecoration: "none" }}>
                    <Button>Adoptuj królika</Button>
                </NavLink>
            </ButtonGroup>
        </Box>
    );
}
