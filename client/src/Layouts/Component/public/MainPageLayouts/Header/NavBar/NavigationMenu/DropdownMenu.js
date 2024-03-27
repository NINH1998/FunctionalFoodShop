import {
    apiCreateProductCategory,
    apiCreateTitleItem,
    apiDeleteCategory,
    apiDeleteCategoryItem,
    apiEditTitle,
    apiEditTitleItem,
} from 'Context/StoreApi';
import { Button, IconsButton, InputForm } from '../../../../Common';
import { setUploadCategory } from 'Context/Reducer/Category/CategoryAction';
import { directCategory } from 'Context/Reducer/Products/ProductsAction';
import { memo, useEffect, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { createSlug } from 'Ultils/helper';
import { useForm } from 'react-hook-form';
import { Icons } from 'Layouts/Assets/icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withComponent from 'Hocs/withComponent';

const { MdDelete, MdEdit, RiArrowGoBackFill, GiCheckMark } = Icons;
const DropdownMenu = ({ dispatch, current, setIsDropdownMenu, setIsCancelMouseLeave }) => {
    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm({});
    const { categories, uploadCategory } = useSelector((state) => state.categoriesReducer);
    const [isTotalEdit, setIsTotalEdit] = useState(false);
    const [showEditItem, setShowEditItem] = useState(null);
    const [showEditTitle, setShowEditTitle] = useState(null);
    const [isEditTitle, setIsEditTitle] = useState(null);
    const [createNewItem, setCreateNewItem] = useState(null);
    const [createNew, setCreateNew] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [inputContent, setIinputContent] = useState('');
    const [phoneEditItem, setPhoneEditItem] = useState(false);

    useEffect(() => {
        if (window.innerWidth <= 640) {
            setPhoneEditItem(true);
        }
    }, []);

    const handleClickCategory = (category) => {
        dispatch(directCategory({ valueCategory: category }));
        setIsDropdownMenu(false);
    };

    const handleCreateCategory = async (data) => {
        await apiCreateProductCategory(data);
        setCreateNew(false);
        dispatch(setUploadCategory({ uploadCategory: !uploadCategory }));
    };

    const handleCreateCategoryItem = async (pcid) => {
        await apiCreateTitleItem({ pcid, data: { itemTitle: inputContent } });
        setCreateNewItem(null);
        dispatch(setUploadCategory({ uploadCategory: !uploadCategory }));
    };

    const handleEditCategory = async (pcid) => {
        await apiEditTitle({ pcid, data: { title: inputContent } });
        setIsEditTitle(null);
        dispatch(setUploadCategory({ uploadCategory: !uploadCategory }));
    };

    const handleEditCategoryItem = async ({ itemId, pcid }) => {
        await apiEditTitleItem({ pcid, data: { itemTitle: inputContent, itemId } });
        setEditItem(null);
        dispatch(setUploadCategory({ uploadCategory: !uploadCategory }));
    };

    const handleDeleteCategory = async (pcid) => {
        Swal.fire({
            text: 'Bạn có chắc muốn xóa?',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await apiDeleteCategory(pcid);
            }
        });

        dispatch(setUploadCategory({ uploadCategory: !uploadCategory }));
    };

    const handleDeleteCategoryItem = async ({ pcid, itemId }) => {
        await apiDeleteCategoryItem({ pcid, data: { itemId } });
        dispatch(setUploadCategory({ uploadCategory: !uploadCategory }));
    };

    const handleSetItemTitle = (e) => {
        setIinputContent(e.target.value);
    };

    const handleEditTotalMenu = () => {
        setIsCancelMouseLeave(true);
        setIsTotalEdit(true);
    };

    const handleResetEdit = () => {
        setIsTotalEdit(false);
        setCreateNew(false);
        setIsCancelMouseLeave(false);
    };

    return (
        <div className="flex flex-col max-h-[700px] phone:overflow-auto laptop:overflow-hidden cursor-default">
            <div className="flex phone:flex-col phone:min-w-[350px] iPadmini:flex-row">
                {categories?.map((el) => (
                    <div className="p-3" key={el._id}>
                        <div
                            className="relative min-w-[200px] flex gap-2 items-center justify-between uppercase p-2 border-b-2 border-gray-400"
                            onMouseEnter={() => setShowEditTitle(el._id)}
                            onMouseLeave={() => setShowEditTitle(null)}
                        >
                            {isEditTitle === el._id && isTotalEdit ? (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Nhập tiêu đề"
                                        className="text-sm font-normal border-2 border-gray-300 outline-none p-1 pr-12"
                                        onChange={handleSetItemTitle}
                                    ></input>
                                    <div className="flex absolute right-4 gap-2">
                                        <IconsButton
                                            handleOnclick={() => handleEditCategory(el._id)}
                                            icon={<GiCheckMark />}
                                        />

                                        <IconsButton
                                            handleOnclick={() => setIsEditTitle(null)}
                                            icon={<RiArrowGoBackFill />}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center ">
                                    <h4>{el.title}</h4>
                                    {(showEditTitle === el._id || phoneEditItem) && isTotalEdit && (
                                        <div className="flex gap-1 absolute right-2 bg-gray-200 shadow-md rounded p-1">
                                            <IconsButton
                                                handleOnclick={() => setIsEditTitle(el._id)}
                                                icon={<MdEdit color="gray" size={20} />}
                                            />

                                            <IconsButton
                                                handleOnclick={() => handleDeleteCategory(el._id)}
                                                icon={<MdDelete color="gray" size={20} />}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {el.listCategory?.map((item) => (
                            <div
                                className="flex gap-2 items-center justify-between w-full font-semibold"
                                key={item._id}
                                onMouseEnter={() => setShowEditItem(item._id)}
                                onMouseLeave={() => setShowEditItem(null)}
                            >
                                {editItem === item._id && isTotalEdit ? (
                                    <div className="relative p-2 border-b-2 flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Nhập loại"
                                            className="text-sm font-normal border-2 border-gray-300 outline-none p-1 pr-12"
                                            onChange={handleSetItemTitle}
                                        ></input>
                                        <div className="flex absolute right-4 gap-2">
                                            <IconsButton
                                                handleOnclick={() =>
                                                    handleEditCategoryItem({ itemId: item._id, pcid: el._id })
                                                }
                                                icon={<GiCheckMark />}
                                            />
                                            <IconsButton
                                                handleOnclick={() => setEditItem(null)}
                                                icon={<RiArrowGoBackFill />}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full flex">
                                        <Link to={`/${createSlug(item.itemTitle)}`} className="w-full">
                                            <div
                                                onClick={() => handleClickCategory(item.itemTitle)}
                                                className="flex justify-between items-center hover:bg-gray-100 border-b-2 animation-200 hover:text-main animation-200 text-gray-500 p-2"
                                            >
                                                {item.itemTitle}
                                            </div>
                                        </Link>
                                        {(showEditItem === item._id || phoneEditItem) && isTotalEdit && (
                                            <div className="flex gap-1 absolute top-1/2 translate-y-[-50%] right-2 bg-gray-200 shadow-md rounded p-1">
                                                <IconsButton
                                                    handleOnclick={() => setEditItem(item._id)}
                                                    icon={<MdEdit color="gray" size={20} />}
                                                />
                                                <IconsButton
                                                    handleOnclick={() =>
                                                        handleDeleteCategoryItem({ pcid: el._id, itemId: item._id })
                                                    }
                                                    icon={<MdDelete color="gray" size={20} />}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTotalEdit && (
                            <div>
                                {createNewItem === el._id && (
                                    <div className="relative p-2 border-b-2 flex">
                                        <input
                                            type="text"
                                            placeholder="Nhập loại"
                                            onChange={handleSetItemTitle}
                                            className="text-sm font-normal border-2 border-gray-300 outline-none p-1 w-full"
                                        ></input>
                                        <div className="flex absolute top-1/2 translate-y-[-50%] right-4 gap-2">
                                            <IconsButton
                                                handleOnclick={() => handleCreateCategoryItem(el._id)}
                                                icon={<GiCheckMark />}
                                            />
                                            <IconsButton
                                                handleOnclick={() => setCreateNewItem(null)}
                                                icon={<RiArrowGoBackFill />}
                                            />
                                        </div>
                                    </div>
                                )}
                                <IconsButton
                                    styles="flex justify-center items-center hover:bg-gray-100 border-b-2 animation-200 p-2 cursor-pointer"
                                    handleOnclick={() => setCreateNewItem(el._id)}
                                    icon={<IoIosAddCircle color="#9ca3af" size={20} />}
                                />
                            </div>
                        )}
                    </div>
                ))}
                {createNew && isTotalEdit && (
                    <form
                        className="flex flex-col items-center gap-2 ml-2 min-w-[200px] font-normal"
                        onSubmit={handleSubmit(handleCreateCategory)}
                    >
                        <InputForm
                            label={'Tiêu đề:'}
                            register={register}
                            errors={errors}
                            id={'title'}
                            containerStyle={'flex flex-col justify-center gap-2 min-h-[60px]'}
                            fullwidth
                            placeholder={'Nhập tên tiêu đề..'}
                        />
                        <InputForm
                            label={'Loại:'}
                            register={register}
                            errors={errors}
                            id={'itemTitle'}
                            containerStyle={'flex flex-col justify-center gap-2 min-h-[60px]'}
                            fullwidth
                            placeholder={'Nhập tên loại sản phẩm...'}
                        />
                        <Button type={'submit'}>Tạo mới</Button>
                    </form>
                )}
            </div>
            <div className="flex gap-2 items-center justify-center my-2">
                {isTotalEdit ? (
                    <div className="flex items-center gap-2">
                        <Button handleOnclick={handleResetEdit} moreStyle="text-sm">
                            Quay lại
                        </Button>
                        <Button handleOnclick={() => setCreateNew(true)} moreStyle="text-sm">
                            Tạo mục mới
                        </Button>
                    </div>
                ) : (
                    current?.role === 'enikk' && (
                        <Button handleOnclick={handleEditTotalMenu} moreStyle="text-sm">
                            Chỉnh sửa
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default withComponent(memo(DropdownMenu));
