import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Typography from "@mui/material/Typography";
import { FaUser } from "react-icons/fa6";


function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setSidebarOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4" style={{ background: "linear-gradient(135deg, #0a3a82, #0f62c5)",paddingTop:"13px",paddingBottom:"13px" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            ServNex
          </Link>
        </Typography>

        <div className="ms-auto d-flex align-items-center gap-2">
          {!isLoggedIn && (
            <>
              <Link to="/login">
                <Button variant="outline-light">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="light" style={{ color: " #0a3a82"}}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <Button
              className="btn bg-white"
              onClick={toggleSidebar}
            >
              <FaUser size={16} style={{ color: " #0a3a82"}}/>
            </Button>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className="position-fixed top-0 end-0 vh-100 bg-dark text-white d-flex flex-column justify-content-between"
        style={{
          width: "300px",
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050,
        }}
      >
        <div>
          <div className="p-3 border-bottom">
            <h5 className="mb-0 fs-6">Menu</h5>
          </div>

          <nav className="nav flex-column p-4 gap-3 fs-6">
            <Link className="nav-link text-white" to="/" onClick={toggleSidebar}>
              Home
            </Link>
            {/* [NEW] My Bookings Link */}
            <Link className="nav-link text-white" to="/my-bookings" onClick={toggleSidebar}>
              My Bookings
            </Link>
            <Link
              className="nav-link text-white"
              to="/services"
              onClick={toggleSidebar}
            >
              Services
            </Link>
            <Link
              className="nav-link text-white"
              to="/about"
              onClick={toggleSidebar}
            >
              About Us
            </Link>
            <Link
              className="nav-link text-white"
              to="/help"
              onClick={toggleSidebar}
            >
              Help & Support
            </Link>

            <hr className="bg-secondary" />

            {/* <Link
              className="btn text-white w-75 fs-6"
              to="/list-business"
              onClick={toggleSidebar}
              style={{ background: "linear-gradient(135deg, #0a3a82, #0f62c5)"}}
            >
              List Your Business
            </Link> */}
          </nav>
        </div>

        <div className="p-3 mb-4">
          <Button variant="danger" className="w-50" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Header;
