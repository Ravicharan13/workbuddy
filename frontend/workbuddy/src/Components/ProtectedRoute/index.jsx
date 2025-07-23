// import { Navigate } from "react-router-dom";
// import { useRole } from "../SignUp/auth";

// const ProtectedRoute = ({ children,role }) => {

//   const currentRole = useRole();
//   if (currentRole.role !== role && currentRole.role){
//     return <Navigate to="/unauthorized" />;
//   }

//   return children;
// };

// export default ProtectedRoute;

// {/* <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
//          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
//        <span className="ml-3">Verifying access...</span>
//        </div> */}



import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

const ProtectedRoute = ({ children, role }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/me", {
          withCredentials: true, // ✅ sends the cookie
        });

        setIsAuthenticated(true);
        console.log(response)
        setCurrentRole(response.data.role); // adjust according to backend response
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return  <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>;

  if (!isAuthenticated) {
    if(currentRole === "worker"){
      return  <Navigate to="/worker/home" replace />;
    }else{
       return <Navigate to="/customer/home" replace />;
    }
  }

  if (role && currentRole !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
