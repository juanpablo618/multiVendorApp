import React, { useState, useContext } from "react";
import { useHttpHook } from "../../Shares/Hooks/httpRequest";
import { AppContext } from "../../Shares/Context/AppContext";
import OptimizeHook from "../../Shares/Hooks/OptimizeHook";
import { Link } from "react-router-dom";
import "./CartItem.css";

function CartItem(props) {
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
  const { Carts } = props;
  const [myCart, setMyCart] = useState(Carts);
  console.log(myCart);
  const LoadData = async () => {
    try {
      const Data = await makeRequest(
        "http://localhost:5000/Cart/myCart",
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.token
        }
      );
      setMyCart(Data.Cart);
    } catch (error) {}
  };
  const PayBill = async () => {
    try {
      await makeRequest("http://localhost:5000/User/Pay", "POST", null, {
        Authorization: "Bearer " + Auth.token
      });
    } catch (error) {}
  };
  const RemoveFromCart = async Id => {
    try {
      //   Removing Item From Cart
      await makeRequest("http://localhost:5000/Cart/" + Id, "DELETE", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Auth.token
      });
      // Loading Fresh Data After Item Deleted From Cart
      await LoadData();
    } catch (error) {}
  };
  const AddToCart = async Id => {
    try {
      //   Removing Item From Cart
      await makeRequest("http://localhost:5000/Cart/" + Id, "POST", null, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Auth.token
      });
      // Loading Fresh Data After Item Deleted From Cart
      await LoadData();
    } catch (error) {}
  };
  const DeletFromCart = async Id => {
    try {
      await makeRequest(
        "http://localhost:5000/Cart/Specific/" + Id,
        "DELETE",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Auth.token
        }
      );
      await LoadData();
    } catch (error) {}
  };
  if (myCart.items.length === 0) {
    return (
      <h1
        style={{
          color: "white",
          textAlign: "center",
          margin: "1rem"
        }}
      >
        Nothing Added To Cart
      </h1>
    );
  } else if (isLoading || isError) {
    return (
      <OptimizeHook
        isLoading={isLoading}
        errorHeader={errorHeader}
        errorDescripion={errorDescripion}
        clearError={clearError}
        isError={isError}
      />
    );
  } else if (myCart) {
    return (
      <div id="Cart_Info">
        <div id="product_Total_Section">
          <h1 id="Cart_Total">Total {myCart.totalAmount}</h1>
          <Link to="/products" onClick={PayBill} className="Btns payBill_Btn">
            Pay Bill
          </Link>
        </div>
        <div>
          <h1 id="My_Cart_Heading">My Cart</h1>
          {myCart.items.map(Product => (
            <div className="My_Cart_Products" key={Product._id}>
              <div className="Cart_Product_Image_Section">
                <img
                  className="product_Image_Section__img"
                  src={"http://localhost:5000/" + Product.product.image}
                  alt="No Preveiw"
                />
              </div>
              <div className="product_Quantity_Information_Section">
                {Product.quantity}
              </div>
              <div className="product_PriceInformation_Section">
                {Product.total}
              </div>
              <div className="Btn_Section">
                <button
                  className="Cart_Btn_Section"
                  onClick={() => RemoveFromCart(Product._id)}
                >
                  -
                </button>
                <button
                  className="Cart_Btn_Section"
                  onClick={() => AddToCart(Product.product._id)}
                >
                  +
                </button>
                <button
                  className="Cart_Btn_Section"
                  onClick={() => DeletFromCart(Product.product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CartItem;
