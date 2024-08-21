import "./register.css";
import { useState } from "react";
import { Nav } from "../Navbar/NavbarElements";

const PasswordErrorMessage = () => {
  return (
    <p className="FieldError">Password should have at least 8 characters</p>
  );
};
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({
    value: "",
    isTouched: false,
  });
  const [role, setRole] = useState("role");

  const getIsFormValid = () => {
    return firstName && validateEmail(email) && password.value.length >= 8;
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword({
      value: "",
      isTouched: false,
    });
    setRole("role");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created!");
    clearForm();
  };

  return (
    <Nav>
      <div className="App1">
        <form className="form1" onSubmit={handleSubmit}>
          <fieldset>
            <h2 className="title1">Zarejstruj się</h2>
            <div className="Field">
              <label>
                Imię <sup>*</sup>
              </label>
              <input
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                placeholder="Imię"
              />
            </div>
            <div className="Field">
              <label>Nazwisko</label>
              <input
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                placeholder="Nazwisko"
              />
            </div>
            <div className="Field">
              <label>
                Adres email <sup>*</sup>
              </label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Adres email"
              />
            </div>
            <div className="Field">
              <label>
                Hasło <sup>*</sup>
              </label>
              <input
                value={password.value}
                type="password"
                onChange={(e) => {
                  setPassword({ ...password, value: e.target.value });
                }}
                onBlur={() => {
                  setPassword({ ...password, isTouched: true });
                }}
                placeholder="Hasło"
              />
              {password.isTouched && password.value.length < 8 ? (
                <PasswordErrorMessage />
              ) : null}
            </div>
            {/* <div className="Field">
            <label>
              Role <sup>*</sup>
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="role">Role</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
          </div> */}
            <button
              className="Button1"
              type="submit"
              disabled={!getIsFormValid()}
            >
              <div className="name">Stwórz konto</div>
            </button>
          </fieldset>
        </form>
      </div>
    </Nav>
  );
}

export default Register;
