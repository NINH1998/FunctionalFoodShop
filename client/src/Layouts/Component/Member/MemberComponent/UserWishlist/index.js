import React from 'react';
import Product from '../../../public/MainPageLayouts/Body/Content/Product/ProductContainer';
import withComponent from 'Hocs/withComponent';

const UserWishlist = ({ current }) => {
    return (
        <div className="w-full h-full">
            <h3 className="flex items-center sticky w-full phone:top-[35px] laptop:top-0 p-4 uppercase h-[50px] text-primary shadow-md z-[998] bg-gray-100">
                Sản phẩm yêu thích
            </h3>
            <div className="grid tablet:grid-cols-3 desktop:grid-cols-5 phone:grid-cols-2 gap-4 mt-4">
                {current?.wishlist?.map((el) => (
                    <Product key={el._id} product={el.product} />
                ))}
            </div>
        </div>
    );
};

export default withComponent(UserWishlist);
