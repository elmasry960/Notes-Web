import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import SignUp from "./Components/SignUp/SignUp";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

function App() {
  let navgate = useNavigate();
    let [currentUser, setCurrentUser] = useState(null);

  function chickToken() {
    if (localStorage.getItem("tkn") == null) {
      navgate("/login");
    } else {
      navgate("/profile");
    }
  }

    function decodeToken() {
      let responseDecode = jwtDecode(localStorage.getItem("tkn"));
      setCurrentUser(responseDecode);
    }

    function clearCurrentUser(){
      localStorage.removeItem("tkn");
      setCurrentUser(null)
      navgate("/login");
    }

  useEffect(() => {
    chickToken();

    if (  localStorage.getItem("tkn") != null  ){
      decodeToken();
    }
  }, []);

  return (
    <>
      <Navbar currentUser={currentUser} clrUser={clearCurrentUser} />

      <Routes>
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login decodeToken={decodeToken} />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
