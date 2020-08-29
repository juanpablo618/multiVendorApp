import React, { useState, useContext } from "react";
import Card from "../../Shares/Card/Card";
import Input from "../../Shares/Input/Input";
import UploadImage from "../../Shares/UploadImage/UploadImage";
import { useFormState } from "../../Shares/Hooks/formState";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";
import SelectBar from "../../Shares/SelectBar/SelectBar";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { useHistory } from "react-router-dom";
import "./Auth.css";
import "../../Shares/Button/Button.css";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE
} from "../../Shares/Utils/Validators.js";
function Auth() {
  // ChangePath Will Direct To New Page
  const ChangePath = useHistory();
  // Auth Contain All Information About Currently LoggedIn User-
  const Auth = useContext(AppContext);
  // Check whtehr User In Login/Signup Mode So That We Can Show Form Appropraitely
  const [isInLogInMode, setIsInLogInMode] = useState(true);
  // State Will Manage All The State Of Form
  // inputHandler Will Check Each Input Of Ecah Propety Is Valid Or Not-
  // SetHandler Will Return New State Based On The Mode If We Are In Login Mode So It Will Return
  // Email And Password Proerties Otherwise It Will Return Email,Password,FirstName,LastName And
  // Image Properties So That We Can SignUp-
  const [state, inputHandler, SetDataHandler] = useFormState(
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
  const switchMode = e => {
    if (!isInLogInMode) {
      SetDataHandler(
        {
          ...state.inputs,
          firstName: undefined,
          lastName: undefined,
          image: undefined,
          role: undefined
        },
        state.inputs.email.isValid && state.inputs.password.isValid
      );
    } else {
      SetDataHandler(
        {
          ...state.inputs,
          firstName: {
            value: "",
            isValid: false
          },
          lastName: {
            value: "",
            isValid: false
          },
          image: {
            value: "",
            isValid: false
          },
          role: {
            value: "",
            isValid: false
          }
        },
        false
      );
    }
    setIsInLogInMode(prev => !prev);
  };
  const SignupOrLogin = async e => {
    e.preventDefault();
    if (!isInLogInMode) {
      try {
        const formData = new FormData();
        formData.append("firstName", state.inputs.firstName.value);
        formData.append("lastName", state.inputs.lastName.value);
        formData.append("image", state.inputs.image.value);
        formData.append("email", state.inputs.email.value);
        formData.append("password", state.inputs.password.value);
        formData.append("role", state.inputs.role.value);
        const Data = await makeRequest(
          // Making Request For Signing Up
          "http://localhost:5000/User/Signup",
          "POST",
          formData
        );
        // Preserving Info Of Currently LoggedIn User
        Auth.logIn(Data.Id, Data.Token, Data.Role, Data.Image);
        // Directing to /addCategory Path-
        ChangePath.push("/addCategory");
      } catch (error) {}
    } else {
      try {
        const Data = await makeRequest(
          // Making Request To LogIn
          "http://localhost:5000/User/Login",
          "POST",
          JSON.stringify({
            email: state.inputs.email.value,
            password: state.inputs.password.value
          }),
          {
            "Content-Type": "application/json"
          }
        );
        // Preserving Info Of Currently LoggedIn User
        Auth.logIn(Data.Id, Data.Token, Data.Role, Data.Image);

        // Directing To /Items path
        ChangePath.push("/Items");
      } catch (error) {}
    }
  };
  return (
    <div id="Auth">
      {(isLoading || isError) && (
        <OptimizeHook
          isLoading={isLoading}
          errorHeader={errorHeader}
          errorDescripion={errorDescripion}
          clearError={clearError}
          isError={isError}
        />
      )}
      <Card>
        <h1
          id="Login_Signup_H1"
          style={{ textAlign: "center", margin: "0.5rem" }}
        >
          {isInLogInMode ? "Iniciar Sesión" : "Regístrarse"} :)
        </h1>
        <form onSubmit={SignupOrLogin}>
          {!isInLogInMode && (
            <>
              <Input
                element="input"
                title="Nombre"
                type="text"
                id="firstName"
                errorMsg="Ingrese un nombre"
                placeholder="Ingrese su nombre"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
              />
              <Input
                element="input"
                title="Apellido"
                type="text"
                id="lastName"
                errorMsg="Ingrese un apellido"
                placeholder="Ingrese su apellido"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
              />
              <UploadImage onInput={inputHandler} id={"image"} />
            </>
          )}
          {!isInLogInMode && (
            <SelectBar
              onInput={inputHandler}
              id={"role"}
              Arr={[
                {
                  title: "User",
                  value: "user"
                },
                {
                  title: "Admin",
                  value: "admin"
                },
                {
                  title: "Vendor",
                  value: "vendor"
                }
              ]}
              title={"Role"}
            />
          )}
          <Input
            element="input"
            title="Email"
            type="email"
            id="email"
            errorMsg="ingrese un email por favor"
            placeholder="Enter Your Email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            element="input"
            title="Password"
            id="password"
            type="password"
            errorMsg="debe contener al menos 5 caracteres"
            placeholder="Enter Your Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
          />

          <div id="Btn_Section">
            
            <button type="submit" disabled={!state.isValid} class="btn btn-outline-primary btn-rounded waves-effect">
              {isInLogInMode ? "Ingresar" : "Registrarse"}
            </button>
            
            <button type="button" onClick={switchMode} class="btn btn-outline-primary btn-rounded waves-effect">
              Cambiar a formulario para {isInLogInMode ? "Registrarse" : "Ingresar"}
            </button>

          </div>
        </form>
      </Card>
    </div>
  );
}

export default Auth;
