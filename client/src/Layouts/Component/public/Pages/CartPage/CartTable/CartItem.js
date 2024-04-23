import { removeSessionCartItems, updateCartQuantity } from 'Context/Reducer/AppState/CommonAction';
import { apiRemoveCartItem, apiUpdateCart } from 'Context/StoreApi';
import { memo, useEffect, useState } from 'react';
import { IconsButton, Loading } from 'Layouts/Component/public/Common';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { formatPrice } from 'Ultils/helper';
import { PuffLoader } from 'react-spinners';
import { Icons } from 'Layouts/Assets/icons';
import withComponent from 'Hocs/withComponent';
import useDebounce from 'Hooks/useDebounce';

const { FaPlus, FaMinus, MdDelete } = Icons;

const CartItemsTable = ({ dispatch, defaultQuantity, current, el, index }) => {
    const [quantity, setQuantity] = useState(defaultQuantity);
    const [isLoading, setIsLoading] = useState(false);

    const handleSetQuantity = async (number) => {
        if (!+number && number !== '') return;
        setQuantity(number);
    };

    const handleCalcQuantity = async (data) => {
        if (data === 'minus' && quantity > 1) setQuantity((prev) => +prev - 1);
        if (data === 'plus') setQuantity((prev) => +prev + 1);
    };

    const debounceValue = useDebounce(quantity, 500);
    useEffect(() => {
        if (current) {
            const updateCart = async () => {
                if (quantity !== defaultQuantity) {
                    const response = await apiUpdateCart({ pid: el.product?._id, quantity: quantity || 1 });
                    if (response.success) dispatch(getCurrentUser());
                }
            };
            updateCart();
        } else {
            dispatch(updateCartQuantity({ quantity, productId: el?.product?.id }));
        }
        // eslint-disable-next-line
    }, [debounceValue]);

    const handleDeleteCartItem = async (id) => {
        if (current) {
            setIsLoading(true);
            const response = await apiRemoveCartItem(id);
            setIsLoading(false);
            if (response.success) dispatch(getCurrentUser());
        } else dispatch(removeSessionCartItems({ id }));
    };

    return (
        <tbody>
            <tr className="border-b-[2px] border-gray-300">
                <th className="p-2">{index + 1}</th>
                <td className="p-2 flex items-center">
                    <img
                        alt="thumbnail"
                        src={el.product?.thumb}
                        className="h-[120px] min-w-[120px] object-cover rounded-md cursor-pointer"
                    ></img>
                    <div className="flex items-start flex-col justify-around p-4">
                        <h4 className="text-xl">{el.product?.title}</h4>
                        <p className="mb-2 line-clamp-2">{el.product?.uses}</p>
                        <IconsButton
                            styles="flex items-center justify-center w-6 h-6 cursor-pointer hover:scale-110"
                            handleOnclick={() => handleDeleteCartItem(el.product?._id || el.product?.id)}
                            icon={
                                isLoading ? (
                                    <Loading shape={<PuffLoader color="#f43f5e" size={24} />} />
                                ) : (
                                    <MdDelete color="#f43f5e" size={24} />
                                )
                            }
                        />
                    </div>
                </td>
                <td className="p-4 text-center font-bold">{formatPrice(el.product?.price)}</td>
                <td className="p-4">
                    <div className="flex justify-center">
                        <IconsButton
                            styles="calc-btn"
                            handleOnclick={() => handleCalcQuantity('plus')}
                            icon={<FaPlus />}
                        />
                        <input
                            className="p-2 text-center border-y-[1px] w-[40px] outline-none"
                            type="text"
                            value={quantity}
                            onChange={(e) => handleSetQuantity(e.target.value)}
                            onBlur={() => quantity === '' && setQuantity(1)}
                        />
                        <IconsButton
                            styles="calc-btn"
                            handleOnclick={() => handleCalcQuantity('minus')}
                            icon={<FaMinus />}
                        />
                    </div>
                </td>
                <td className="min-w-[150px] p-4 text-center text-red-500 font-bold">
                    {formatPrice(el.product?.price * quantity)}
                </td>
            </tr>
        </tbody>
    );
};

export default withComponent(memo(CartItemsTable));
