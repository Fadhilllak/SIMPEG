import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "@/app/page";
import PegawaiPage from "@/app/pegawai/page";
import PengaturanPage from "@/app/pengaturan/page";
import LoginPage from "@/app/form login/login"; // Import halaman Login
import KarirPage from "@/components/pegawai/page";
import { Toaster } from "@/components/ui/toaster";
import PegawaiList from "@/components/pegawai/PegawaiList";
import { ProtectedRoute } from "@/components/auth/protected-route";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Halaman Dashboard */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        
        {/* Halaman Pegawai */}
        <Route path="/pegawai" element={<ProtectedRoute><PegawaiPage /></ProtectedRoute>} />

        {/* Halaman Pegawai (API demo) */}
        <Route path="/pegawai-api" element={<ProtectedRoute><PegawaiList /></ProtectedRoute>} />

        {/* Halaman Karir */}
        <Route path="/karir" element={<ProtectedRoute><KarirPage /></ProtectedRoute>} />

        {/* Halaman Pengaturan */}
        <Route path="/pengaturan" element={<ProtectedRoute><PengaturanPage /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;