import { CloseModalButton, ModalUI, Button } from '../../Common';
import { showAuthOtpModal } from 'Context/Reducer/AppState/CommonAction';
import { memo, useState } from 'react';
import { apiverifyOTP } from 'Context/StoreApi';
import withComponent from 'Hocs/withComponent';
import Swal from 'sweetalert2';

const OTPRegisterAuthModal = ({ payload, useSelector, dispatch, resetValueInput }) => {
    const { isOtpModal } = useSelector((state) => state.appReducer);
    const [nonOTP, setNonOTP] = useState(false);
    const [otp, setOtp] = useState('');
    console.log(payload.email);
    const handleAuthOTP = async () => {
        const response = await apiverifyOTP({ otp, email: payload.email });
        if (response?.success) {
            Swal.fire('Congratulations', response?.message, 'success');
            dispatch(showAuthOtpModal({ isOtpModal: false }));
            setOtp('');
            resetValueInput();
        } else {
            if (otp === '') {
                setNonOTP(true);
            } else Swal.fire('Failure', response?.message, 'error');
            setOtp('');
            resetValueInput();
        }
    };

    const handleCloseModal = () => {
        dispatch(showAuthOtpModal({ isOtpModal: false }));
    };

    return (
        <ModalUI isOpen={isOtpModal} onClose={handleCloseModal}>
            <div className="relative flex flex-col justify-center bg-white rounded-md p-6 min-h-[100px] min-w-[400px] text-red-900">
                <p className="p-2 text-center">Nhập otp của bạn để đăng kí tài khoản</p>
                <label htmlFor="otp" className="absolute top-[50%] left-[30px] text-semibold text-sm bg-white px-1">
                    Otp
                </label>
                <div className="flex items-center">
                    <input
                        className="shadow w-full mt-4 mr-2 appearance-none border border-pink-300 rounded p-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder:italic placeholder:text-sm"
                        value={otp}
                        id="otp"
                        name="otp"
                        onChange={(e) => setOtp(e.target.value)}
                        onFocus={() => setNonOTP(false)}
                    />
                    <Button handleOnclick={handleAuthOTP}>Xác nhận</Button>
                </div>
                {nonOTP && <p className="text-xs text-red-500 italic py-2 font-semibold">Hãy nhập mã otp của bạn</p>}
                <CloseModalButton onClose={handleCloseModal} />
            </div>
        </ModalUI>
    );
};

export default withComponent(memo(OTPRegisterAuthModal));
