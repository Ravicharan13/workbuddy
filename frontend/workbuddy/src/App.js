import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignUp from "./Components/SignUp";
import WorkerHome from "./Components/WorkerHomePage/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import { UserProvider } from "./context/UserContext";
import WorkerRequests from "./Components/Worker Componets/WorkerRequests";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            {/* Public Route: Login/Signup at root path */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />

            {/* Protected Route: Worker Dashboard */}
            <Route
              path="/worker/home"
              element={
                <ProtectedRoute>
                  <WorkerHome />
                </ProtectedRoute>
              }
            />

            {/* Protected Route: Worker Requests */}
            <Route
              path="/worker/request"
              element={
                <ProtectedRoute>
                  <WorkerRequests />
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
