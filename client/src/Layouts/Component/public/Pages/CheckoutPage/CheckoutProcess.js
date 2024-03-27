import withComponent from 'Hocs/withComponent';
import { formatPrice } from 'Ultils/helper';
import { Button } from '../../Common';

const CheckoutProcess = ({ current, currentCart, useSelector }) => {
    const { cartSession } = useSelector((state) => state.appReducer);

    return (
        <div className="inline-block laptop:w-[40%] laptop:mt-0 phone:mt-4 w-full">
            <div className="p-2 border-2 shadow-default shadow-gray-300">
                {(current ? currentCart : cartSession)?.map((el) => (
                    <div
                        key={current ? el._id : el.product.id}
                        className="flex justify-center items-center border-b-2 p-2 text-sm"
                    >
                        <img src={el.product?.thumb} alt="" className="flex-1 object-fill w-[70px] h-[70px]"></img>
                        <h4 className="flex-5 ml-2 text-sm">{el.product?.title}</h4>
                        <span className="flex-2 text-center">{el.quantity}</span>
                        <span className="flex-3 text-center whitespace-nowrap">
                            {formatPrice(el.product?.price * el.quantity)} VNĐ
                        </span>
                    </div>
                ))}
                <div className="p-2 mt-4">
                    <div className="flex justify-between p-4 bg-gray-100 border-b-2">
                        <span>Tạm tính</span>
                        <span className="font-semibold">
                            {formatPrice(
                                (current ? currentCart : cartSession)?.reduce(
                                    (sum, el) => sum + el.product.price * el.quantity,
                                    0,
                                ),
                            )}{' '}
                            VNĐ
                        </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-100 border-b-2">
                        <span>Giảm giá:</span>
                        <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-100 border-b-2">
                        <span>Thành tiền</span>
                        <span className="text-red-500 font-semibold">
                            {`${formatPrice(
                                (current ? currentCart : cartSession)?.reduce(
                                    (sum, el) => sum + el.product.price * el.quantity,
                                    0,
                                ),
                            )} VNĐ`}
                        </span>
                    </div>
                    <Button fw>Thanh toán</Button>
                </div>
            </div>
        </div>
    );
};

export default withComponent(CheckoutProcess);
