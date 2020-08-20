import React, { useContext, useState, useEffect } from "react";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import Background from "../../Shares/Background/Background";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";

function MySell() {
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
  const [mySell, setMySell] = useState();

  useEffect(() => {
    const LoadData = async () => {
      const Data = await makeRequest(
        "http://localhost:5000/User/MySell",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.token
        }
      );
      setMySell(Data.Cart);
    };
    LoadData();
  }, [makeRequest, Auth.token]);
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
  } else if (mySell) {
    if (mySell.length === 0) {
      return (
        <h1 style={{ color: "white", textAlign: "center" }}>
          No Sell To Show Yet
        </h1>
      );
    }
    return (
      <div
        style={{
          width: "80%",
          margin: "1rem auto",
          textAlign: "center"
        }}
      >
        <h1 id="My_Cart_Heading">My Sell</h1>
        {mySell.map(Product => (
          <div className="My_Cart_Products" key={Product.Id}>
            <div className="Cart_Product_Image_Section">
              <img
                className="product_Image_Section__img"
                src={"http://localhost:5000/" + Product.Image}
                alt="No Preveiw"
              />
            </div>
            <div className="product_Quantity_Information_Section">
              {Product.Quantity}
            </div>
            <div className="product_PriceInformation_Section">
              {Product.Total}
            </div>
          </div>
        ))}
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

export default MySell;
