// pages/events.js

import React from "react";
import NavbarTop from "./NavbarTop";

const Events = () => {
  return (
      <>
          <NavbarTop />
          <div
              style={{
                  display: "flex",
                  justifyContent: "centre",
                  alignItems: "centre",
                  height: "100vh",
              }}
          >
              <h1>Pieski</h1>
          </div>
      </>

  );
};

export default Events;
