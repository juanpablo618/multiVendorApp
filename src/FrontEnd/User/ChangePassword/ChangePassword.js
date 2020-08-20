import React, { useContext } from "react";
import { useFormState } from "../../Shares/Hooks/formState";
import Card from "../../Shares/Card/Card";
import Input from "../../Shares/Input/Input";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL
} from "../../Shares/Utils/Validators.js";
import { useHistory } from "react-router-dom";
import "./ChangePassword.css";
function ChangePassword() {
  const ChangePath = useHistory();
  const Auth = useContext(AppContext);
  // It Will Handle Data For The Category To Be Update To Make Button Visible/Disable Appropriately-
  const [state, inputHandler] = useFormState(
    {
      email: {
        value: "",
        isValid: false
      },
      password: {
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

  const ChangePassword = async () => {
    try {
      await makeRequest(
        "http://localhost:5000/User/ChangePassword",
        "PATCH",
        JSON.stringify({
          email: state.inputs.email.value,
          password: state.inputs.password.value
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
        <form onSubmit={ChangePassword}>
          <Card>
            <Input
              element="input"
              title="Email"
              type="email"
              id="email"
              errorMsg="Enter Your Current Email Please"
              placeholder="Enter Your Current Email"
              validators={[VALIDATOR_EMAIL()]}
              onInput={inputHandler}
            />
            <Input
              element="input"
              title="Password"
              type="text"
              id="password"
              errorMsg="Provide New Password Please"
              placeholder="Provide New Password "
              validators={[VALIDATOR_REQUIRE()]}
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

export default ChangePassword;
