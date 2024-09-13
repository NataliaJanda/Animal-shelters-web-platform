import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import { lightGreen } from "@mui/material/colors";

const color = lightGreen[700];
const color2 = lightGreen[400];

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
                borderColor: "white",
                backgroundColor: color,
                "&:hover": {
                    backgroundColor: color2,
                },
                width: "calc(110px + 10vw)",
                height: "calc(30px + 3vh)",
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
