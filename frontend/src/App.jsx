import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  return (
    <Routes>
      {/* Default */}
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/profile" /> : <Navigate to="/login" />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/profile" />
          ) : (
            <Login onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          isLoggedIn ? (
            <Navigate to="/profile" />
          ) : (
            <Signup />
          )
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          isLoggedIn ? <Profile /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;
