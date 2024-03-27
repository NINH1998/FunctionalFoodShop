import React from 'react';

const InputCheckBox = ({ id, value, handleOnChange, checked, label }) => {
    return (
        <div>
            <input
                id={id}
                type="checkbox"
                value={value}
                onChange={handleOnChange}
                className="w-5 h-5 cursor-pointer"
                checked={checked}
            ></input>
            <label htmlFor={id} className="ml-2 text-base font-semibold">
                {label}
            </label>
        </div>
    );
};

export default InputCheckBox;
