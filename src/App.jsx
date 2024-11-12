import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CreateProfile from "./pages/CreateProfile"
import Dashboard from "./pages/Dashboard"
import Faq from './pages/Faq';
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserScheduling from "./pages/UserScheduling"
import Diagnostic from "./pages/Diagnostic"
import EmailConfirmed from './pages/EmailConfirmed';
import Index from './pages/Index';

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
        <Route path="/confirmar" element={<EmailConfirmed/>} />
      </Routes>
    </Router>
  ) 
}

export default App