import { setInvalidField } from 'Context/Reducer/AppState/CommonAction';
import { memo } from 'react';
import withComponent from 'Hocs/withComponent';
import React from 'react';
import clsx from 'clsx';

const InputField = ({
    setValue,
    label,
    style,
    placeholder,
    value,
    nameKey,
    type,
    id,
    invalidField,
    dispatch,
    onKeyDown,
    moreCss,
}) => {
    return (
        <div className="relative">
            {label && (
                <label
                    htmlFor={nameKey}
                    className="absolute top-[14px] left-[5px] text-semibold text-sm text-gray-500 bg-white px-1 font-semibold"
                >
                    {nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}:
                </label>
            )}
            <input
                className={
                    style
                        ? style
                        : clsx(
                              `text-sm mt-6 w-full appearance-none border-2 rounded p-2 text-gray-700 
                        focus:outline-blue-300 focus:shadow-outline placeholder:italic placeholder:text-sm`,
                              moreCss,
                          )
                }
                id={id}
                type={type || 'text'}
                placeholder={placeholder ? placeholder : nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={(e) => setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))}
                onKeyDown={onKeyDown ? onKeyDown : null}
                onFocus={() => dispatch(setInvalidField(''))}
            />
            {invalidField?.some((el) => el.name === nameKey) && (
                <p className="text-xs text-red-500 italic py-2 font-semibold">
                    {invalidField.find((el) => el.name === nameKey)?.mes}
                </p>
            )}
        </div>
    );
};

export default withComponent(memo(InputField));
