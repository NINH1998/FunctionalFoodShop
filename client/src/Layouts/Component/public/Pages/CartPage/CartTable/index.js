import React from 'react';
import CartItem from './CartItem';
import withComponent from 'Hocs/withComponent';

const CartTable = ({ useSelector, current, currentCart }) => {
    const { cartSession } = useSelector((state) => state.appReducer);
    return (
        <table className="w-full h-full">
            <thead>
                <tr className="border-[1px] border-white bg-primary text-white ">
                    <th className="p-2 border-r-[1px] border-white rounded-lg">#</th>
                    <th className="p-2 border-[1px] border-white rounded-lg whitespace-nowrap">Sản phẩm</th>
                    <th className="p-2 border-[1px] border-white rounded-lg whitespace-nowrap">Đơn giá</th>
                    <th className="p-2 border-[1px] border-white rounded-lg whitespace-nowrap">Số lượng</th>
                    <th className="p-2 rounded-lg">Thành tiền</th>
                </tr>
            </thead>
            {(current ? currentCart : cartSession)?.map((el, index) => (
                <CartItem
                    el={el}
                    key={current ? el._id : el.product?.id}
                    index={index}
                    defaultQuantity={current ? el.quantity : el.quantity}
                />
            ))}
        </table>
    );
};

export default withComponent(CartTable);
