import { apiGetProduct, apiUpdateCart, apiUpdateWishlist } from 'Context/StoreApi';
import { IconsButton, CloseModalButton, Button, Loading } from 'Layouts/Component/public/Common';
import { useState, memo, useEffect, forwardRef } from 'react';
import { detailProductInfo } from 'Ultils/Contants';
import { addToCartSession } from 'Context/Reducer/AppState/CommonAction';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { Icons } from 'Layouts/Assets/icons';
import { toast } from 'react-toastify';
import withComponent from 'Hocs/withComponent';
import CustomSwiper from 'Layouts/Component/public/Common/CustomSwiper';

const { FaHeart, FaRegHeart, FaPlus, FaMinus, TiShoppingCart } = Icons;

const QuickViewModal = forwardRef(({ pid, dispatch, current, currentCart, setIsModalOpen }, ref) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProduct = async () => {
        setIsLoading(true);
        const response = await apiGetProduct(pid);
        setIsLoading(false);
        if (response.success) setProduct(response.product);
    };

    useEffect(() => {
        if (pid) fetchProduct();
        // eslint-disable-next-line
    }, [pid]);

    const handleSetQuantity = (number) => {
        if (!+number && number !== '') return;
        setQuantity(number);
    };

    const handleCalcQuantity = (data) => {
        if (data === 'minus' && quantity > 1) setQuantity(quantity - 1);
        if (data === 'plus') setQuantity(quantity + 1);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddCart = async (pid) => {
        const remainQuanity = currentCart.find((el) => el.product._id === pid)?.quantity;
        if (current) {
            const response = await apiUpdateCart({
                pid,
                quantity: remainQuanity ? quantity + remainQuanity : quantity || 1,
            });
            if (response.success) {
                dispatch(getCurrentUser());
                toast.success(response.message);
            } else toast.error(response.message);
        } else {
            dispatch(
                addToCartSession({
                    product: {
                        thumb: product?.thumb,
                        title: product?.title,
                        id: product?._id,
                        price: product?.price,
                    },
                    quantity: quantity,
                }),
            );
            toast.success('Đã thêm vào giỏ');
        }
    };

    const handleAddToWishlist = async () => {
        const response = await apiUpdateWishlist(pid);
        if (response.success) {
            dispatch(getCurrentUser());
            toast.success(response.message);
        } else toast.error(response.message);
    };

    const detailProductInfoList = detailProductInfo(product);

    return isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
            <Loading color={'white'} />
        </div>
    ) : (
        <div
            ref={ref}
            className="relative bg-white font-arima text-base mx-auto rounded-lg overflow-auto p-6
                 laptop:w-[1000px] tablet:w-[760px] tablet:max-h-[650px] phone:w-[375px] phone:max-h-[700px]"
        >
            <CloseModalButton onClose={handleCloseModal} />
            <div className="w-full h-full flex phone:flex-col tablet:flex-row">
                <div className="tablet:w-1/2 overflow-auto laptop:mb-0 phone:mb-10">
                    <div className="border-b-[1px] leading-10 mb-4">
                        <h2 className="uppercase font-semibold text-primary">{product?.title}</h2>
                        <div className="text-xl">
                            Giá bán: <strong className="text-red-500">{product?.price}</strong>
                        </div>
                    </div>
                    <ul className="leading-10">
                        {detailProductInfoList.map((el, index) => (
                            <li key={index}>
                                <strong>{el.title}</strong>
                                <span className="text-primary">{el.value}</span>
                            </li>
                        ))}
                    </ul>
                    <strong>Mô tả:</strong>
                    <p className="my-2 text-base max-h-[300px] overflow-auto">{product?.uses}</p>
                    <div className="flex laptop:flex-row phone:flex-col phone:items-start laptop:items-center laptop:gap-4 phone:gap-2">
                        <label htmlFor="quantity" className="font-bold">
                            Số lượng:
                        </label>
                        <div className="flex">
                            <IconsButton
                                styles="calc-btn"
                                handleOnclick={() => handleCalcQuantity('plus')}
                                icon={<FaPlus />}
                            />
                            <input
                                className="p-2 text-center border-y-[1px] w-[50px] outline-none"
                                type="text"
                                value={quantity}
                                onChange={(e) => handleSetQuantity(e.target.value)}
                                onBlur={() => quantity === '' && setQuantity(1)}
                            />
                            <IconsButton
                                styles="calc-btn"
                                handleOnclick={() => handleCalcQuantity('minus')}
                                icon={<FaMinus />}
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button
                                handleOnclick={() => handleAddCart(pid)}
                                styles="flex p-2 items-center btn-primary text-white font-semibold select-none"
                                iconBefore={<TiShoppingCart color="white" />}
                            >
                                <p className="ml-2 whitespace-nowrap">Thêm vào giỏ hàng</p>
                            </Button>
                            <IconsButton
                                styles="btn-primary p-3 select-none"
                                handleOnclick={handleAddToWishlist}
                                icon={
                                    current?.wishlist?.some((el) => el.product?._id === pid) ? (
                                        <FaHeart color="white" size="16px" />
                                    ) : (
                                        <FaRegHeart color="white" size="16px" />
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="tablet:w-1/2 phone:w-full ml-4">
                    <div className="flex flex-col">
                        <div className="main-swiper select-none">
                            <CustomSwiper
                                slidesPerView={1}
                                navigation={true}
                                arrayData={product?.images}
                                loop={true}
                                effect={'fade'}
                                thumbsSwiper={thumbsSwiper}
                                isThumb="main"
                                styles="laptop:min-h-[420px] phone:min-h-[350px] w-full object-cover"
                            ></CustomSwiper>
                        </div>
                        <div className="sub-swiper select-none mt-2">
                            <CustomSwiper
                                spaceBetween={20}
                                navigation={true}
                                slidesPerView={3}
                                phone={3}
                                loop={true}
                                arrayData={product?.images}
                                watchSlidesProgress={true}
                                onSwiper={setThumbsSwiper}
                                freeMode={true}
                                isThumb="sub"
                            ></CustomSwiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default withComponent(memo(QuickViewModal));
