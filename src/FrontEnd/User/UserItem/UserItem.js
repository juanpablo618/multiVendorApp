import React from "react";
import "./UserItem.css";

function UserItem(props) {
  const { Vendors } = props;
  if (Vendors.length === 0) {
    return (
      <h1 style={{ color: "white", textAlign: "center" }}>No Vendor Yet</h1>
    );
  } else {
    let Element = Vendors.map(Vendor => (
      <div key={Vendor._id} className="Individual_Vendor">
        <div className="Image">
          <img
            className="Vendor_Img"
            src={"http://localhost:5000/" + Vendor.image}
            alt="No Preview"
          />
        </div>
        <div className="Vendor_Name">
          <p>{Vendor.firstName}</p>
          <p>{Vendor.lastName}</p>
        </div>
        <div className="Information">
          <p>Items: {Vendor.myProduct}</p>
          <p>Total: {Vendor.totalAmount}</p>
        </div>
      </div>
    ));
    return <div id="Vendors_Div">{Element}</div>;
  }
}

export default UserItem;
