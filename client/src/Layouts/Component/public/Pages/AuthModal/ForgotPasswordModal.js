import { IconsButton, ModalUI, InputField, Button } from '../../Common';
import { showForgotPasswordModal } from 'Context/Reducer/AppState/CommonAction';
import { forgotPassword } from 'Context/StoreApi';
import { useState } from 'react';
import { validate } from 'Ultils/helper';
import { Icons } from 'Layouts/Assets/icons';
import withComponent from 'Hocs/withComponent';
import Swal from 'sweetalert2';

const { IoMdClose } = Icons;

const ForgotPasswordModal = ({ useSelector, dispatch }) => {
    const { isOpenForgotPasswordModal, invalidField } = useSelector((state) => state.appReducer);
    const [payload, setPayload] = useState({ email: '' });

    const handleForgotPassword = async () => {
        const invalid = validate(payload, dispatch);
        if (invalid === 0) {
            const response = await forgotPassword(payload);
            if (response.success) {
                Swal.fire('', response.message, 'success');
            } else Swal.fire('', response.message, 'error');
        }
    };

    const handleCloseModal = () => {
        dispatch(showForgotPasswordModal({ isOpenForgotPasswordModal: false }));
    };

    return (
        <>
            <ModalUI isOpen={isOpenForgotPasswordModal} onClose={handleCloseModal}>
                <div className="flex flex-col justify-center bg-white rounded-md p-6 min-h-[250px] min-w-[450px] z-[999]">
                    <h3 className="font-bold text-center text-secondary mb-2">Tìm mật khẩu</h3>
                    <p className="mb-2 p-2 text-center">Nhập email của bạn để tìm lại mật khẩu.</p>
                    <InputField
                        value={payload.email}
                        id="email"
                        nameKey="email"
                        setValue={setPayload}
                        invalidField={invalidField}
                        label
                    />
                    <Button handleOnclick={handleForgotPassword}>Xác nhận</Button>
                    <IconsButton
                        handleOnclick={handleCloseModal}
                        styles="absolute top-2 right-2 animation-200 cursor-pointer p-1 hover:bg-gray-200"
                        icon={<IoMdClose size={20} />}
                    />
                </div>
            </ModalUI>
        </>
    );
};

export default withComponent(ForgotPasswordModal);
