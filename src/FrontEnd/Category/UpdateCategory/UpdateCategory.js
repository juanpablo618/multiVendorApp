import React, { useEffect, useState, useContext } from "react";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import Background from "../../Shares/Background/Background";
import Card from "../../Shares/Card/Card";
import Input from "../../Shares/Input/Input";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { AppContext } from "../../Shares/Context/AppContext";
import { VALIDATOR_REQUIRE } from "../../Shares/Utils/Validators.js";
import { useFormState } from "../../Shares/Hooks/formState";
import { useParams, useHistory } from "react-router-dom";

import "./UpdateCategory.css";
function UpdateCategory() {
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  // Extracting ID Params From URL-
  const Id = useParams().Id;
  // ChangePath will be used to direct to other pages-
  const ChangePath = useHistory();
  // State For Category Which We Are Going To Update-
  const [categoryToBeUpdate, setCategoryToBeUpdate] = useState();
  // It Will Handle Data For The Category To Be Update To Make Button Visible/Disable Appropriately-
  const [state, inputHandler, setDataHandler] = useFormState(
    {
      name: {
        value: "",
        isValid: false
      }
    },
    false
  );
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
      const GetCategoryToBeUpdate = async () => {
        // Getting Category From DB To Be Update
        const Data = await makeRequest(
          `http://localhost:5000/Category/${Id}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + Auth.token
          }
        );
        // Setting CategoryToBeUpdate State
        setCategoryToBeUpdate({
          name: Data.Category.name
        });
        // Setting Forms Data After Getting Category From DB-
        setDataHandler(
          {
            name: {
              value: Data.Category.name,
              isValid: true
            }
          },
          true
        );
      };
      GetCategoryToBeUpdate();
    } catch (error) {}
  }, [makeRequest, Id, setDataHandler, Auth.token]);
  const UpdateCategory = async e => {
    try {
      e.preventDefault();
      // Making Request To Update Category
      await makeRequest(
        `http://localhost:5000/Category/${Id}`,
        "PATCH",
        JSON.stringify({ name: state.inputs.name.value }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.token
        }
      );
      // Directing towards the /viewCategory path-
      ChangePath.push("/viewCategory");
    } catch (error) {}
  };
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
      {categoryToBeUpdate ? (
        <form onSubmit={UpdateCategory}>
          <div id="CategoryToBeUpdate">
            <Card>
              <Input
                element="input"
                value={categoryToBeUpdate.name}
                isValid={true}
                title="Category Name"
                type="text"
                id="name"
                errorMsg="provide First Category Name please"
                placeholder="Enter Your Category Name"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
              />
              <div id="Btn_Section">
                <button type="submit" disabled={!state.isValid}>
                  UPDATE PRODUCT
                </button>
              </div>
            </Card>
          </div>
        </form>
      ) : (
        <>
          <Background />
          <LoadingSpinner asOverlay />
        </>
      )}
    </div>
  );
}

export default UpdateCategory;
