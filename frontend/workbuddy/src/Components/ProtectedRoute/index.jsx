import { Navigate } from "react-router-dom";
import { getRole } from "../SignUp/auth";

const ProtectedRoute = ({ children,role }) => {
  const accessToken = localStorage.getItem("accessToken");
  const currentRole = getRole();
  if (currentRole!==role){
    return <Navigate to="/unauthorized" />;
  }
  if (!accessToken) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;
 