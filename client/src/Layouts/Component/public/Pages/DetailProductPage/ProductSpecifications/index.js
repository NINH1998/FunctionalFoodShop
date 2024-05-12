import {
    FacebookShareButton,
    FacebookIcon,
    EmailShareButton,
    EmailIcon,
    TwitterShareButton,
    TwitterIcon,
    TelegramShareButton,
    TelegramIcon,
} from 'react-share';
import { apiUpdateCart, apiUpdateWishlist } from 'Context/StoreApi';
import { formatPrice, starNumber } from 'Ultils/helper';
import { Button, IconsButton } from 'Layouts/Component/public/Common';
import { detailProductInfo } from 'Ultils/Contants';
import { addToCartSession } from 'Context/Reducer/AppState/CommonAction';
import { Link, useParams } from 'react-router-dom';
import { directCategory } from 'Context/Reducer/Products/ProductsAction';
import { memo, useState } from 'react';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { Icons } from 'Layouts/Assets/icons';
import { toast } from 'react-toastify';
import withComponent from 'Hocs/withComponent';
import moment from 'moment';
import path from 'Router/path';

const { FaHeart, FaRegHeart, FaPlus, FaMinus, TiShoppingCart } = Icons;

const ProductSpecifications = ({ product, current, dispatch, currentCart, tagProduct }) => {
    const { pid } = useParams();
    const detailProductInfoList = detailProductInfo(product);
    const [quantity, setQuantity] = useState(1);
    const currentUrl = window.location.href;

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

    const handleFilterByTag = (tagId) => {
        dispatch(directCategory({ tagId }));
    };

    return (
        <div className="tablet:w-[55%] phone:w-full relative">
            <div className="border-b-[1px] leading-10 mb-4">
                <h2 className="uppercase font-semibold text-primary">{product?.title}</h2>
                <div className="text-xl">
                    <span className="text-base font-bold">Giá bán: </span>
                    <span className="font-semibold text-red-500 mr-2">{`${formatPrice(
                        product?.price * (1 - product?.discount?.percentage / 100),
                    )} VNĐ`}</span>
                    <span className="line-through text-sm text-gray-500 ">{`${formatPrice(product?.price)} VNĐ`}</span>
                    {moment(product?.discount?.expiryDiscount).diff(moment(), 'days') > 0 && (
                        <span className="text-gray-500 text-sm">
                            {`(Còn ${moment(product?.discount?.expiryDiscount).diff(moment(), 'days')} ngày)`}
                        </span>
                    )}
                </div>
                <span className="flex">{starNumber(product?.totalRatings)}</span>
            </div>
            <ul className="flex flex-col gap-3 text-base">
                {detailProductInfoList.map((el, index) => (
                    <li key={index}>
                        {el.value && (
                            <>
                                <strong>{el.title}</strong>
                                <span className="text-primary">{el.value}</span>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {product?.uses !== '' && (
                <div className="mt-4">
                    <strong>Mô tả:</strong>
                    <p className="my-2 text-base max-h-[300px]">{product?.uses}</p>
                </div>
            )}
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
            <div className="flex flex-wrap flex-row gap-2 mt-4">
                {tagProduct?.map((el) => (
                    <Link
                        to={`/${path.TOTAL_PRODUCTS}`}
                        onClick={() => handleFilterByTag(el?._id)}
                        style={{ backgroundColor: el?.colorTag }}
                        className="flex gap-2 items-center relative rounded-full px-2 py-1 text-white
                         text-sm font-semibold hover:opacity-80 animation-200 cursor-pointer"
                        key={el?._id}
                    >
                        {<img alt="" src={el?.iconTag} className="w-5 h-5" />}
                        {el?.title}
                    </Link>
                ))}
            </div>
            <div className="flex flex-col mt-4">
                <strong>Chia sẻ:</strong>
                <div className="flex gap-1">
                    <FacebookShareButton url={currentUrl}>
                        <FacebookIcon size={24} round={true} />
                    </FacebookShareButton>
                    <EmailShareButton url={currentUrl}>
                        <EmailIcon size={24} round={true} />
                    </EmailShareButton>
                    <TwitterShareButton url={currentUrl}>
                        <TwitterIcon size={24} round={true} />
                    </TwitterShareButton>
                    <TelegramShareButton url={currentUrl}>
                        <TelegramIcon size={24} round={true} />
                    </TelegramShareButton>
                </div>
            </div>
        </div>
    );
};

export default withComponent(memo(ProductSpecifications));
