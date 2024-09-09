import React from "react";
import NavbarTopUnlogin from "./NavbarTopUnllogin";

const Table = () => {
  return (
      <>
          <NavbarTopUnlogin />
          <div
              style={{
                  display: "flex",
                  justifyContent: "centre",
                  alignItems: "centre",
                  height: "100vh",
              }}
          >
              <h1>Pieski.</h1>
          </div>
      </>

  );
};

export default Table;
