import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import Home from './home';
import Login from './login';
import PublicFilePage from './PublicFilePage';
import './App.css';

export const AuthContext = createContext();

const ProtectedRoute = ({ element }) => {
  const { loggedIn } = useContext(AuthContext);
  return loggedIn ? element : <Navigate to="/login" />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);  // State for general errors

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      setLoggedIn(false);
      return;
    }
    fetch("http://localhost:3080/verify", {
      method: "POST",
      headers: { 'jwt-token': user.token }
    })
      .then(r => r.json())
      .then(r => {
        if (r.message === 'success') {
          setLoggedIn(true);
          setEmail(user.email);
        } else {
          setLoggedIn(false);
          localStorage.removeItem("user");
        }
      })
      .catch(err => setError("An error occurred while verifying your session."));
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, email, setEmail }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/files/:fileId" element={<PublicFilePage />} />
          </Routes>
        </BrowserRouter>
        {error && <div className="error-message">{error}</div>}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
