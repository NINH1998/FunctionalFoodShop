import { apiUpdateCart, apiUpdateWishlist } from 'Context/StoreApi';
import withComponent from 'Hocs/withComponent';
import { Icons } from 'Layouts/Assets/icons';
import React, { memo, useState } from 'react';
import { detailProductInfo } from 'Ultils/Contants';
import { formatPrice, starNumber } from 'Ultils/helper';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, IconsButton } from 'Layouts/Component/public/Common';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { addToCartSession } from 'Context/Reducer/AppState/CommonAction';

const { FaHeart, FaRegHeart, FaPlus, FaMinus, TiShoppingCart } = Icons;

const ProductSpecifications = ({ product, current, dispatch, currentCart }) => {
    const { pid } = useParams();
    const detailProductInfoList = detailProductInfo(product);
    const [quantity, setQuantity] = useState(1);

    const handleAddToWishlist = async () => {
        const response = await apiUpdateWishlist(pid);
        if (response.success) {
            dispatch(getCurrentUser());
            toast.success(response.message);
        } else toast.error(response.message);
    };

    const handleSetTextQuantity = (number) => {
        if (!+number && number !== '') return;
        setQuantity(number);
    };

    const handleCalcQuantity = (data) => {
        if (data === 'minus' && quantity > 1) setQuantity(quantity - 1);
        if (data === 'plus') setQuantity(quantity + 1);
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
            toast.success('Đã thêm vào giỏ hàng');
        }
    };

    return (
        <div className="tablet:w-[55%] phone:w-full relative">
            <div className="border-b-[1px] leading-10 mb-4">
                <h2 className="uppercase font-semibold text-primary">{product?.title}</h2>
                <div className="text-xl">
                    Giá bán: <strong className="text-primary">{formatPrice(product?.price)} Đ</strong>
                </div>
                <span className="flex">{starNumber(product?.totalRatings)}</span>
            </div>
            <ul className="leading-10 text-base">
                {detailProductInfoList.map((el, index) => (
                    <li key={index}>
                        <strong>{el.title}</strong>
                        <span className="text-primary">{el.value}</span>
                    </li>
                ))}
            </ul>
            <strong>Mô tả:</strong>
            <p className="my-2 text-base max-h-[300px] overflow-auto">{product?.uses}</p>
            <div className="mt-6 flex flex-col gap-2">
                <label htmlFor="quantity" className="font-bold">
                    Số lượng:
                </label>
                <div className="flex phone:flex-col laptop:flex-row items-center gap-4">
                    <div className="flex">
                        <IconsButton
                            styles="calc-btn"
                            handleOnclick={() => handleCalcQuantity('plus')}
                            icon={<FaPlus size={16} />}
                        />
                        <input
                            id="quantity"
                            className="p-3 text-center border-y-[1px] w-[50px] outline-none"
                            type="text"
                            value={quantity}
                            onChange={(e) => handleSetTextQuantity(e.target.value)}
                            onBlur={() => quantity === '' && setQuantity(1)}
                        />
                        <IconsButton
                            styles="calc-btn"
                            handleOnclick={() => handleCalcQuantity('minus')}
                            icon={<FaMinus size={16} />}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            handleOnclick={() => handleAddCart(pid)}
                            styles="btn-primary"
                            iconBefore={<TiShoppingCart />}
                        >
                            <p className="ml-2">Thêm vào giỏ hàng</p>
                        </Button>
                        <IconsButton
                            styles="btn-primary"
                            handleOnclick={handleAddToWishlist}
                            icon={
                                current?.wishlist?.some((el) => el.product?._id === product?._id) ? (
                                    <FaHeart color="white" size={16} />
                                ) : (
                                    <FaRegHeart color="white" size={16} />
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withComponent(memo(ProductSpecifications));
