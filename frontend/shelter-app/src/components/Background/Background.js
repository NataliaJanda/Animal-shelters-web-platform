import React, { Component } from "react";
import background from "./image.png";
import "./Background.css";
import ShelterRegisterButton from "../ShelterRegister/ShelterRegisterButton";

class Background extends Component {
  render() {
    const myStyle = {
      backgroundImage: `url(${background})`,
      height: "63vh",
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
                    <ShelterRegisterButton/>
                </div>
            </div>
        </>
    );
  }
}

export default Background;
