import React from 'react';

const FormInput = ({ value, onChange, placeholder }) => {
  return (
    <input 
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-input"
    />
  );
};

export default FormInput;
