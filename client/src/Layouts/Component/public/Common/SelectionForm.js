import { memo } from 'react';
import clsx from 'clsx';

const SelectionForm = ({
    styles,
    label,
    options = [],
    register,
    id,
    validate,
    style,
    fullwidth,
    errors,
    defaultValue,
    onChange,
}) => {
    return (
        <div className={clsx('flex flex-col gap-2 justify-center', fullwidth && 'w-full')}>
            {label && (
                <label htmlFor={id} className="text-sm font-semibold">
                    {label}
                </label>
            )}
            <select
                className={
                    styles ||
                    clsx('form-select h-[35px] !text-sm !p-2 !rounded !border-gray-400', fullwidth && 'w-full')
                }
                {...register(id, validate)}
                defaultValue={defaultValue}
                id={id}
                onChange={onChange}
            >
                {options?.map((el) => (
                    <option value={el.value} key={el.id}>
                        {el.value}
                    </option>
                ))}
            </select>
            {errors[id] && <small className="text-xs text-red-500">{errors[id].message}</small>}
        </div>
    );
};

export default memo(SelectionForm);
