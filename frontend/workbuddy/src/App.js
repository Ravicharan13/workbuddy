// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
// import SignUp from "./Components/SignUp";
import WorkerHome from "./Components/WorkerHomePage/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import { UserProvider } from "./context/UserContext";
import WorkerRequests from "./Components/WorkerComponents/WorkerRequests"; // ✅ FIXED PATH
import WorkerAuthPage from "./Components/SignUp/WorkerAuthPage";
import CustomerAuthPage from "./Components/SignUp/CustomerAuthPage";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ForgotPasswordPage from "./Components/SignUp/WorkerForgotPasswordPage";
import ForgotPasswordPageCust from "./Components/SignUp/CustomerForgotPasswordPage";
import WorkerProfileUpdate from "./Components/WorkerProfileUpdate"
import CustomerHome from "./Components/Customer/Home/Home"
import BrowseServicesPage from "./Components/Customer/Services/BrowseServicesPage";
import TrackRequestPage from "./Components/Customer/Services/TrackRequestPage";


function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <CustomerAuthPage/>
                </PublicRoute>
              }
            />
            <Route
              path="/workerauth"
              element={
                <PublicRoute>
                  <WorkerAuthPage />
                </PublicRoute>
              }
            />
            <Route
              path="/customerauth"
              element={
                <PublicRoute>
                  <CustomerAuthPage />
                </PublicRoute>
              }
            />
            <Route
              path="/worker/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />
            <Route
              path="/customer/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordPageCust />
                </PublicRoute>
              }
            />
            <Route
              path="/worker/home"
              element={
                <ProtectedRoute>
                  <WorkerHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/requests"
              element={
                <ProtectedRoute>
                  <WorkerRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/profile-update"
              element={
                <ProtectedRoute>
                  <WorkerProfileUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/home"
              element={
                <ProtectedRoute>
                  <CustomerHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/services"
              element={
                <ProtectedRoute>
                  <BrowseServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/service/track-request"
              element={
                <ProtectedRoute>
                  <TrackRequestPage />
                </ProtectedRoute>
              }
            />
            
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </UserProvider>
    
  );
}

export default App;