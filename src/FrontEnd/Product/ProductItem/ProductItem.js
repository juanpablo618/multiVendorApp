import React, { useContext } from "react";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { AppContext } from "../../Shares/Context/AppContext";
import { Link } from "react-router-dom";
import "./ProductItem.css";

function ProductItem(props) {
  const Auth = useContext(AppContext);
  const [
    isLoading,
    isError,
    errorHeader,
    errorDescripion,
    makeRequest,
    clearError
  ] = useHttpHook();
  const { products } = props;

  const BuyItem = async Id => {
    try {
      await makeRequest(`http://localhost:5000/Cart/${Id}`, "POST", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Auth.token
      });
    } catch (error) {}
  };
  if (products.length === 0) {
    return (
      <h1
        style={{
          color: "white",
          textAlign: "center",
          margin: "2rem 0rem"
        }}
      >
        Product Not Found :(
      </h1>
    );
  } else if (isLoading || isError) {
    return (
      <OptimizeHook
        isLoading={isLoading}
        isError={isError}
        errorHeader={errorHeader}
        errorDescripion={errorDescripion}
        clearError={clearError}
      />
    );
  } else {
    return (
      <div id="Products_Div" style={{ color: "white" }}>
        {products.map(Product => (
          <div key={Product._id} className="Products">
            <div
              className="Product_Image_Section"
              style={{ width: "200px", height: "200px" }}
            >
              <img
                style={{ width: "100%", height: "100%" }}
                src={"http://localhost:5000/" + Product.image}
                alt="No Preview"
              />
            </div>
            <div className="Prodcut_Information">
              <h3>
                {Product.name.length <= 10
                  ? Product.name
                  : Product.name.slice(0, 10)}
              </h3>
              <h5>
                {Product.description.length <= 20
                  ? Product.description
                  : Product.description.slice(0, 18)}
              </h5>
              <p>RS.{Product.price}$</p>
            </div>
            <div className="Product_Button_Section">
              <button onClick={() => BuyItem(Product._id)}>Buy Now</button>
              <Link to={`/view/${Product._id}`} className="Btns">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ProductItem;
