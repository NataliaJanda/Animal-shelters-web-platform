import Navbar from "./components/Navbar/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/Navbar/about.js";
import Register from "./components/SignUp/Register.js";
import Events from "./components/Navbar/events.js";
import Login from "./components/Login/Login.js";
import Tablica from "./components/Navbar/tablica.js";
import Collection from "./components/Navbar/collection.js";
import AdoptDog from "./components/Adopt/AdoptDog.js";

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
      </Routes>
    </Router>
  );
}

export default App;
