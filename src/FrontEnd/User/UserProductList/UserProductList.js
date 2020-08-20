import React, { useState, useContext } from "react";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { AppContext } from "../../Shares/Context/AppContext";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { Link } from "react-router-dom";
import "./UserProductList.css";

function UserProductList(props) {
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  // useHttpHook is our custom hook which will give you are we loading while making request or get some error from request's response-
  // isError will show do we have any error during request-
  // errorheader and description will give you whole information on a model-
  // Makerequest is a function which help you to make request-
  // clearError is a function which will set isError as false inorder to close the error model
  // isLoading will check whether AJAX request Completed Or No-
  const [
    isLoading,
    isError,
    errorHeader,
    errorDescripion,
    makeRequest,
    clearError
  ] = useHttpHook();
  // State For Vendors
  const [Products, setProducts] = useState(props.Products);
  const DeleteProduct = async Id => {
    try {
      await makeRequest("http://localhost:5000/Product/" + Id, "DELETE", null, {
        Authorization: "Bearer " + Auth.token
      });
      const ProductAfterDeletion = Products.filter(
        Product => Product._id !== Id
      );
      setProducts(ProductAfterDeletion);
    } catch (error) {}
  };
  if (isLoading || isError) {
    return (
      <OptimizeHook
        isLoading={isLoading}
        errorHeader={errorHeader}
        errorDescripion={errorDescripion}
        clearError={clearError}
        isError={isError}
      />
    );
  } else if (Products.length === 0) {
    return (
      <h1 style={{ color: "white", textAlign: "center" }}>Nothing Found :(</h1>
    );
  } else if (Products) {
    return (
      <div id="My_Products">
        <h1 style={{ textAlign: "center", margin: "1rem auto" }}>
          My Products
        </h1>
        {Products.map(Product => (
          <div key={Product._id} className="Individual_Products">
            <div className="Product_Image">
              <img
                src={"http://localhost:5000/" + Product.image}
                alt="No Preview"
              />
            </div>
            <div className="Product_Description">
              <h3>{Product.name}</h3>
              <p>{Product.description}</p>
              <h4>RS: {Product.price}$</h4>
            </div>
            <div className="Product_Btn_Section">
              <Link to={`/updateProduct/${Product._id}`} className="Btns">
                Update
              </Link>
              <Link
                to="#"
                className="Btns"
                onClick={() => DeleteProduct(Product._id)}
              >
                Delete
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default UserProductList;
