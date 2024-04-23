import { Button, IconsButton } from 'Layouts/Component/public/Common';
import { apiDeleteUser, apiUpdateUser } from 'Context/StoreApi';
import { memo, useEffect } from 'react';
import { block, roles } from 'Ultils/Contants';
import { InputForm } from 'Layouts/Component/public/Common';
import { useForm } from 'react-hook-form';
import { Icons } from 'Layouts/Assets/icons';
import { toast } from 'react-toastify';
import CustomSelect from 'Layouts/Component/public/Common/CustomSelect';
import moment from 'moment';
import Swal from 'sweetalert2';

const { MdDelete, MdEdit, IoIosSave, FaBackspace } = Icons;

const UserTable = ({ edit, setEdit, userInfo, updated, setUpdated }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        role: '',
        isBlocked: '',
    });

    const render = () => {
        setUpdated(!updated);
    };

    const handleUpdate = async (data) => {
        const response = await apiUpdateUser(data, edit._id);
        if (response.success) {
            render();
            setEdit(null);
            toast.success(response.message);
        } else toast.error(response.message);
    };

    const handleDeleteUser = (uid) => {
        Swal.fire({
            text: 'Bạn có chắc muốn xóa người dùng này?',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid);
                if (response.success) render();
            }
        });
    };

    useEffect(() => {
        if (edit)
            reset({
                firstname: edit?.firstname || '',
                lastname: edit?.lastname || '',
                phone: edit?.phone || '',
                email: edit?.email || '',
            });
        // eslint-disable-next-line
    }, [edit]);

    const handleChangeSelect = (selectedOption, id) => {
        setValue(id, selectedOption);
    };

    return (
        <form onSubmit={handleSubmit(handleUpdate)} className="w-full">
            <div className="max-tablet:overflow-x-auto">
                <table className="text-left w-full mt-4 text-sm">
                    <thead className="border border-primary bg-primary text-white">
                        <tr className="whitespace-nowrap">
                            <th className="px-4 py-2 text-center">#</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Họ</th>
                            <th className="px-4 py-2">Tên</th>
                            <th className="px-4 py-2">Điện thoại</th>
                            <th className="px-4 py-2">Vai trò</th>
                            <th className="px-4 py-2">Ngày tạo</th>
                            <th className="px-4 py-2">Trạng thái</th>
                            <th className="px-4 py-2">Chỉnh sửa</th>
                        </tr>
                    </thead>
                    <tbody className="border border-primary">
                        {userInfo?.map((el, index) => (
                            <tr key={el._id} className="border border-primary">
                                <td className="p-4">{index + 1}</td>
                                <td className="p-4 my-auto">
                                    {edit?._id === el._id ? (
                                        <InputForm
                                            register={register}
                                            errors={errors}
                                            defaultValue={edit?.email}
                                            id={'email'}
                                            validate={{
                                                required: 'Không được để trống',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Email không hợp lệ',
                                                },
                                            }}
                                            fullwidth
                                        />
                                    ) : (
                                        <span>{el.email}</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {edit?._id === el._id ? (
                                        <InputForm
                                            register={register}
                                            errors={errors}
                                            defaultValue={edit?.firstname}
                                            id={'firstname'}
                                            validate={{ required: 'Không được để trống' }}
                                            fullwidth
                                        />
                                    ) : (
                                        <span>{el.firstname}</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {edit?._id === el._id ? (
                                        <InputForm
                                            register={register}
                                            errors={errors}
                                            defaultValue={edit?.lastname}
                                            id={'lastname'}
                                            validate={{ required: 'Không được để trống' }}
                                            fullwidth
                                        />
                                    ) : (
                                        <span>{el.lastname}</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {edit?._id === el._id ? (
                                        <InputForm
                                            register={register}
                                            errors={errors}
                                            defaultValue={edit?.phone}
                                            id={'phone'}
                                            validate={{
                                                required: 'Không được để trống',
                                                pattern: {
                                                    value: /^[62|0]+\d{9}/gi,
                                                    message: 'Sđt không hợp lệ',
                                                },
                                            }}
                                            fullwidth
                                        />
                                    ) : (
                                        <span>{el.phone}</span>
                                    )}
                                </td>
                                <td className="p-4 min-w-[130px]">
                                    {edit?._id === el._id ? (
                                        <CustomSelect
                                            onChange={(selectedOption) =>
                                                handleChangeSelect(selectedOption.value, 'role')
                                            }
                                            options={roles.map((role) => ({ value: role.value, label: role.label }))}
                                            defaultValue={{
                                                value: el.role,
                                                label: el.role === 'pilgrims' ? 'User' : 'Admin',
                                            }}
                                        />
                                    ) : (
                                        <span>{roles.find((r) => r.value === el.role).label}</span>
                                    )}
                                </td>
                                <td className="p-4">{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                                <td className="p-4 min-w-[130px]">
                                    {edit?._id === el._id ? (
                                        <CustomSelect
                                            onChange={(selectedOption) =>
                                                handleChangeSelect(selectedOption.value, 'isBlocked')
                                            }
                                            options={block.map((role) => ({ value: role.value, label: role.label }))}
                                            defaultValue={{
                                                value: el.isBlocked,
                                                label: el.isBlocked ? 'Block' : 'Active',
                                            }}
                                        />
                                    ) : (
                                        <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {edit?._id === el._id ? (
                                        <div className="flex gap-2 whitespace-nowrap">
                                            <Button
                                                type="submit"
                                                styles="hover:scale-110 cursor-pointer"
                                                iconBefore={<IoIosSave color="#4ade80" size="28px" />}
                                            ></Button>
                                            <IconsButton
                                                handleOnclick={() => setEdit(null)}
                                                styles="hover:scale-110 cursor-pointer"
                                                icon={<FaBackspace color="#f87171" size="28px" />}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <IconsButton
                                                handleOnclick={() => setEdit(el)}
                                                styles="hover:scale-110 cursor-pointer"
                                                icon={<MdEdit color="#ca8a04" size="28px" />}
                                            />
                                            <IconsButton
                                                handleOnclick={() => handleDeleteUser(el._id)}
                                                styles="hover:scale-110 cursor-pointer"
                                                icon={<MdDelete color="#db2777" size="28px" />}
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </form>
    );
};

export default memo(UserTable);
