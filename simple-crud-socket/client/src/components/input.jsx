import React from "react";

export const Input = ({ name, placeholder, handleInput, value }) => {
  return (
    <div>
      <input
        name={name}
        onChange={handleInput}
        value={value}
        className="input-field"
        placeholder={placeholder}
      />
    </div>
  );
};
