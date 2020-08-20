import React, { useReducer, useEffect } from "react";
import { validate } from "../Utils/Validators.js";
import "./Input.css";
const reducer = (State, Action) => {
  switch (Action.type) {
    case "ONCHANGE": {
      return {
        ...State,
        Value: Action.Value,
        isValid: validate(Action.Value, Action.validators)
      };
    }
    case "ONBLUR": {
      return {
        ...State,
        onBlur: true
      };
    }
    default: {
      return State;
    }
  }
};
function Input(props) {
  const [State, Dispatch] = useReducer(reducer, {
    Value: props.value || "",
    onBlur: false,
    isValid: props.isValid || false
  });

  const {
    element = "input",
    title,
    type = "text",
    errorMsg = "",
    id,
    placeholder,
    validators,
    onInput
  } = props;

  useEffect(() => {
    onInput(id, State.Value, State.isValid);
  }, [id, State.Value, State.isValid, onInput]);

  const ChangeState = e => {
    Dispatch({
      type: "ONCHANGE",
      Value: e.target.value,
      validators
    });
  };
  const BlurState = e => {
    Dispatch({
      type: "ONBLUR"
    });
  };
  const Element =
    element === "input" ? (
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={State.Value}
        onChange={ChangeState}
        onBlur={BlurState}
      />
    ) : (
      <textarea
        id={id}
        cols="30"
        rows="5"
        placeholder={placeholder}
        value={State.Value}
        onChange={ChangeState}
        onBlur={BlurState}
      />
    );
  return (
    <div className={`valid ${!State.isValid && State.onBlur && "--invalid"}`}>
      <label htmlFor={id}>{title}</label>
      {Element}
      {!State.isValid && State.onBlur && <p>{errorMsg}</p>}
    </div>
  );
}

export default Input;
