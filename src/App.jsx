import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CreateProfile from "./pages/CreateProfile";
import Dashboard from "./pages/Dashboard";
import Faq from './pages/Faq';

import Login from "./pages/Login"
import Register from "./pages/Register"
import UserScheduling from "./pages/UserScheduling"
import Diagnostic from "./pages/Diagnostic"
import EmailConfirmed from './pages/EmailConfirmed';
import Index from './pages/Index';
import Appointments from './pages/Appointments';
import Modify from './pages/ModifyUser'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/index" element={<Index />} />
        <Route path="/userSchedule" element={<UserScheduling />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/crearPerfiles" element={<CreateProfile />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/faq" element={<Faq/>} />
        <Route path="/diagnostic" element={<Diagnostic/>} />
        <Route path="/Appointments" element={<Appointments/>} />
        <Route path="/confirmar" element={<EmailConfirmed/>} />
        <Route path='/modificar' element={<Modify/>}/>

      </Routes>
    </Router>
  ) 
}

export default App