import React, { useContext, useState, useEffect } from "react";
import Background from "../../Shares/Background/Background";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import UserProductList from "../UserProductList/UserProductList";
import { AppContext } from "../../Shares/Context/AppContext";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";

function UserProduct() {
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  // Product State To Load All Product Of Current LoggedIn User
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
  useEffect(() => {
    try {
      const loadProducts = async () => {
        const Data = await makeRequest(
          "http://localhost:5000/Product/",
          "GET",
          null,
          {
            Authorization: "Bearer " + Auth.token
          }
        );
        setProduct(Data.Product);
      };
      loadProducts();
    } catch (error) {}
  }, [makeRequest, Auth.token]);

  return (
    <div>
      {(isLoading || isError) && (
        <OptimizeHook
          isLoading={isLoading}
          errorHeader={errorHeader}
          errorDescripion={errorDescripion}
          clearError={clearError}
          isError={isError}
        />
      )}
      {product ? (
        <UserProductList Products={product} />
      ) : (
        <React.Fragment>
          <Background />
          <LoadingSpinner asOverlay />
        </React.Fragment>
      )}
    </div>
  );
}

export default UserProduct;
