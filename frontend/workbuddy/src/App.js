// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignUp from "./Components/SignUp";
import WorkerHome from "./Components/WorkerHomePage/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import WorkerRequests from "./Components/Woker Componets/WorkerRequests";

function App() {
  return (
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
          <Route
            path="/worker/requests"
            element={
              <ProtectedRoute>
                <WorkerRequests />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
