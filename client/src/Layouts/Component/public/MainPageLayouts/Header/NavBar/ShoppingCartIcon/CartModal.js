import { Button, CloseModalButton, IconsButton, Loading } from 'Layouts/Component/public/Common';
import { removeSessionCartItems } from 'Context/Reducer/AppState/CommonAction';
import { apiRemoveCartItem } from 'Context/StoreApi';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { memo, useState } from 'react';
import { formatPrice } from 'Ultils/helper';
import { useSelector } from 'react-redux';
import { PuffLoader } from 'react-spinners';
import { Icons } from 'Layouts/Assets/icons';
import withComponent from 'Hocs/withComponent';
import path from 'Router/path';

const { MdDelete } = Icons;

const CartModal = ({ navigate, setOpenModal, currentCart, current, dispatch }) => {
    const { cartSession } = useSelector((state) => state.appReducer);
    const [isLoading, setIsLoading] = useState(null);
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDeleteCartItem = async (id) => {
        if (current) {
            setIsLoading(id);
            const response = await apiRemoveCartItem(id);
            setIsLoading(null);
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
                    <div key={el.product?._id || el.product?.id} className="relative">
                        <div className="pt-2 pl-2 pr-8 pb-8 border-[1px] border-gray-300 rounded-md">
                            <div className="min-h-[180px] flex gap-4 items-center">
                                <div className="min-w-[120px]">
                                    <img
                                        className="h-[120px] w-[120px] object-cover"
                                        src={el.product?.thumb}
                                        alt=""
                                    ></img>
                                </div>
                                <div className="w-full">
                                    <h4 className="uppercase text-base">{el.product?.title}</h4>
                                    <p className="line-clamp-3">{el.product?.uses}</p>
                                    <div className="mt-2">
                                        Giá: <span className="text-red-500">{formatPrice(el.product?.price)} VNĐ</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 text-sm font-semibold">
                                Số lượng: {el.quantity}
                            </div>
                            {isLoading === el.product?._id ? (
                                <div className="absolute top-[10px] right-[10px]">
                                    <Loading shape={<PuffLoader color="#f43f5e" size={24} />} />
                                </div>
                            ) : (
                                <IconsButton
                                    handleOnclick={() => handleDeleteCartItem(el.product?._id || el.product?.id)}
                                    styles="absolute top-[10px] right-[10px] hover:scale-110 cursor-pointer"
                                    icon={<MdDelete color="#f43f5e" size={24} />}
                                />
                            )}
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
