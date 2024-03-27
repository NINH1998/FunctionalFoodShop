import { Button, InputField } from '../Common';
import { resetPassword } from 'Context/StoreApi';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [payload, setPayload] = useState({ password: '' });

    const handleResetPassword = async () => {
        const password = payload.password;
        const response = await resetPassword({ password, token });
        if (response.success) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center rounded-xl p-6">
            <div className="w-[500px] p-4">
                <h3 className="font-bold text-center text-secondary mb-4">Đổi lại mật khẩu</h3>
                <InputField
                    value={payload.password}
                    id="password"
                    nameKey="password"
                    setValue={setPayload}
                    type="password"
                />
                <Button fw handleOnclick={handleResetPassword}>
                    Xác nhận
                </Button>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
