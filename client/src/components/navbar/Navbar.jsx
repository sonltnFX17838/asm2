import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./navbar.css";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  const session = localStorage.getItem("session");

  useEffect(() => {
    axios
      .get("http://localhost:5000/isloggedin", {
        headers: { Authorization: session },
      })
      .then((response) => {
        if (response.data.message) {
          return;
        } else {
          setUser(response.data.username);
        }
      });
  }, [session]);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/logout", null, {
        headers: { Authorization: session },
      })
      .then((response) => {
        if (response.data.message) {
          return;
        } else {
          setUser(false);
          localStorage.removeItem("session");
          navigate("/home");
        }
      });
  };

  const handleGoLoginPage = () => {
    navigate("/login");
  };
  const handleGoSignUpPage = () => {
    navigate("/sign-up");
  };
  const handleTransactions = () => {
    navigate("/transactions");
  };

  let content = (
    <div className="navItems">
      <button className="navButton" onClick={handleGoSignUpPage}>
        Sign Up
      </button>
      <button className="navButton" onClick={handleGoLoginPage}>
        Login
      </button>
    </div>
  );

  if (user) {
    content = (
      <div className="navItems" style={{ display: "flex" }}>
        <p>{user}</p>
        <button className="navButton" onClick={handleTransactions}>
          Transactions
        </button>
        <button className="navButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <span
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Booking Website
        </span>
        {content}
      </div>
    </div>
  );
};

export default Navbar;
