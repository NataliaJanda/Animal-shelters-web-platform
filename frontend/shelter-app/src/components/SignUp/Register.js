import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {TextField, Button, Container, Typography, Box, Divider} from "@mui/material";
import NavbarTopUnllogin from "../Navbar/NavbarTopUnllogin";
import ShelterFooter from "../Background/ShelterFooter";
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import BackgroundImage from "../Login/lapy.jpg";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import {Link} from "react-router-dom";

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255,0.2)), url(${BackgroundImage})`,
  backgroundSize: '120vh 90vh',
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
}));

// export const validateEmail = (email) => {
//   return String(email)
//       .toLowerCase()
//       .match(
//           /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[a-zA-Z]{2,}))$/
//       );
// };

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({
    value: "",
    isTouched: false,
  });

  const getIsFormValid = () => {
    return username
        // && validateEmail(email)
        && password.value.length >= 8;
  };

  const clearForm = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword({
      value: "",
      isTouched: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      email: email,
      username: username,
      name: firstName,
      lastName: lastName,
      password: password.value,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        clearForm();
        navigate("/RegisterAccept");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
      <>
        <NavbarTopUnllogin/>
        <SignUpContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <Container maxWidth="sm">
              <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                  Zarejestruj się
                </Typography>
              </Box>

              <form onSubmit={handleSubmit} noValidate>
                <Box sx={{ mt: 3 }}>
                  <TextField
                      fullWidth
                      label="Nazwa użytkownika"
                      variant="outlined"
                      margin="normal"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                      fullWidth
                      label="Imię"
                      variant="outlined"
                      margin="normal"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                      fullWidth
                      label="Nazwisko"
                      variant="outlined"
                      margin="normal"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                  />
                  <TextField
                      fullWidth
                      label="Adres email"
                      variant="outlined"
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                      fullWidth
                      label="Hasło"
                      variant="outlined"
                      margin="normal"
                      type="password"
                      value={password.value}
                      onChange={(e) => setPassword({ ...password, value: e.target.value })}
                      onBlur={() => setPassword({ ...password, isTouched: true })}
                      error={password.isTouched && password.value.length < 8}
                      helperText={password.isTouched && password.value.length < 8 ? "Password should have at least 8 characters" : ""}
                  />
                  <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!getIsFormValid()}
                      sx={{ mt: 3 }}
                  >
                    Stwórz konto
                  </Button>
                </Box>
                <Divider>
                  <Typography sx={{ color: 'text.secondary' }}>lub</Typography>
                </Divider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 , mt:2}}>
                  <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                      startIcon={<FaGoogle />}
                  >
                    Zarejestruj się z Google
                  </Button>
                  <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/facebook"}
                      startIcon={<FaFacebook />}
                  >
                    Zarejestruj się z Facebook
                  </Button>
                  <Typography sx={{ textAlign: 'center' }}>
                    Masz już konto?{' '}
                    <Link
                        href="/signin"
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                    >
                      Zaloguj się
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Container>
          </Card>
        </SignUpContainer>
        <ShelterFooter/>
      </>
  );
}

export default Register;
