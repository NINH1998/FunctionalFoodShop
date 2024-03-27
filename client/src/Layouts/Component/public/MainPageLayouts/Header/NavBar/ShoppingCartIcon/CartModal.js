import { Button, CloseModalButton } from 'Layouts/Component/public/Common';
import { removeSessionCartItems } from 'Context/Reducer/AppState/CommonAction';
import { apiRemoveCartItem } from 'Context/StoreApi';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { formatPrice } from 'Ultils/helper';
import { useSelector } from 'react-redux';
import { Icons } from 'Layouts/Assets/icons';
import { memo } from 'react';
import withComponent from 'Hocs/withComponent';
import path from 'Router/path';

const { MdDelete } = Icons;

const CartModal = ({ navigate, setOpenModal, currentCart, current, dispatch }) => {
    const { cartSession } = useSelector((state) => state.appReducer);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteCartItem = async (id) => {
        if (current) {
            const response = await apiRemoveCartItem(id);
            if (response.success) {
                dispatch(getCurrentUser());
                if (currentCart?.length === 1) setOpenModal(false);
            }
        } else {
            dispatch(removeSessionCartItems({ id }));
        }
    };

    return (
        <div className="flex flex-col font-arima p-4 h-full max-h-[700px] max-w-[1000px] bg-white rounded-lg">
            <CloseModalButton onClose={handleCloseModal} />
            <h3 className="flex-0 border-b-2 uppercase text-primary">Giỏ hàng</h3>
            <div className="flex-8 grid tablet:grid-cols-2 phone:grid-cols-1 auto-rows-min gap-6 p-2 overflow-auto">
                {(current ? currentCart : cartSession)?.map((el) => (
                    <div
                        key={el.product?._id || el.product?.id}
                        className="relative max-h-[180px] min-h-[150px] overflow-auto flex gap-4 items-center border-[1px] border-gray-300 rounded-md p-2"
                    >
                        <img className="h-[120px] w-[120px] object-cover" src={el.product?.thumb} alt=""></img>
                        <div className="w-full p-2">
                            <h4 className="uppercase text-base">{el.product?.title}</h4>
                            <p>{el.product?.uses}</p>
                            <span>
                                Giá: <span className="text-red-500">{formatPrice(el.product?.price)} VNĐ</span>
                            </span>
                        </div>
                        <div className="absolute bottom-2 right-2 text-sm font-semibold">Số lượng: {el.quantity}</div>
                        <div
                            onClick={() => handleDeleteCartItem(el.product?._id || el.product?.id)}
                            className="absolute top-[10px] right-[10px] hover:scale-110 cursor-pointer"
                        >
                            <MdDelete color="gray" size={24} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-2">
                <div className="flex flex-col gap-2 items-end border-b-2">
                    <strong className="mt-8 mb-2 text-lg">
                        Tổng tiền:{' '}
                        <span className="text-red-500">
                            {`${formatPrice(
                                (current ? currentCart : cartSession)?.reduce((sum, el) => sum + el.product?.price, 0),
                            )} VNĐ`}
                        </span>
                    </strong>
                </div>
                {(currentCart?.length > 0 || cartSession?.length > 0) && (
                    <div className="flex gap-2 justify-end">
                        <Button handleOnclick={() => setOpenModal(false)} to={`/${path.CART}`}>
                            Đi đến giỏ hàng
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withComponent(memo(CartModal));
