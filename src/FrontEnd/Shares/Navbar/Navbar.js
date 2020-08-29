import React, { useState, useCallback, useContext } from "react";
import SideNavBar from "../SideNavBar/SideNavBar";
import Background from "../Background/Background";
import { AppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const Auth = useContext(AppContext);
  const [showSideNavBar, setShowSideNavBar] = useState(false);
  const ShowSideNavBar = useCallback(() => {
    setShowSideNavBar(prev => !prev);
  }, []);
  return (
    <div>
      {showSideNavBar && (
        <>
          <Background />
          <SideNavBar ShowSideNavBar={ShowSideNavBar} />
        </>
      )}
      <div id="navbar">
        <div id="Logo_Btn__Section">
          <div id="Side_Btn" onClick={ShowSideNavBar}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div id="Logo">Shopping Ox</div>
        </div>
        <ul>
          {(!Auth.isLoggedIn || (Auth.isLoggedIn && Auth.role === "user")) && (
            <li>
              <Link to="/products" className="Links">
                Todos los productos
              </Link>
            </li>
          )}

          {Auth.isLoggedIn && Auth.role === "admin" && (
            <li>
              <Link to="/" className="Links">
                Ver Vendores
              </Link>
            </li>
          )}
          {Auth.isLoggedIn && Auth.role === "admin" && (
            <li>
              <Link to="/addCategory" className="Links">
                Agregar Categoría
              </Link>
            </li>
          )}
          {Auth.isLoggedIn && Auth.role === "admin" && (
            <li>
              <Link to="/viewCategory" className="Links">
                Categorias
              </Link>
            </li>
          )}
          {!Auth.isLoggedIn && (
            <li>
              <Link to="/auth" className="Links">
                Ingresar
              </Link>
            </li>
          )}
          {Auth.isLoggedIn && Auth.role === "vendor" && (
            <li>
              <Link to="/add" className="Links">
                Agregar Item
              </Link>
            </li>
          )}
          {Auth.isLoggedIn && Auth.role === "vendor" && (
            <li>
              <Link to="/viewProduct" className="Links">
                Ver Productos
              </Link>
            </li>
          )}
          {Auth.isLoggedIn && Auth.role === "vendor" && (
            <li>
              <Link to="/mysell" className="Links">
                Ver Ventas
              </Link>
            </li>
          )}
          {Auth.isLoggedIn && Auth.role === "user" && (
            <li>
              <Link to="/cart" className="Links">
                Mi carrito
              </Link>
            </li>
          )}

          {Auth.isLoggedIn && (
            <li>
              <Link to="#" className="Links" onClick={Auth.logOut}>
                Salir
              </Link>
            </li>
          )}
          {Auth.isLoggedIn && (
            <li>
              <Link to="/getMe" className="Links image_Link">
                <img
                  src={"http://localhost:5000/" + Auth.image}
                  alt="No Preview"
                  style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
                />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
