import React, { useEffect, useState, useContext } from "react";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import Background from "../../Shares/Background/Background";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import CategoryItem from "../CategoryItem/CategoryItem";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { AppContext } from "../../../FrontEnd/Shares/Context/AppContext";

function CategoryList() {
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  // State For Category
  const [category, setCategory] = useState();
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
    errorDescription,
    makeRequest,
    clearError
  ] = useHttpHook();
  useEffect(() => {
    const loadCategory = async () => {
      try {
        // Making AJAX Call to GET All Categories
        const Data = await makeRequest(
          "http://localhost:5000/Category/",
          "GET",
          null,
          {
            Authorization: "Bearer " + Auth.token
          }
        );
        // Setting Our Category State-
        setCategory(Data);
      } catch (error) {}
    };
    loadCategory();
  }, [makeRequest, Auth.token]);
  return (
    <div>
      {(isLoading || isError) && (
        <OptimizeHook
          isLoading={isLoading}
          errorHeader={errorHeader}
          errorDescription={errorDescription}
          clearError={clearError}
          isError={isError}
        />
      )}
      {category ? (
        <CategoryItem Categories={category.Categories} />
      ) : (
        <>
          <Background />
          <LoadingSpinner asOverlay />
        </>
      )}
    </div>
  );
}

export default CategoryList;
