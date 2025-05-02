import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { AuthProvider } from './context/AuthContext';
// import { NotesProvider } from './context/NotesContext';
// import Navbar from './components/Navbar';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import CreateNote from "./pages/CreateNote";
import NoteDetail from "./pages/NoteDetail";
import EditNote from "./pages/EditNote";
// import CreateNote from './pages/CreateNote';
// import EditNote from './pages/EditNote';
// import NoteDetail from './pages/NoteDetail';
// import './styles/index.css';

const App = () => {
  return (
    <Router>
      {/* <AuthProvider> */}
      {/* <NotesProvider> */}
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-note" element={<CreateNote />} />
              <Route path="/edit-note/:id" element={<EditNote />} />
              <Route path="/note/:id" element={<NoteDetail />} />
            </Route>

            {/* Redirect */}
            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
          </Routes>
        </main>
      </div>
      {/* </NotesProvider> */}
      {/* </AuthProvider> */}
    </Router>
  );
};

export default App;
