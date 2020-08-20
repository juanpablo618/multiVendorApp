import React, { useState, useContext } from "react";
import Card from "../../Shares/Card/Card";
import { AppContext } from "../../../FrontEnd/Shares/Context/AppContext";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { Link } from "react-router-dom";
import "./CategoryItem.css";

function CategoryItem(props) {
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  // Destucutring
  const { Categories } = props;
  const [state, setstate] = useState(Categories);
  // makeRequest Will be used to Make AJAX call
  const [, , , , makeRequest] = useHttpHook();
  const DeleteCategory = async Id => {
    try {
      // Making Request To Delete Category
      await makeRequest(
        "http://localhost:5000/Category/" + Id,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + Auth.token
        }
      );
      //  After Deleting Eliminating Deleted Category Inorder To Update Our Categry State To Show Correct Data-
      let FilteredCategory = state.filter(
        Cat => Cat._id.toString() !== Id.toString()
      );
      // Setting Category After Deleting Category-
      setstate(FilteredCategory);
    } catch (error) {}
  };
  if (state.length === 0) {
    return (
      <h1 style={{ color: "white", textAlign: "center" }}>
        Not Found Any Category :(
      </h1>
    );
  }
  return (
    <div id="Categories">
      <h1 id="Categories_Heading">Our Categories</h1>

      <Card>
        {state.map(Category => (
          <div className="Category" key={Category._id}>
            <h3 className="Indeivdual_Category_Heading">{Category.name}</h3>
            <div className="Btn">
              <Link to={`/updateCategory/${Category._id}`} className="Btns">
                Update
              </Link>
              <Link
                to="#"
                className="Btns"
                onClick={() => DeleteCategory(Category._id)}
              >
                Delete
              </Link>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default CategoryItem;
