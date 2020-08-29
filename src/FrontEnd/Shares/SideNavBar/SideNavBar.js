import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";
import "./SideNavBar.css";

function SideNavBar(props) {
  const Auth = useContext(AppContext);
  return (
    // Here ShowSideNavBar Is A Function Whihc Will Be Called When Yiu Click On SideNavBar's List Item-
    <div id="Side_Nav_Bar" onClick={props.ShowSideNavBar}>
      {(!Auth.isLoggedIn || (Auth.isLoggedIn && Auth.role === "user")) && (
        <li>
          <Link to="/products" className="Side_Links">
            Todos los productos
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "admin" && (
        <li>
          <Link to="/" className="Side_Links">
            Ver Vendedores
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "admin" && (
        <li>
          <Link to="/addCategory" className="Side_Links">
            Agregar Categoria
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "admin" && (
        <li>
          <Link to="/viewCategory" className="Side_Links">
            Categorias
          </Link>
        </li>
      )}
      {!Auth.isLoggedIn && (
        <li>
          <Link to="/auth" className="Side_Links">
          Ingresar
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "vendor" && (
        <li>
          <Link to="/add" className="Side_Links">
            Agregar Item
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "vendor" && (
        <li>
          <Link to="/viewProduct" className="Side_Links">
            Ver Item
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "vendor" && (
        <li>
          <Link to="/mysell" className="Side_Links">
            Ver Ventas
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "user" && (
        <li>
          <Link to="/cart" className="Side_Links">
            Mi carrito
          </Link>
        </li>
      )}

      {Auth.isLoggedIn && (
        <li>
          <Link to="/auth" className="Side_Links" onClick={Auth.logOut}>
            Salir
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && (
        <li>
          <Link to="/getMe" className="Side_Links image_Link">
            <img
              src={"http://localhost:5000/" + Auth.image}
              alt="No Preview"
              style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
            />
          </Link>
        </li>
      )}
    </div>
  );
}

export default SideNavBar;
