import React from 'react';
import "./Navbar.css";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

    

    const isLoggedIn = !!localStorage.getItem('username'); // Check login status

    const navigate = useNavigate();

    const handleLogout = ()=>{
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login")
    alert("Logged Out Successfully...")
  }
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
      <div className="navbar-left">OBP</div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
          <button className="nav-button" onClick={() => {navigate("/")}}>Home</button>
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
          </>
        ) : (
          <>
            <button className="nav-button" onClick={() => {navigate("/")}}>Home</button>
            <button className="nav-button" onClick={() => {navigate('/login')}}>
              Login
            </button>
            <button className="nav-button" onClick={() => {navigate('/register')}}>
              Register
            </button>
          </>
        )}
      </div>
      </nav>
    </>
  );
}
