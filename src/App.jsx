import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Appointments from "./pages/Appointments"
import CreateProfile from "./pages/CreateProfile"
import Dashboard from "./pages/Dashboard"
import Info from "./pages/Info"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserScheduling from "./pages/UserScheduling"
// import Home from './pages/Home';
import NavBar from './pages/NavBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/userSchedule" element={<UserScheduling />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crearPerfiles" element={<CreateProfile />} />
      </Routes>
    </Router>
  ) 
}

export default App