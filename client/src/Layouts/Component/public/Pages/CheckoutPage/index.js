import { apiCreateBill, apiRemoveAllCart } from 'Context/StoreApi';
import { showCartButtonModal } from 'Context/Reducer/AppState/CommonAction';
import { memo, useEffect } from 'react';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { BreadCrumb } from '..';
import { useForm } from 'react-hook-form';
import { Images } from 'Layouts/Assets/icons';
import withComponent from 'Hocs/withComponent';
import UserPaymentInfo from './UserPaymentInfo';
import CheckoutProcess from './CheckoutProcess';
import Swal from 'sweetalert2';
import path from 'Router/path';

const CheckoutPage = ({ currentCart, navigate, dispatch, current, useSelector }) => {
    const {
        formState: { errors },
        handleSubmit,
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        reset,
    } = useForm({
        defaultValues: {
            payments: 'Thanh toán khi nhận hàng',
        },
    });
    const { cartSession } = useSelector((state) => state.appReducer);
    const handleRadioChange = (value) => {
        const currentValue = watch('payments');
        const newValue = currentValue === value ? null : value;
        setValue('payments', newValue);
        clearErrors('payments');
    };

    useEffect(() => {
        dispatch(showCartButtonModal({ isCartButtonModal: false }));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        reset({
            name: current?.firstname + current?.lastname || '',
            emailAddress: current?.emailAddress || '',
            address: current?.address || '',
            phone: current?.phone || '',
        });
        // eslint-disable-next-line
    }, [current]);

    const handlePayment = async (data) => {
        if (!data.payments) {
            setError('payments', {
                type: 'manual',
                message: '*Vui lòng chọn phương thức thanh toán.',
            });
            return;
        }
        Swal.fire({
            text: 'Bạn có xác nhận đặt hàng?',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiCreateBill({
                    products: current ? currentCart : cartSession,
                    total: (current ? currentCart : cartSession)?.reduce((num, el) => el.product.price + num, 0),
                    _id: current?._id,
                    payments: data.payments,
                    name: data.name,
                    phone: data.phone,
                    emailAddress: data.emailAddress,
                    subName: data.subName,
                    subPhone: data.subPhone,
                    address: data.address,
                });
                if (response.success) {
                    Swal.fire({
                        html: response.message,
                        icon: 'success',
                        confirmButtonText: 'Quay lại trang chủ',
                    }).then(async () => {
                        navigate(`/${path.HOMEPAGE}`);
                        if (current) {
                            await apiRemoveAllCart({ userId: current._id });
                            dispatch(getCurrentUser());
                        }
                    });
                } else {
                    Swal.fire({
                        html: response.message,
                        icon: 'error',
                        confirmButtonText: 'Đóng',
                    });
                }
            }
        });
    };

    return (
        <div className="w-full">
            <div className="flex w-full px-6 py-3 text-end bg-gray-200">
                <BreadCrumb />
            </div>
            <div className="laptop:w-main w-full m-auto">
                <form onSubmit={handleSubmit(handlePayment)}>
                    <div className="my-8 p-4">
                        <UserPaymentInfo
                            errors={errors}
                            register={register}
                            handleRadioChange={handleRadioChange}
                            watch={watch}
                        />
                        <CheckoutProcess />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withComponent(memo(CheckoutPage));
