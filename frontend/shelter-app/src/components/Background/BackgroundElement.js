import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import { lightGreen } from "@mui/material/colors";

const color = lightGreen[800];
const color2 = lightGreen[700];

export default function VariantButtonGroup() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
            fontSize: "1.9rem",
            color: "white",
            borderColor: "white",
            colorInterpolation: "white",
            backgroundColor: color,
            colorAdjust: "white",
            colorRendering: color2,
            colorScheme: color2,
          },
        }}
      >
        <NavLink to="/AdoptDog">
          <Button>Adoptuj psa</Button>
        </NavLink>
        <NavLink to="/AdoptCat">
          <Button>Adoptuj kota</Button>
        </NavLink>
        <NavLink to="/AdoptOther">
          <Button>Adoptuj królika</Button>
        </NavLink>
      </ButtonGroup>
    </Box>
  );
}
