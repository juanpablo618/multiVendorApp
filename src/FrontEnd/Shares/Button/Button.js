import React from "react";
import "./Button.css";
function Button(props) {
  const { title, type, disabled = false } = props;
  const SwitchMode = () => {
    props.switchMode();
  };
  return (
    <div className="Btn">
      <button
        type={type}
        disabled={disabled}
        onClick={type === "button" ? SwitchMode : null}
      >
        {props.children}
      </button>
    </div>
  );
}

export default Button;
