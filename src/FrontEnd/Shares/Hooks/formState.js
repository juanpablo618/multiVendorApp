import { useReducer, useCallback } from "react";
const Reducer = (State, Action) => {
  let isFormValid = true;
  switch (Action.type) {
    case "CHANGE_STATE": {
      for (const key in State.inputs) {
        if (!State.inputs[key]) {
          continue;
        }
        if (key === Action.id) {
          isFormValid = isFormValid && Action.isValid;
        } else {
          isFormValid = isFormValid && State.inputs[key].isValid;
        }
      }
      return {
        inputs: {
          ...State.inputs,
          [Action.id]: {
            value: Action.value,
            isValid: Action.isValid
          }
        },
        isValid: isFormValid
      };
    }
    case "SET_DATA": {
      return {
        inputs: Action.inputs,
        isValid: Action.isValid
      };
    }
    default: {
      return State;
    }
  }
};
export const useFormState = (initialState, formValidation) => {
  const [state, dispatch] = useReducer(Reducer, {
    inputs: initialState,
    isValid: formValidation
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "CHANGE_STATE",
      id,
      value,
      isValid
    });
  }, []);
  const SetDataHandler = useCallback((inputs, isValid) => {
    dispatch({
      type: "SET_DATA",
      inputs,
      isValid
    });
  }, []);
  return [state, inputHandler, SetDataHandler];
};
