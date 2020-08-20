import React, { useState, useContext, useEffect } from "react";
import Background from "../../Shares/Background/Background";
import Card from "../../Shares/Card/Card";
import Input from "../../Shares/Input/Input";
import Model from "../../Shares/Model/Model";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import UploadImage from "../../Shares/UploadImage/UploadImage";
import { AppContext } from "../../Shares/Context/AppContext";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { useFormState } from "../../Shares/Hooks/formState";
import { VALIDATOR_REQUIRE } from "../../Shares/Utils/Validators.js";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./UpdateProduct.css";

function UpdateProduct() {
  const ChangePath = useHistory();
  let Id = useParams().Id;
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
  const [state, inputHandler, SetDataHandler] = useFormState(
    {
      name: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      },
      price: {
        value: "",
        isValid: false
      },
      image: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const [productToBeUpdate, setProductToBeUpdate] = useState();

  const UpdateProduct = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.inputs.name.value);
    formData.append("price", state.inputs.price.value);
    formData.append("description", state.inputs.description.value);
    formData.append("image", state.inputs.image.value);
    try {
      await makeRequest(
        "http://localhost:5000/Product/" + Id,
        "PATCH",
        formData,
        {
          Authorization: "Bearer " + Auth.token
        }
      );
      ChangePath.push("/viewProduct");
    } catch (error) {}
  };
  useEffect(() => {
    try {
      const LoadProduct = async () => {
        const Data = await makeRequest(
          "http://localhost:5000/Product/" + Id,
          "GET",
          null,
          {
            Authorization: "Bearer " + Auth.token
          }
        );
        setProductToBeUpdate(Data.Product);
        SetDataHandler(
          {
            name: {
              value: Data.Product.name,
              isValid: true
            },
            description: {
              value: Data.Product.description,
              isValid: true
            },
            price: {
              value: Data.Product.price,
              isValid: true
            },
            image: {
              value: Data.Product.image,
              isValid: true
            }
          },
          true
        );
      };
      LoadProduct();
    } catch (error) {}
  }, [Id, Auth.token, makeRequest, SetDataHandler]);
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
  }

  return productToBeUpdate ? (
    <div id="ProductToBeUpdate">
      <form onSubmit={UpdateProduct}>
        <Card>
          <Input
            element="input"
            value={productToBeUpdate.name}
            isValid={true}
            title="Category Name"
            type="text"
            id="name"
            errorMsg="provide First Product Name please"
            placeholder="Enter Your Product Name"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <UploadImage
            id="image"
            onInput={inputHandler}
            Image={`http://localhost:5000/${productToBeUpdate.image}`}
          />
          <Input
            element="textarea"
            value={productToBeUpdate.description}
            isValid={true}
            title="Description"
            type="text"
            id="description"
            errorMsg="provide First Product Name please"
            placeholder="Enter Your Product Name"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <Input
            element="input"
            value={productToBeUpdate.price}
            isValid={true}
            title="Price"
            type="number"
            id="price"
            errorMsg="provide First Product Price"
            placeholder="Enter Your Product Price"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <div id="Btn_Section">
            <button type="submit" disabled={!state.isValid}>
              UPDATE Product
            </button>
          </div>
        </Card>
      </form>
    </div>
  ) : (
    <>
      <Background />
      <Model asOverlay />
    </>
  );
}

export default UpdateProduct;
