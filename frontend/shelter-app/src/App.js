import MainPage from "./components/Navbar/MainPage.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/Navbar/about.js";
import Register from "./components/SignUp/Register.js";
import Events from "./components/Navbar/Events.js";
import Login from "./components/Login/Login.js";
import Table from "./components/Navbar/Table.js";
import Campaigns from "./components/Navbar/Campaigns.js";
import AdoptDog from "./components/Adopt/AdoptDog.js";
import ShelterRegister from "./components/ShelterRegister/ShelterRegister";
import RegisterAccept from "./components/SignUp/RegisterAccept.js";
import MainPageSessionUser from "./components/MainPage/MainPageSessionUser";
import ShelterRegisterAccept from "./components/SignUp/SheterRegisterAccept";
import MainPageSessionShelter from "./components/MainPage/MainPageSessionShelter";
import CreateCampaign from "./components/ShelterComponents/Campaigns/CreateCampaign";
import ManageCampaigns from "./components/ShelterComponents/Campaigns/ManageCampaigns";
import AddAnimal from "./components/ShelterComponents/Animal/AddAnimal"
import Animals from "./components/Navbar/Animals"
import ManageAnimals from "./components/ShelterComponents/Animal/ManageAnimals";
import CreateAdoption from "./components/ShelterComponents/Adoption/CreateAdoption";
import ManageAdoptions from "./components/ShelterComponents/Adoption/ManageAdoption";
import ManageNews from "./components/ShelterComponents/News/ManageNews";
import AddNews from "./components/ShelterComponents/News/AddNews";
import MyAccount from "./components/ShelterComponents/MyAccount";
import AdoptCat from "./components/Adopt/AdoptCat";
import AdoptRabbit from "./components/Adopt/AdoptRabbit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/tablica" element={<Table />} />
        <Route path="/collection" element={<Campaigns />} />
        <Route path="/AdoptDog" element={<AdoptDog />} />
        <Route path="/AdoptCat" element={<AdoptCat />} />
        <Route path="/AdoptRabbit" element={<AdoptRabbit />} />
        <Route path="/ShelterRegister" element={<ShelterRegister />}/>
        <Route path="/RegisterAccept" element={<RegisterAccept />}/>
        <Route path="/MainPageSessionUser" element={<MainPageSessionUser />}/>
        <Route path="/ShelterRegister" element={<ShelterRegister />}/>
        <Route path="/ShelterRegisterAccept" element={<ShelterRegisterAccept />}/>
        <Route path="/MainPageSessionShelter" element={<MainPageSessionShelter />}/>
        <Route path="/CreateCampaign" element={<CreateCampaign />}/>
        <Route path="/ManageCampaigns" element={<ManageCampaigns/>}/>
        <Route path="/addAnimal" element={<AddAnimal/>}/>
        <Route path="/animals" element={<Animals/>}/>
        <Route path="/ManageAnimals" element={<ManageAnimals/>}/>
        <Route path="/CreateAdoption" element={<CreateAdoption/>}/>
        <Route path="/ManageAdoption" element={<ManageAdoptions/>}/>
        <Route path="/ManageNews" element={<ManageNews/>}/>
        <Route path="/AddNews" element={<AddNews/>}/>
        <Route path="/MyAccount" element={<MyAccount/>}/>
      </Routes>
    </Router>
  );
}

export default App;
