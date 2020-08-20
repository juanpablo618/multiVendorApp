import React, { useContext } from "react";
import Card from "../../Shares/Card/Card";
import Input from "../../Shares/Input/Input";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { useFormState } from "../../Shares/Hooks/formState";
import { VALIDATOR_REQUIRE } from "../../Shares/Utils/Validators.js.js";
import { AppContext } from "../../Shares/Context/AppContext";
import { useHistory } from "react-router-dom";
import "./AddCategory.css";

function AddCategory() {
  // ChangePath i'll Move To Other Page Automatically Once You Added Product-
  const ChangePath = useHistory();
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  // Here State Will Manage The Whole Fomrs Data-
  const [state, inputHandler] = useFormState(
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
  const AddCategory = async e => {
    e.preventDefault();
    try {
      // Making Request To POST Category
      await makeRequest(
        "http://localhost:5000/Category/",
        "POST",
        JSON.stringify({
          name: state.inputs.name.value,
          admin: Auth.loggedInUser
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.token
        }
      );
      ChangePath.push("/");
    } catch (error) {}
  };
  return (
    <div id="Add_Category">
      {(isLoading || isError) && (
        <OptimizeHook
          isLoading={isLoading}
          errorHeader={errorHeader}
          errorDescripion={errorDescripion}
          clearError={clearError}
          isError={isError}
        />
      )}
      <form onSubmit={AddCategory}>
        <Card>
          <Input
            element="input"
            title="Category Name"
            type="text"
            id="name"
            errorMsg="provide First Category Name please"
            placeholder="Enter Your Category Name"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <div id="Btn_Section" className="Add_Category__Btn___Section">
            <button type="submit" disabled={!state.isValid}>
              ADD CATEGORY
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
}

export default AddCategory;
