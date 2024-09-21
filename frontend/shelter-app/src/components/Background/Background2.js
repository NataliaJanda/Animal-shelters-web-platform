import React, { Component } from "react";
import "./Background.css";
import VariantButtonGroup from "./BackgroundElement";
import {HeroText2} from "../Navbar/style";

class Background2 extends Component {
    render() {
        const myStyle = {
            height: "10vh",
            // marginTop: "7px",
            fontSize: "50px",
            // backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
        };

        return (
            <>
                <div style={myStyle}>
                    <HeroText2>
                    <h1>Zwierzeta do adopcji</h1>
                        <VariantButtonGroup/>
                    </HeroText2>
                </div>
            </>
        );
    }
}

export default Background2;
