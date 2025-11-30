import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import "./Navbar.css"; // we'll create this next


function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-container">
        {/* Left Side – Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-text">EmployPilot</Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link to="/" className="nav-item">Dashboard</Link>
          <Link to="/pricing" className="nav-item">Pricing</Link>
          <Link to="/contact" className="nav-item">Contact</Link>


          {/* PRO Community */}
          <Link to="/community" className="nav-item">
            Community
            <span className="pro-badge">PRO</span>
          </Link>

          {/* Auth Buttons */}
          {user ? (
            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/auth" className="nav-item">Login</Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-item" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/pricing" className="mobile-item" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>
          <Link to="/contact" className="mobile-item" onClick={() => setMenuOpen(false)}>
  Contact
</Link>

          <Link to="/community" className="mobile-item" onClick={() => setMenuOpen(false)}>
            Community <span className="pro-badge">PRO</span>
          </Link>

          {user ? (
            <button
              className="mobile-logout"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" className="mobile-item" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
