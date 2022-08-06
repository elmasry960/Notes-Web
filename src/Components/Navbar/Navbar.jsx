import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ currentUser, clrUser }) {
  let navgate = useNavigate();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand text-white" href="#">
            {" "}
            <i className="far fa-sticky-note"></i> Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-white"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Login
                </a>
                <ul
                  className="dropdown-menu bg-dark"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {currentUser == null ? <>
                      <li>
                        <NavLink
                          className="dropdown-item text-white"
                          to="login"
                        >
                          Login
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item text-white"
                          to="signup"
                        >
                          Signup
                        </NavLink>
                      </li>
                    </> : ''}
                  {currentUser == null ? '' : <li>
                    <NavLink
                      onClick={clrUser}
                      className="dropdown-item text-white"
                      to="login"
                    >
                      Sign Out
                    </NavLink>
                  </li>}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
