import React, { Component } from "react";
import background from "./image.png";
import "./Background.css";
import VariantButtonGroup from "./BackgroundElement";

class Background extends Component {
  render() {
    const myStyle = {
      backgroundImage: `url(${background})`,
      height: "60vh",
      marginTop: "7px",
      fontSize: "50px",
      backgroundSize: "cover",
      // backgroundRepeat: "no-repeat",
    };

    return (
      <>
        <div style={myStyle}>
          <div className="title">
            <VariantButtonGroup />
          </div>
        </div>
      </>
    );
  }
}

export default Background;
