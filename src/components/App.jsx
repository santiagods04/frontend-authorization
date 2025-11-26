import {useState, useEffect} from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/App.css";
import * as auth from '../utils/auth';
import {setToken, getToken} from '../utils/token';
import * as api from '../utils/api';

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
    }) => {
    if (password === confirmPassword) {
      auth.register(username, password, email)
       .then((data) => {
          // TODO: maneja el registro exitoso
          navigate("/login");
          console.log('Registration successful:', data);
        })
        .catch(console.error);
    }
  };

  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }    
    
    auth.authorize(username, password)
    .then((data) => {
      if (data.jwt) {
        setToken(data.jwt);      // guardar el token en localStorage
        setUserData(data.user);  // guardar los datos de usuario en el estado
        setIsLoggedIn(true);     // inicia la sesión del usuario
        navigate("/ducks");      // enviarlo a /ducks
      } 
    })
    .catch(console.error);
  };
  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }
     
    api.getUserInfo(jwt)
    .then(({ username, email }) => {
      // si la respuesta es exitosa, inicia la sesión del usuario, guarda sus
      // datos en el estado y lo dirige a /ducks.
      setIsLoggedIn(true);
      setUserData({ username, email });
      navigate("/ducks");
    })
    .catch(console.error);
  }, []);

  return (
    <Routes>
      <Route path="/ducks" element={
        <ProtectedRoute isLoggedIn={isLoggedIn}><Ducks /></ProtectedRoute>
      } />
      <Route path="/my-profile" element={
        <ProtectedRoute isLoggedIn={isLoggedIn}><MyProfile userData={userData} /></ProtectedRoute>
      } />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin}/>
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration}/>
          </div>
        }
      />
      <Route path="*" element={
        isLoggedIn ? <Navigate to="/ducks" replace /> : <Navigate to="/login" replace/>
      } />
    </Routes>
  );
}

export default App;
