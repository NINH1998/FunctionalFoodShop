import { useEffect, useState, memo, useRef } from 'react';
import { Button, CloseModalButton } from 'Layouts/Component/public/Common';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { apiGetProducts } from 'Context/StoreApi';
import { formatPrice } from 'Ultils/helper';
import { Slider } from 'antd';
import { Icons } from 'Layouts/Assets/icons';
import withComponent from 'Hocs/withComponent';
import InputCheckBox from 'Layouts/Component/public/Common/InputCheckBox';

const { IoClose } = Icons;

const FilterInput = ({
    selected,
    setSeclected,
    selectedMainField,
    setSelectedMainField,
    setPrice,
    price,
    openFilter,
    setOpenFilter,
    handleFilter,
    useSelector,
    navigate,
    location,
}) => {
    const { categories } = useSelector((state) => state.categoriesReducer);
    const [params] = useSearchParams();
    const { pathname } = location;
    const isProductPath = pathname.replace('/', '');
    const [bestPrice, setBestPrice] = useState(null);
    const [bestPriceDiscount, setBestPriceDiscount] = useState(null);
    const [lowestPrice, setLowestPrice] = useState(null);
    const [lowestPriceDiscount, setLowestPriceDiscount] = useState(null);
    const filterRef = useRef();

    const hanldeChekbox = (e) => {
        const checked = selected.find((el) => el === e.target.value);
        if (checked) setSeclected((prev) => prev.filter((el) => el !== e.target.value));
        else setSeclected((prev) => [...prev, e.target.value]);
    };

    const hanldeMainFieldChekbox = (e) => {
        const checked = selectedMainField.find((el) => el === e.target.value);
        if (checked) setSelectedMainField((prev) => prev.filter((el) => el !== e.target.value));
        else setSelectedMainField((prev) => [...prev, e.target.value]);
    };

    const sortBestPriceProduct = async () => {
        const queries = Object.fromEntries([...params]);
        const response = await apiGetProducts({ sort: '-price', limit: 1 });
        if (response.success) {
            setBestPrice(response.products[0]?.price);
            setBestPriceDiscount(response.products[0]?.discount.percentage);
            setPrice((prev) => {
                const newBestPrice = response.products[0]?.price;
                return newBestPrice > prev.To ? { ...prev, To: queries.To ? queries.To : newBestPrice } : prev;
            });
        }
    };

    const lowestPriceProduct = async () => {
        const queries = Object.fromEntries([...params]);
        const response = await apiGetProducts({ sort: 'price', limit: 1 });
        if (response.success) {
            setLowestPrice(response.products[0]?.price);
            setLowestPriceDiscount(response.products[0]?.discount.percentage);
            setPrice((prev) => {
                const newLowestPrice = response.products[0]?.price;
                return newLowestPrice > prev.From ? { ...prev, From: newLowestPrice } : prev;
            });
        }
    };

    useEffect(() => {
        sortBestPriceProduct();
        lowestPriceProduct();

        // eslint-disable-next-line
    }, [params]);

    const handleResetAllFilter = () => {
        setSeclected([]);
        setSelectedMainField([]);
        setPrice((prev) => ({ ...prev, From: lowestPrice, To: bestPrice }));
        navigate({
            pathname: window.location.pathname,
            search: '',
        });
    };

    const handleSliderChange = (value) => {
        setPrice({ ...price, From: value[0], To: value[1] });
    };

    return (
        <AnimatePresence>
            {openFilter && (
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    ref={filterRef}
                    className="fixed top-[55px] right-0 h-full bg-white shadow-large shadow-black/[0.3] z-[999] laptop:w-auto phone:w-[70%]"
                >
                    <div className="relative p-4">
                        <CloseModalButton onClose={() => setOpenFilter(false)} icon={<IoClose size={24} />} />
                        <div className="laptop:min-w-[350px] phone:text-sm phone:w-full mt-6">
                            <p className="text-lg font-bold my-2">Tìm kiếm theo loại:</p>
                            <div className="max-h-[430px] overflow-auto">
                                {isProductPath === 'san-pham' &&
                                    categories?.map((category) => {
                                        return (
                                            <div className="flex flex-col gap-2 justify-center p-2" key={category._id}>
                                                <div className="flex items-center gap-2">
                                                    <InputCheckBox
                                                        id={category.title}
                                                        value={category._id}
                                                        label={category.title}
                                                        handleOnChange={hanldeMainFieldChekbox}
                                                        checked={selectedMainField?.some(
                                                            (check) => check === category._id,
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2 ml-8">
                                                    {category?.listCategory?.map((i) => (
                                                        <div
                                                            key={i._id}
                                                            className="flex justify-start gap-1 items-center"
                                                        >
                                                            <InputCheckBox
                                                                id={i.itemTitle}
                                                                type="checkbox"
                                                                value={i.itemTitle}
                                                                label={i.itemTitle}
                                                                handleOnChange={hanldeChekbox}
                                                                checked={selected?.some(
                                                                    (check) => check === i.itemTitle,
                                                                )}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <p className="text-lg font-bold my-2">Tìm kiếm theo giá:</p>
                            <div className="mx-auto">
                                <Slider
                                    range={{ draggableTrack: true }}
                                    min={lowestPrice}
                                    max={bestPrice}
                                    value={[price?.From, price?.To]}
                                    defaultValue={[lowestPrice, bestPrice]}
                                    onChange={handleSliderChange}
                                    tooltip={{ open: false }}
                                />
                            </div>
                            <div>
                                <p className="mt-4 text-sm text-center">
                                    Tìm kiếm giá từ{' '}
                                    <span className="font-semibold text-red-500">
                                        {formatPrice(
                                            Math.round((price?.From / 1000) * (1 - lowestPriceDiscount / 100)) * 1000,
                                        )}
                                    </span>{' '}
                                    đến{' '}
                                    <span className="font-semibold  text-red-500">
                                        {formatPrice(
                                            Math.round((price?.To / 1000) * (1 - bestPriceDiscount / 100)) * 1000,
                                        )}
                                    </span>{' '}
                                    VNĐ
                                </p>
                            </div>
                            <div className="flex gap-2 items-center justify-center mt-4">
                                <Button handleOnclick={handleFilter}>Lọc sản phẩm</Button>
                                <Button handleOnclick={handleResetAllFilter}>Làm mới</Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default withComponent(memo(FilterInput));
