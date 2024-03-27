import { memo } from 'react';
import Select from 'react-select';

const CustomSelect = ({ label, placeholder, onChange, options = [], value, defaultValue }) => {
    return (
        <div className="flex flex-col gap-2 justify-center w-full z-[998]">
            {label && <h4 className="text-sm">{label}</h4>}
            <Select
                placeholder={placeholder}
                isClearable={false}
                isSearchable={false}
                options={options}
                value={value}
                onChange={onChange}
                defaultValue={defaultValue}
                formatOptionLabel={(option) => (
                    <div className="flex text-sm items-center gap-2">
                        <span>{option.label}</span>
                    </div>
                )}
                className="text-sm"
            />
        </div>
    );
};

export default memo(CustomSelect);
