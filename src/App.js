import styles from "./App.module.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import Discover from "./components/Discover/Discover";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import About from "./components/About/About";
import CommunityRecipes from "./components/CommunityRecipes/CommunityRecipes";
import AddRecipe from "./components/AddRecipe/AddRecipe";
import UserManagement from "./components/UserManagement/UserManagement";
import DiscoverSingleCoffee from "./components/Discover/DiscoverSingleCoffee";

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Not logged in");
      })
      .then((data) => {
        setAuth(data);
      })
      .catch(() => {
        setAuth(null);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:8080/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuth(null);
  };

  return (
    <Router>
      <Navigation auth={auth} handleLogout={handleLogout} />
      <Routes>
        <Route path="/discover" element={<Discover />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/community-recipes" element={<CommunityRecipes />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route
          path="/userManagement"
          element={<UserManagement auth={auth} />}
        />
        <Route path="/coffee/:id" element={<DiscoverSingleCoffee />} />
      </Routes>
    </Router>
  );
}

export default App;