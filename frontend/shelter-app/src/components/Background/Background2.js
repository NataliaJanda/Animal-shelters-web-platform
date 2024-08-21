import React, { Component } from "react";
// import background from "./image.png";
import "./Background.css";
import VariantButtonGroup from "./BackgroundElement";

class Background2 extends Component {
    render() {
        const myStyle = {
            // backgroundImage: `url(${background})`,
            height: "120vh",
            marginTop: "7px",
            fontSize: "50px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
        };

        return (
            <>
                <div style={myStyle}>
                    <div className="title">
                        <VariantButtonGroup/>
                    </div>
                </div>
            </>
        );
    }
}

export default Background2;
