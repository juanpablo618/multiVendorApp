import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import Background from "../../Shares/Background/Background";
import UserItem from "../UserItem/UserItem";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";
import "./UserList.css";
function UserList() {
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
  const [vendors, setVendors] = useState();
  useEffect(() => {
    try {
      const LoadVendors = async e => {
        const Data = await makeRequest(
          // Loading All The Vendors Form DB
          "http://localhost:5000/User/GetAll/",
          "GET",
          null,
          { Authorization: "Bearer " + Auth.token }
        );
        setVendors(Data.Vendors);
      };
      LoadVendors();
    } catch (error) {}
  }, [makeRequest, Auth.token]);
  return (
    <React.Fragment>
      {(isLoading || isError) && (
        <OptimizeHook
          isLoading={isLoading}
          errorHeader={errorHeader}
          errorDescripion={errorDescripion}
          clearError={clearError}
          isError={isError}
        />
      )}
      {vendors ? (
        <UserItem Vendors={vendors} />
      ) : (
        <>
          <Background />
          <LoadingSpinner asOverlay />
        </>
      )}
    </React.Fragment>
  );
}

export default UserList;
