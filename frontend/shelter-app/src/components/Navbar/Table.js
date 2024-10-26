import React from "react";
import NavbarTopLoginSession from "./NavbarTopUnllogin";

const Table = () => {
  return (
      <>
          <NavbarTopLoginSession />
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
