import { useState, memo, useCallback, useRef } from 'react';
import { filterProducts } from 'Context/Reducer/Products/ProductsAction';
import { sortsByOrder } from 'Ultils/Contants';
import { Button } from '../../../Common';
import { Select } from 'antd';
import { Icons } from 'Layouts/Assets/icons';
import withComponent from 'Hocs/withComponent';
import FilterInput from './FilterInput';

const { FaFilter } = Icons;

const FilterFunction = ({
    selected,
    setSeclected,
    selectedMainField,
    setSelectedMainField,
    sort,
    setSort,
    setDiscount,
    price,
    setPrice,
    openFilter,
    setOpenFilter,
    handleFilter,
    useSelector,
    dispatch,
}) => {
    const { filterProductValue } = useSelector((state) => state.productsReducer);
    const [seclectValue, setSeclectValue] = useState(filterProductValue?.sort || '-createdAt');

    const handleOpenFilter = () => {
        setOpenFilter(!openFilter);
    };

    const handleChangeOptions = useCallback((value) => {
        if (sort) dispatch(filterProducts({ filterProductValue: null }));
        setSeclectValue(value);
        if (value === 'discount') {
            const filterDiscount = { 'discount.percentage': { gt: 0 } };
            setDiscount(filterDiscount);
        } else {
            setSort(value);
            setDiscount(null);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div
            className="relative p-4 mb-8 flex gap-2 justify-between items-center 
        desktop:w-main laptop:flex-row phone:flex-col phone:w-full overflow-auto"
        >
            <Select
                value={seclectValue}
                style={{ minWidth: '200px' }}
                onChange={handleChangeOptions}
                options={sortsByOrder}
            />
            <Button
                styles="flex gap-2 items-center px-3 py-2 text-white bg-primary rounded-md shadow-small cursor-pointer"
                handleOnclick={handleOpenFilter}
                iconBefore={<FaFilter />}
            >
                <span className="text-sm font-semibold">Lọc sản phẩm</span>
            </Button>
            <FilterInput
                selected={selected}
                setSeclected={setSeclected}
                selectedMainField={selectedMainField}
                setSelectedMainField={setSelectedMainField}
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                handleFilter={handleFilter}
                setPrice={setPrice}
                price={price}
            />
        </div>
    );
};

export default withComponent(memo(FilterFunction));
