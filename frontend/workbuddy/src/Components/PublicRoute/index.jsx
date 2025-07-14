// src/Components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  // If user is already logged in, redirect to home
  return accessToken ? <Navigate to="/worker/home" replace /> : children ;
};

export default PublicRoute;
