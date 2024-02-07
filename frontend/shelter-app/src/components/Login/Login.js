import "./Login.css";
import { useState } from "react";
import { Nav } from "../Navbar/NavbarElements";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit");
  };

  const getIsFormValid = () => {
    return username && password;
  };
  return (
    <Nav>
      <div className="App">
        <form onSubmit={handleSubmit} className="form__container">
          <h2>Login</h2>
          <div className="form__controls">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form__controls">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="Button2"
            type="submit"
            disabled={!getIsFormValid()}
          >
            Login
          </button>
        </form>
      </div>
    </Nav>
  );
}
