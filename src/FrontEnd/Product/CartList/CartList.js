import React, { useContext, useEffect, useState } from "react";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import Background from "../../Shares/Background/Background";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import CartItem from "../CartItem/CartItem";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";

function Cart() {
  const [cart, setCart] = useState();
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

  useEffect(() => {
    const LoadData = async () => {
      const Data = await makeRequest(
        "http://localhost:5000/Cart/myCart",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.token
        }
      );
      setCart(Data.Cart);
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
  } else if (cart) {
    return <CartItem Carts={cart} />;
  } else {
    return (
      <>
        <Background />
        <LoadingSpinner asOverlay />
      </>
    );
  }
}

export default Cart;
