import { useEffect, useState } from 'react';
import { Button, InputForm, Loading } from 'Layouts/Component/public/Common';
import { apiUpdateCurrent } from 'Context/StoreApi';
import { getCurrentUser } from 'Context/Reducer/User/UserApi';
import { Icons, Images } from 'Layouts/Assets/icons';
import { useSelector } from 'react-redux';
import { getBase64 } from 'Ultils/helper';
import { Skeleton } from 'antd';
import { useForm } from 'react-hook-form';
import withComponent from 'Hocs/withComponent';
import moment from 'moment';
import Swal from 'sweetalert2';
const { FaCamera } = Icons;

const Personal = ({ dispatch }) => {
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
        watch,
    } = useForm({});
    const { current, isLoading } = useSelector((state) => state.userReducer);
    const [avatar, setAvatar] = useState(null);
    const [isInfoLoading, setIsInfoLoading] = useState(false);

    useEffect(() => {
        reset({
            firstname: current?.firstname || '',
            lastname: current?.lastname || '',
            address: current?.address || '',
            phone: current?.phone || '',
            avatar: current?.avatar || '',
            emailAddress: current?.emailAddress || '',
        });
        // eslint-disable-next-line
    }, [current]);

    const handleUploadAvatar = async (file) => {
        const thumb = await getBase64(file);
        setAvatar(thumb);
    };

    useEffect(() => {
        if (watch('avatar') instanceof FileList && watch('avatar').length > 0) handleUploadAvatar(watch('avatar')[0]);
        // eslint-disable-next-line
    }, [watch('avatar')]);

    const handleChangeInfo = async (data) => {
        const formData = new FormData();
        if (data.avatar.length > 0) formData.append('avatar', data.avatar[0]);
        delete data.avatar;
        for (let i of Object.entries(data)) formData.append(i[0], i[1]);
        setIsInfoLoading(true);
        const response = await apiUpdateCurrent(formData);
        setIsInfoLoading(false);
        if (response.success) {
            dispatch(getCurrentUser());
            Swal.fire('', response.message, 'success');
        } else Swal.fire('', response.message, 'error');
    };

    return (
        <div className="p-6 w-full">
            {isInfoLoading && (
                <div className="fixed inset-0 h-full w-full bg-overlay z-[999] flex items-center justify-center">
                    <Loading color={'white'} />
                </div>
            )}

            <h3 className="px-4 uppercase border-b-2 text-primary">Thông tin cá nhân</h3>
            <form onSubmit={handleSubmit(handleChangeInfo)}>
                <div className="flex laptop:flex-row phone:flex-col justify-center gap-2 mt-4">
                    <div className="laptop:w-[20%]">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                {isLoading ? (
                                    <Skeleton.Avatar active shape="circle" size={150}></Skeleton.Avatar>
                                ) : (
                                    <img
                                        src={(avatar && avatar) || current?.avatar || Images.AvatarDefault}
                                        alt=""
                                        className="object-cover mt-4 phone:w-[100px] phone:h-[100px] laptop:w-[130px] laptop:h-[130px] rounded-full"
                                    />
                                )}
                                <input id="avatar" type="file" hidden {...register('avatar')} />
                                <label
                                    htmlFor="avatar"
                                    className="absolute bottom-[-5px] right-[-5px] p-2 bg-gray-200 text-white shadow-small rounded-md cursor-pointer hover:bg-gray-300"
                                >
                                    <FaCamera color="gray" size={24} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="relative laptop:w-[70%]">
                        <div className="flex flex-col laptop:gap-2">
                            <div className="laptop:flex laptop:gap-4">
                                <InputForm
                                    label={'Họ:'}
                                    register={register}
                                    errors={errors}
                                    id={'firstname'}
                                    fullwidth
                                    placeholder={'Nhập họ...'}
                                />
                                <InputForm
                                    label={'Tên:'}
                                    register={register}
                                    errors={errors}
                                    id={'lastname'}
                                    validate={{ required: 'Không được để trống' }}
                                    fullwidth
                                    placeholder={'Nhập tên...'}
                                />
                            </div>
                            <InputForm
                                label={'Địa chỉ:'}
                                register={register}
                                errors={errors}
                                id={'address'}
                                fullwidth
                                placeholder={'Nhập địa chỉ...'}
                            />
                            <InputForm
                                label={'Địa chỉ email:'}
                                register={register}
                                errors={errors}
                                id={'emailAddress'}
                                validate={{
                                    pattern: {
                                        value: /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/,
                                        message: 'Email không hợp lệ',
                                    },
                                }}
                                fullwidth
                                placeholder={'Nhập địa chỉ...'}
                            />
                            <InputForm
                                label={'Số điện thoại:'}
                                register={register}
                                errors={errors}
                                id={'phone'}
                                validate={{
                                    pattern: {
                                        value: /^[62|0]+\d{9}/gi,
                                        message: 'Sđt không hợp lệ',
                                    },
                                }}
                                fullwidth
                                placeholder={'Nhập số điện thoại...'}
                            />
                            <div className="text-sm text-end">Created at: {moment(current?.createdAt).fromNow()}</div>
                            <div className="text-sm text-end">
                                Role: {current?.role === 'enikk ' ? 'Admin' : 'User'}
                            </div>
                        </div>
                        <div className="text-end">
                            <Button>Thay đổi</Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default withComponent(Personal);
