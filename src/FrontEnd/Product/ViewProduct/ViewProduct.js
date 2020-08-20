import React, { useState, useEffect, useContext } from "react";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import Background from "../../Shares/Background/Background";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { AppContext } from "../../Shares/Context/AppContext";
import { useParams, Link } from "react-router-dom";
import "./ViewProduct.css";
function ViewProduct() {
  const Auth = useContext(AppContext);
  const [product, setProduct] = useState();
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
  const Id = useParams().Id;

  const BuyItem = async Id => {
    try {
      await makeRequest(`http://localhost:5000/Cart/${Id}`, "POST", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Auth.token
      });
    } catch (error) {}
  };

  useEffect(() => {
    try {
      const LoadData = async () => {
        const Data = await makeRequest(
          "http://localhost:5000/Product/" + Id,
          "GET",
          null,
          {
            Authorization: "Bearer " + Auth.token
          }
        );
        setProduct(Data.Product);
      };
      LoadData();
    } catch (error) {}
  }, [makeRequest, Auth.token, Id]);

  if (isLoading || isError) {
    return (
      <OptimizeHook
        isLoading={isLoading}
        isError={isError}
        errorHeader={errorHeader}
        errorDescripion={errorDescripion}
        clearError={clearError}
      />
    );
  } else if (product) {
    return (
      <div id="Product">
        <div id="Image_Section">
          <img
            src={`http://localhost:5000/` + product.image}
            alt="No Preview"
          />
        </div>
        <div className="Product_Description">
          <h3>{product.name}</h3>
          <h4>{product.description}</h4>
          <h5>RS.{product.price}$</h5>
        </div>
        <div id="Btn_Section">
          <Link to="#" className="Btns" onClick={() => BuyItem(Id)}>
            Buy Now
          </Link>
          <Link to="/products" className="Btns">
            Return
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Background />
        <LoadingSpinner asOverlay />
      </>
    );
  }
}

export default ViewProduct;
