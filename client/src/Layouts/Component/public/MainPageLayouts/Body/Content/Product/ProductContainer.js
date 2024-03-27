import { createSlug, formatPrice, starNumber } from 'Ultils/helper';
import { memo, useState } from 'react';
import { Images } from 'Layouts/Assets/icons';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ActionBtn from './ActionBtn';
import moment from 'moment';

const ProductContainer = ({ product }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative mx-5">
            <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className="relative">
                <ActionBtn isOpen={isOpen} setIsOpen={setIsOpen} product={product} />
                <Link to={`/${createSlug(product?.category)}/${product?._id}/${createSlug(product?.title)}`}>
                    <ProductCard thumb={product?.thumb} isOpen={isOpen} />
                </Link>
            </div>
            {product?.isNewProduct && (
                <div
                    style={{ background: `url(${Images.NewItemIcon}) center center / cover no-repeat` }}
                    className="absolute w-12 h-12 top-0 left-[-20px]"
                ></div>
            )}
            {product?.discount?.percentage > 0 && (
                <div
                    style={{ background: `url(${Images.DiscountLabel}) center center / cover no-repeat` }}
                    className="absolute flex justify-center items-center text-white text-sm z-10 w-[50px] h-[50px] top-[50px] left-[-20px]"
                >
                    <div className="-rotate-45 font-semibold">{product.discount.percentage}%</div>
                </div>
            )}
            <div className="flex flex-col gap-2 mt-8">
                <div className="relative top-0 left-0 text-center w-full">
                    <h4 className="line-clamp-2 text-lg">{product?.title}</h4>
                </div>
                <div className="text-center w-full text-red-500">
                    {product?.discount?.percentage ? (
                        <div className="flex flex-col text-lg">
                            <span>{`${formatPrice(product?.price)} VNĐ`}</span>
                            <div>
                                <span className="line-through text-sm text-gray-500 ">{`${formatPrice(
                                    product?.price / (1 - product?.discount?.percentage / 100),
                                )} VNĐ`}</span>
                                {moment(product?.discount?.expiryDiscount).diff(moment(), 'days') > 0 && (
                                    <span className="text-gray-500 text-sm">
                                        {`(Còn ${moment(product?.discount?.expiryDiscount).diff(
                                            moment(),
                                            'days',
                                        )} ngày)`}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <span>{`${formatPrice(product?.price)} VNĐ`}</span>
                    )}
                </div>
                <span className="flex justify-center">{starNumber(product?.totalRatings)}</span>
            </div>
        </div>
    );
};

export default memo(ProductContainer);
