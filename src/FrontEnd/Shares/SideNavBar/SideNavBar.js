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
            All Items
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "admin" && (
        <li>
          <Link to="/" className="Side_Links">
            View Vendors
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "admin" && (
        <li>
          <Link to="/addCategory" className="Side_Links">
            Add Category
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "admin" && (
        <li>
          <Link to="/viewCategory" className="Side_Links">
            Categories
          </Link>
        </li>
      )}
      {!Auth.isLoggedIn && (
        <li>
          <Link to="/auth" className="Side_Links">
            Authenticate
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "vendor" && (
        <li>
          <Link to="/add" className="Side_Links">
            Add Item
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "vendor" && (
        <li>
          <Link to="/viewProduct" className="Side_Links">
            View Item
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "vendor" && (
        <li>
          <Link to="/mysell" className="Side_Links">
            View Sell
          </Link>
        </li>
      )}
      {Auth.isLoggedIn && Auth.role === "user" && (
        <li>
          <Link to="/cart" className="Side_Links">
            MyCart
          </Link>
        </li>
      )}

      {Auth.isLoggedIn && (
        <li>
          <Link to="/auth" className="Side_Links" onClick={Auth.logOut}>
            Logout
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
