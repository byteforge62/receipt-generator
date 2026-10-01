import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ReceiptForm from "./components/ReceiptForm";
import Receipt from "./components/Receipt";
import ReceiptPage from "./components/ReceiptPage";
import IDCardPage from "./components/idcard/IDCardPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        {/* ── Top Navigation Bar ───────────────────────────────────── */}
        <nav
          className="no-print"
          style={{
            background: "#111111",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            minHeight: 56,
          }}
        >
          {/* Logo / brand */}
          <span
            style={{
              color: "#FFD700",
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: 1,
              marginRight: 16,
              fontFamily: "'Arial Black', Arial, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            VSA &amp; DBSC
          </span>

          {/* Nav links */}
          <NavLink
            to="/"
            end
            id="nav-receipt"
            style={({ isActive }) => ({
              color: isActive ? "#FFD700" : "#cccccc",
              textDecoration: "none",
              fontWeight: isActive ? 700 : 500,
              fontSize: 14,
              padding: "6px 14px",
              borderRadius: 8,
              background: isActive ? "rgba(255,215,0,0.12)" : "transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            })}
          >
            🧾 Receipt Generator
          </NavLink>

          <NavLink
            to="/id-card"
            id="nav-idcard"
            style={({ isActive }) => ({
              color: isActive ? "#FFD700" : "#cccccc",
              textDecoration: "none",
              fontWeight: isActive ? 700 : 500,
              fontSize: 14,
              padding: "6px 14px",
              borderRadius: 8,
              background: isActive ? "rgba(255,215,0,0.12)" : "transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            })}
          >
            🪪 Player ID Card
          </NavLink>
        </nav>

        {/* ── Routes ──────────────────────────────────────────────── */}
        <div className="py-10 px-4">
          <div className="max-w-6xl mx-auto space-y-10">
            <Routes>
              {/* Existing receipt routes — unchanged */}
              <Route path="/" element={<ReceiptForm />} />
              <Route path="/receipt" element={<ReceiptPage />} />

              {/* New ID card route */}
              <Route path="/id-card" element={<IDCardPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}