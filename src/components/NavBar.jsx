import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";
import { useContext } from "react";
import AppContext from "../context/AppConntext";
import Logo from "./Logo";
import "./styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AppContext);

  const signOut = () => {
    removeToken();
    navigate("/login");
    setIsLoggedIn(false);
  }

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo />
      </div>
      <ul className="navbar__nav">
        <li>
          <NavLink to="/ducks" className="navbar__link">
            Patos
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-profile" className="navbar__link">
            Mi perfil
          </NavLink>
        </li>
        <li>
          <button onClick={signOut} className="navbar__link navbar__button">Cerrar sesión</button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
