import React, { useState, useEffect } from "react";
import "./SelectBar.css";

function SelectBar(props) {
  const { onInput, id, title } = props;
  const [role, setRole] = useState(
    props.Arr.length === 0 ? "" : props.Arr[0].value
  );
  const SelectValue = e => {
    setRole(e.target.value);
  };
  useEffect(() => {
    onInput(id, role, true);
  }, [id, onInput, role]);
  return (
    <div id="SelectNavBar">
      <span>{title}</span>
      <select onChange={SelectValue}>
        {props.Arr.length === 0 ? (
          <option>None</option>
        ) : (
          props.Arr.map((Data, Index) => (
            <option value={Data.value} key={Index}>
              {Data.title}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

export default SelectBar;
