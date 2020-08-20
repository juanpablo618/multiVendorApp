import React, { useContext, useState, useEffect } from "react";
import { useFormState } from "../../Shares/Hooks/formState";
import Background from "../../Shares/Background/Background";
import Card from "../../Shares/Card/Card";
import Input from "../../Shares/Input/Input";
import LoadingSpinner from "../../Shares/Loading_Spinner/LoadingSpinner";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { VALIDATOR_REQUIRE } from "../../Shares/Utils/Validators.js";
import { useHistory, Link } from "react-router-dom";
import "./UpdateUser.css";

function UpdateUser() {
  const ChangePath = useHistory();
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  const [user, setUser] = useState();
  // It Will Handle Data For The Category To Be Update To Make Button Visible/Disable Appropriately-
  const [state, inputHandler, setDataHandler] = useFormState(
    {
      firstName: {
        value: "",
        isValid: false
      },
      lastName: {
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
      const LoadData = async () => {
        const Data = await makeRequest(
          "http://localhost:5000/User/Me",
          "GET",
          null,
          {
            Authorization: "Bearer " + Auth.token
          }
        );
        setUser(Data.User);
        setDataHandler(
          {
            firstName: {
              value: Data.User.firstName,
              isValid: true
            },
            lastName: {
              value: Data.User.lastName,
              isValid: true
            }
          },
          true
        );
      };
      LoadData();
    } catch (error) {}
  }, [Auth.token, makeRequest, setDataHandler]);
  const ChangePathAccordingly = () => {
    if (Auth.role === "admin") {
      ChangePath.push("/addCategory");
    } else if (Auth.role === "vendor") {
      ChangePath.push("/add");
    } else {
      ChangePath.push("/products");
    }
  };
  const DeleteMe = async e => {
    try {
      await makeRequest("http://localhost:5000/User/Me", "DELETE", null, {
        Authorization: "Bearer " + Auth.token
      });
      Auth.logOut();
      ChangePath.push("/");
    } catch (error) {}
  };

  const UpdateMe = async e => {
    try {
      e.preventDefault();
      await makeRequest(
        "http://localhost:5000/User/Me",
        "PATCH",
        JSON.stringify({
          firstName: state.inputs.firstName.value,
          lastName: state.inputs.lastName.value
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
  } else if (user) {
    return (
      <div id="UpdateName">
        <form onSubmit={UpdateMe}>
          <Card>
            <Input
              element="input"
              value={user.firstName}
              isValid={true}
              title="First Name"
              type="text"
              id="firstName"
              errorMsg="Provide First  Name Please"
              placeholder="Enter Your First Name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
            <Input
              element="input"
              value={user.lastName}
              isValid={true}
              title="Category Name"
              type="text"
              id="lastName"
              errorMsg="Provide Last  Name Please"
              placeholder="Enter Your Last Name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
            <div className="Update_Btn__Section">
              <Link to="/email" className="Btns Update_User_Btn">
                Change Email
              </Link>
              <button
                type="submit"
                disabled={!state.isValid}
                className="Update_User_Btn"
              >
                Update
              </button>
              <Link to="/password" className="Btns Update_User_Btn">
                Change Password
              </Link>
            </div>
            <div id="Delete_Account">
              <Link
                to="#"
                className="Btns Update_User_Btn Delete_Account_Button"
                onClick={DeleteMe}
              >
                Delete My Account
              </Link>
            </div>
          </Card>
        </form>
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

export default UpdateUser;
