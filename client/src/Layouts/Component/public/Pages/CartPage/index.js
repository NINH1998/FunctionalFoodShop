import { showCartButtonModal } from 'Context/Reducer/AppState/CommonAction';
import { useSelector } from 'react-redux';
import { formatPrice } from 'Ultils/helper';
import { useEffect } from 'react';
import { Images } from 'Layouts/Assets/icons';
import { Button } from '../../Common';
import { Link } from 'react-router-dom';
import withComponent from 'Hocs/withComponent';
import BreadCrumbs from '../BreadCrumb';
import CartTable from './CartTable';
import path from 'Router/path';

const CartPage = ({ current, currentCart, dispatch }) => {
    const { cartSession } = useSelector((state) => state.appReducer);

    useEffect(() => {
        dispatch(showCartButtonModal({ isCartButtonModal: false }));
        window.scrollTo(0, 0);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="w-full">
            <div className="w-full px-6 py-3 text-end bg-gray-200">
                <BreadCrumbs />
            </div>
            <div className="p-6 flex flex-col items-center w-full">
                <div className="relative desktop:w-main phone:w-full phone:overflow-auto tablet:overflow-hidden">
                    <CartTable />
                </div>
                <div className="flex justify-end phone:w-full desktop:w-main border-b-[2px] border-gray-300">
                    <div className="py-4 px-2">
                        <div className="flex justify-end">
                            <div>Tổng tiền: </div>
                            <span className="ml-2 text-red-500 font-semibold text-lg">
                                {`${
                                    formatPrice(
                                        (current ? currentCart : cartSession)?.reduce(
                                            (sum, el) => sum + el.product?.price * el.quantity,
                                            0,
                                        ),
                                    ) || 0
                                } VNĐ`}
                            </span>
                        </div>
                    </div>
                </div>
                {(current ? currentCart?.length > 0 : cartSession?.length > 0) && (
                    <div className="flex justify-end phone:w-full desktop:w-main">
                        <Link to={`/${path.CHECK_OUT}`}>
                            <Button>Thanh toán</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withComponent(CartPage);
