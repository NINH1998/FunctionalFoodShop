import { forwardRef, memo } from 'react';
import { FaCheck } from 'react-icons/fa';

const InputRadio = forwardRef(({ label, labelIcon, handleOnclick, handleOnChange, check, id, ...register }, ref) => {
    return (
        <div className="relative shadow-small rounded-sm">
            <input
                type="radio"
                className="hidden peer"
                id={id}
                name={label}
                checked={check}
                onChange={handleOnChange}
                onClick={handleOnclick}
                ref={ref}
                {...register}
            />
            {label && (
                <label
                    className="flex items-center text-sm gap-2 bg-gray-100 hover:bg-gray-200 animation-200 rounded-sm cursor-pointer py-2 pl-4 pr-12"
                    htmlFor={id}
                >
                    {labelIcon}
                    <span>{label}</span>
                </label>
            )}
            <div className="flex justify-center items-center absolute top-0 bottom-0 bg-green-500 w-6 h-6 my-auto rounded-full right-4 peer-checked:scale-90 scale-0 animation-200">
                <FaCheck color="white" />
            </div>
        </div>
    );
});

export default memo(InputRadio);
