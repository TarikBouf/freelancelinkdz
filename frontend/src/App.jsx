import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobBoard from "./pages/JobBoard";
import JobDetail from "./pages/JobDetail";
import FreelancerProfile from "./pages/FreelancerProfile";
import BusinessDashboard from "./pages/BusinessDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/freelancers/:id" element={<FreelancerProfile />} />
          <Route path="/dashboard" element={<BusinessDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}