import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../context/AppConntext";

function ProtectedRoute({  children, anonymous = false }) {
  // Invoca el hook useLocation y accede al valor de la propiedad
  // 'from' de su objeto state. Si no existe la propiedad 'from'
  // se utilizará por defecto "/".
  const location = useLocation();
  const from = location.state?.from || "/";

  const { isLoggedIn } = useContext(AppContext);

   // Si el usuario ha iniciado la sesión le redirigimos fuera de nuestras
  // rutas anónimas.
  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  if (!anonymous && !isLoggedIn) {
    // Mientras redirigimos a /login establecemos los objetos location
      // la propiedad state.from para almacenar el valor de la ubicación actual.
      // Esto nos permite redirigirles correctamente después de que
      // inicien sesión.
    return <Navigate to="/login" state={{ from: location }} />;
  }
    
  // De otra forma, renderiza el componente hijo de la ruta protegida.
  return children;
}

export default ProtectedRoute;