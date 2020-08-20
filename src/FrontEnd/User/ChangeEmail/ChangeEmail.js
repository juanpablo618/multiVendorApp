import React, { useContext } from "react";
import { useFormState } from "../../Shares/Hooks/formState";
import Card from "../../Shares/Card/Card";
import Input from "../../Shares/Input/Input";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { VALIDATOR_EMAIL } from "../../Shares/Utils/Validators.js";
import { useHistory } from "react-router-dom";

function ChangeEmail() {
  const ChangePath = useHistory();
  const Auth = useContext(AppContext);
  // It Will Handle Data For The Category To Be Update To Make Button Visible/Disable Appropriately-
  const [state, inputHandler] = useFormState(
    {
      email: {
        value: "",
        isValid: false
      },
      new_email: {
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

  const ChangePathAccordingly = () => {
    if (Auth.role === "admin") {
      ChangePath.push("/addCategory");
    } else if (Auth.role === "vendor") {
      ChangePath.push("/add");
    } else {
      ChangePath.push("/products");
    }
  };

  const ChangeEmail = async e => {
    try {
      e.preventDefault();
      await makeRequest(
        "http://localhost:5000/User/ChangeEmail",
        "PATCH",
        JSON.stringify({
          email: state.inputs.email.value,
          new_email: state.inputs.new_email.value
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.token
        }
      );
      ChangePathAccordingly();
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
  } else {
    return (
      <div id="UpdateName">
        <form onSubmit={ChangeEmail}>
          <Card>
            <Input
              element="input"
              title="Old Email"
              type="email"
              id="email"
              errorMsg="Enter Your Old Email Please"
              placeholder="Enter Your Old Email"
              validators={[VALIDATOR_EMAIL()]}
              onInput={inputHandler}
            />
            <Input
              element="input"
              title="New Email"
              type="email"
              id="new_email"
              errorMsg="Provide New Email Please"
              placeholder="Provide New Email "
              validators={[VALIDATOR_EMAIL()]}
              onInput={inputHandler}
            />
            <div id="Btn_Section" className="Change_Password__Btn">
              <button type="submit" disabled={!state.isValid}>
                Update
              </button>
            </div>
          </Card>
        </form>
      </div>
    );
  }
}

export default ChangeEmail;
