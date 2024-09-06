import Navbar from "./components/Navbar/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/Navbar/about.js";
import Register from "./components/SignUp/Register.js";
import Events from "./components/Navbar/events.js";
import Login from "./components/Login/Login.js";
import Tablica from "./components/Navbar/tablica.js";
import Collection from "./components/Navbar/collection.js";
import AdoptDog from "./components/Adopt/AdoptDog.js";
import ShelterRegister from "./components/ShelterRegister/ShelterRegister";
import RegisterAccept from "./components/SignUp/RegisterAccept.js";
import NavbarLoginUser from "./components/Navbar/NavbarLoginUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/tablica" element={<Tablica />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/AdoptDog" element={<AdoptDog />} />
        <Route path="/AdoptCat" element={<Collection />} />
        <Route path="/AdoptOther" element={<Collection />} />
        <Route path="/ShelterRegister" element={<ShelterRegister />}/>
        <Route path="/RegisterAccept" element={<RegisterAccept />}/>
        <Route path="/NavbarLoginUser" element={<NavbarLoginUser />}/>
        <Route path="/ShelterRegister" element={<ShelterRegister />}/>
      </Routes>
    </Router>
  );
}

export default App;
