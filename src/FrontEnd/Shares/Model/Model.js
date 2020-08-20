import React from "react";
import Card from "../Card/Card";
import "./Model.css";

function Model(props) {
  return (
    <div id="Model">
      <Card>
        <div id="Header">
          <h4>{props.header}</h4>
        </div>
        <div id="Description">
          <h5>{props.description}</h5>
        </div>
        <div id="Btn_section">
          <button type="button" onClick={props.closeModel}>
            Close
          </button>
        </div>
      </Card>
    </div>
  );
}

export default Model;
