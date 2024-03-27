import { memo } from 'react';
import clsx from 'clsx';

const InputForm = ({
    styles,
    label,
    disabled,
    register,
    errors,
    id,
    value,
    validate,
    type = 'text',
    placeholder,
    fullwidth,
    defaultValue,
    containerStyle,
}) => {
    return (
        <div
            className={containerStyle || clsx('flex flex-col justify-center gap-2 min-h-[90px]', fullwidth && 'w-full')}
        >
            {label && (
                <label htmlFor={id} className="text-sm whitespace-nowrap font-semibold">
                    {label}
                </label>
            )}
            <input
                className={
                    styles || clsx('form-input h-[39px] text-sm p-2 !rounded !border-gray-400', fullwidth && 'w-full')
                }
                type={type}
                id={id}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                defaultValue={defaultValue}
                value={value}
            />
            {errors[id] && <small className="text-xs text-red-500">{errors[id].message}</small>}
        </div>
    );
};

export default memo(InputForm);
