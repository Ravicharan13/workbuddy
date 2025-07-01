import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignUp from "./Components/SignUp";
import WorkerHome from "./Components/WorkerHomePage/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import { UserProvider } from "./context/UserContext";
import WorkerRequests from "./Components/WorkerComponents/WorkerRequests"; // ✅ FIXED PATH
import WorkerProfileUpdate from "./Components/WorkerProfileUpdate"
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
                  <SignUp />
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
              path="/worker/request"
              element={
                <ProtectedRoute>
                  <WorkerRequests />
                </ProtectedRoute>
              }
            />

             <Route
              path="/worker/update"
              element={
                <ProtectedRoute>
                  <WorkerProfileUpdate />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
