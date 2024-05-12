import { showAuthOtpModal, showForgotPasswordModal, showLoginModal } from 'Context/Reducer/AppState/CommonAction';
import { ModalUI, InputField, Button, Loading, CloseModalButton } from '../../Common';
import { useCallback, useEffect, useState } from 'react';
import { apiRegister, apiLogin } from 'Context/StoreApi';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { validate } from 'Ultils/helper';
import { login } from 'Context/Reducer/User/UserAction';
import { Icons } from 'Layouts/Assets/icons';
import OTPRegisterAuthModal from './OTPRegisterAuthModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import withComponent from 'Hocs/withComponent';
import Swal from 'sweetalert2';

const { IoLogoGoogleplus } = Icons;

const LoginModal = ({ dispatch, useSelector }) => {
    const { isOpenLoginModal, invalidField } = useSelector((state) => state.appReducer);
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [payload, setPayload] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
    });

    const resetValueInput = () => {
        setPayload({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            phone: '',
        });
    };

    useEffect(() => {
        resetValueInput();
    }, [isRegister]);

    const closeLoginModal = () => {
        dispatch(showLoginModal({ isOpenLoginModal: false }));
        resetValueInput();
    };

    const handleSubmit = useCallback(async () => {
        const { firstname, lastname, phone, ...data } = payload;
        const invalids = isRegister ? validate(payload, dispatch) : validate(data, dispatch);
        if (invalids === 0) {
            if (isRegister) {
                const response = await apiRegister(payload);
                if (response?.success) {
                    Swal.fire('Congratulations', response?.message, 'success');
                    dispatch(showAuthOtpModal({ isOtpModal: true }));
                    resetValueInput();
                } else Swal.fire('Failure', response?.message, 'error');
            } else {
                setIsLoading(true);
                const rs = await apiLogin(data);
                setIsLoading(false);
                if (rs?.success) {
                    dispatch(showLoginModal({ isOpenLoginModal: false }));
                    localStorage.setItem('user', JSON.stringify(rs.accessToken));
                    dispatch(
                        login({
                            isLoggedIn: true,
                            updateCurrent: true,
                            token: rs.accessToken,
                            current: rs.userdata,
                            currentCart: rs.userdata?.cart,
                        }),
                    );
                    dispatch(getCurrentUser());
                    resetValueInput();
                } else {
                    Swal.fire('Failure', rs?.message, 'error');
                }
            }
        }
        // eslint-disable-next-line
    }, [payload, isRegister]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !isRegister) {
            handleSubmit();
        }
    };

    const handleLoginGoogle = () => {
        window.open(process.env.REACT_APP_URL_GOOGLE_LOGIN, '_self');
    };

    return (
        <>
            {isLoading ? (
                <div className="fixed inset-0 z-[999] bg-overlay flex items-center justify-center">
                    <Loading color="white" />
                </div>
            ) : (
                <ModalUI isOpen={isOpenLoginModal} onClose={closeLoginModal}>
                    <div>
                        <CloseModalButton onClose={closeLoginModal} />
                        <div className="flex justify-center bg-white rounded-md p-6 min-h-[250px] min-w-[360px] iPadmini:min-w-[400px]">
                            <div className="w-full max-w-sm">
                                <h3 className="font-bold text-center text-primary mb-4">
                                    {isRegister ? 'Đăng kí' : 'Đăng nhập'}
                                </h3>
                                {isRegister && (
                                    <div className="flex gap-2">
                                        <InputField
                                            value={payload.firstname}
                                            nameKey="firstname"
                                            setValue={setPayload}
                                            invalidField={invalidField}
                                            label
                                        />
                                        <InputField
                                            value={payload.lastname}
                                            nameKey="lastname"
                                            setValue={setPayload}
                                            invalidField={invalidField}
                                            label
                                        />
                                    </div>
                                )}
                                {isRegister && (
                                    <InputField
                                        value={payload.phone}
                                        nameKey="phone"
                                        setValue={setPayload}
                                        invalidField={invalidField}
                                        label
                                    />
                                )}
                                <InputField
                                    value={payload.email}
                                    nameKey="email"
                                    setValue={setPayload}
                                    invalidField={invalidField}
                                    label
                                    onKeyDown={handleKeyPress}
                                />
                                <InputField
                                    value={payload.password}
                                    nameKey="password"
                                    setValue={setPayload}
                                    type="password"
                                    invalidField={invalidField}
                                    label
                                    onKeyDown={handleKeyPress}
                                />
                                <Button fw handleOnclick={handleSubmit}>
                                    {isRegister ? 'Đăng kí' : 'Đăng nhập'}
                                </Button>
                                {!isRegister && (
                                    <Button
                                        fw
                                        styles={'google-btn'}
                                        handleOnclick={handleLoginGoogle}
                                        iconBefore={<IoLogoGoogleplus size={24} />}
                                    >
                                        Đăng nhập bằng Google
                                    </Button>
                                )}
                                <div className="mt-4 flex justify-between text-sm">
                                    <p
                                        onClick={() =>
                                            dispatch(showForgotPasswordModal({ isOpenForgotPasswordModal: true }))
                                        }
                                        className="hover:underline ml-2 text-primary cursor-pointer"
                                    >
                                        {!isRegister && 'Quên mặt khẩu?'}
                                    </p>
                                    <div className="flex">
                                        <p>{isRegister ? 'Quay lại' : 'Không có tài khoản?'}</p>
                                        {!isRegister ? (
                                            <span className="link-btn-primary" onClick={() => setIsRegister(true)}>
                                                Đăng kí
                                            </span>
                                        ) : (
                                            <span className="link-btn-primary" onClick={() => setIsRegister(false)}>
                                                Đăng nhập
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <OTPRegisterAuthModal payload={payload} />
                    <ForgotPasswordModal />
                </ModalUI>
            )}
        </>
    );
};

export default withComponent(LoginModal);
