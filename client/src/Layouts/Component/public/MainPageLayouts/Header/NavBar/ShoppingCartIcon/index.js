import { Icons } from 'Layouts/Assets/icons';
import { memo } from 'react';
import withComponent from 'Hocs/withComponent';

const { TiShoppingCart } = Icons;

const ShoppingCartIcon = ({ current, setOpenCartModal, useSelector }) => {
    const { cartSession } = useSelector((state) => state.appReducer);

    return (
        <div
            className="flex relative items-center cursor-pointer hover:scale-110 animation-200"
            onClick={() => setOpenCartModal(true)}
        >
            <TiShoppingCart size="28px" color="#65a30d" />
            {(current ? current?.cart?.length : cartSession?.length) > 0 && (
                <span className="flex absolute top-[-5px] right-[-5px]">
                    <span className="animate-ping absolute inline-flex p-2 h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative p-2 flex justify-center items-center rounded-full h-3 w-3 bg-red-500 text-[12px] text-white font-bold">
                        {current?.cart?.length || cartSession?.length}
                    </span>
                </span>
            )}
        </div>
    );
};

export default withComponent(memo(ShoppingCartIcon));
